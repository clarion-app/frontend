import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the store module
vi.mock('../build/store', () => ({
  store: {
    getState: vi.fn(() => ({ token: { value: '' } })),
  },
}));

// We import after mocking
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('fetchAndThen', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAndThen', () => {
    it('sends request with credentials:include', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      const { getAndThen } = await import('../fetchAndThen');
      const andThen = vi.fn();
      await new Promise<void>((resolve) => {
        getAndThen('http://localhost/api/test', (data: unknown) => {
          andThen(data);
          resolve();
        });
      });

      const [, options] = fetchMock.mock.calls[0];
      expect(options.credentials).toBe('include');
    });

    it('does not send Authorization header', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { getAndThen } = await import('../fetchAndThen');
      await new Promise<void>((resolve) => {
        getAndThen('http://localhost/api/test', () => resolve());
      });

      const [, options] = fetchMock.mock.calls[0];
      expect(options.headers?.Authorization).toBeUndefined();
    });

    it('throws on non-ok response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const { getAndThen } = await import('../fetchAndThen');
      await expect(
        new Promise<void>((resolve, reject) => {
          getAndThen('http://localhost/api/test', resolve).catch(reject);
        })
      ).rejects.toThrow();
    });
  });

  describe('postAndThen', () => {
    it('sends POST with credentials:include', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { postAndThen } = await import('../fetchAndThen');
      const andThen = vi.fn();
      await new Promise<void>((resolve) => {
        postAndThen('http://localhost/api/test', { key: 'value' }, (data: unknown) => {
          andThen(data);
          resolve();
        });
      });

      const [, options] = fetchMock.mock.calls[0];
      expect(options.credentials).toBe('include');
      expect(options.method).toBe('post');
    });

    it('does not include Authorization header on POST', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { postAndThen } = await import('../fetchAndThen');
      await new Promise<void>((resolve) => {
        postAndThen('http://localhost/api/test', {}, () => resolve());
      });

      const [, options] = fetchMock.mock.calls[0];
      expect(options.headers?.Authorization).toBeUndefined();
    });

    it('throws on error response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const { postAndThen } = await import('../fetchAndThen');
      await expect(
        new Promise<void>((resolve, reject) => {
          postAndThen('http://localhost/api/test', {}, resolve).catch(reject);
        })
      ).rejects.toThrow();
    });
  });
});
