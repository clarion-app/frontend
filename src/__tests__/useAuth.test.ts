import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Mock navigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Minimal Redux store with loggedInUser slice
import { createSlice } from '@reduxjs/toolkit';

const loggedInUserSlice = createSlice({
  name: 'loggedInUser',
  initialState: { value: { id: '', name: '', email: '' }, status: 'idle' as const },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

function makeStore() {
  return configureStore({
    reducer: { loggedInUser: loggedInUserSlice.reducer },
  });
}

function wrapper({ children }: { children: React.ReactNode }) {
  const store = makeStore();
  return React.createElement(
    Provider,
    { store },
    React.createElement(MemoryRouter, null, children)
  );
}

describe('useAuth', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    navigateMock.mockReset();
  });

  it('dispatches user state on successful /api/user/me fetch', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: '1', name: 'Test User', email: 'test@example.com' } }),
    });

    const { useAuth } = await import('../auth/useAuth');
    const store = makeStore();
    const wrapperWithStore = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        Provider,
        { store },
        React.createElement(MemoryRouter, null, children)
      );

    renderHook(() => useAuth(), { wrapper: wrapperWithStore });

    await waitFor(() => {
      const state = store.getState();
      expect(state.loggedInUser.value.id).toBe('1');
      expect(state.loggedInUser.value.name).toBe('Test User');
    });
  });

  it('redirects to /login on 401 response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { useAuth } = await import('../auth/useAuth');
    renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login');
    });
  });

  it('does not redirect on network error (treats as unauthenticated gracefully)', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const { useAuth } = await import('../auth/useAuth');
    renderHook(() => useAuth(), { wrapper });

    // Wait briefly - no navigation on network errors
    await new Promise((r) => setTimeout(r, 50));
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
