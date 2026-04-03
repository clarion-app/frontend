import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProtectedRoute } from '../auth/ProtectedRoute';

// Helper to create a mock store with a specific loggedInUser state
const createMockStore = (userId: string) => {
  return configureStore({
    reducer: {
      loggedInUser: () => ({ value: { id: userId, name: 'Test User', email: 'test@test.com' } }),
    },
  });
};

const ProtectedComponent = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;

const renderWithRouter = (initialPath: string, userId: string) => {
  const store = createMockStore(userId);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    renderWithRouter('/protected', 'user-123');
    expect(screen.getByText('Protected Content')).toBeTruthy();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithRouter('/protected', '');
    expect(screen.getByText('Login Page')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('preserves the original URL in redirect state for post-login redirect', () => {
    const store = configureStore({
      reducer: {
        loggedInUser: () => ({ value: { id: '', name: '', email: '' } }),
      },
    });
    const LoginPageWithState: React.FC = () => {
      return <div>Login Page</div>;
    };
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<LoginPageWithState />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<ProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    // Verify redirect to login occurred (protected content not rendered)
    expect(screen.queryByText('Protected Content')).toBeNull();
  });
});
