import { describe, it, expect } from 'vitest';
import { validateRedirect } from '../auth/validateRedirect';

describe('validateRedirect', () => {
  it('returns valid relative paths starting with /', () => {
    expect(validateRedirect('/')).toBe('/');
    expect(validateRedirect('/dashboard')).toBe('/dashboard');
    expect(validateRedirect('/user/profile')).toBe('/user/profile');
    expect(validateRedirect('/page?query=1&other=2')).toBe('/page?query=1&other=2');
    expect(validateRedirect('/path/with.dots')).toBe('/path/with.dots');
    expect(validateRedirect('/path-with-hyphens_and_underscores')).toBe('/path-with-hyphens_and_underscores');
  });

  it('returns null for external URLs', () => {
    expect(validateRedirect('https://evil.com')).toBeNull();
    expect(validateRedirect('http://evil.com')).toBeNull();
    expect(validateRedirect('https://evil.com/path')).toBeNull();
    expect(validateRedirect('//evil.com')).toBeNull();
  });

  it('returns null for javascript: URIs', () => {
    expect(validateRedirect('javascript:alert(1)')).toBeNull();
    expect(validateRedirect('javascript:void(0)')).toBeNull();
  });

  it('returns null for data: URIs', () => {
    expect(validateRedirect('data:text/html,<script>alert(1)</script>')).toBeNull();
  });

  it('returns null for protocol-relative URLs', () => {
    expect(validateRedirect('//example.com')).toBeNull();
    expect(validateRedirect('//example.com/path')).toBeNull();
  });

  it('returns null for empty or null-like input', () => {
    expect(validateRedirect('')).toBeNull();
    expect(validateRedirect(null as unknown as string)).toBeNull();
    expect(validateRedirect(undefined as unknown as string)).toBeNull();
  });

  it('returns null for paths not starting with /', () => {
    expect(validateRedirect('relative/path')).toBeNull();
    expect(validateRedirect('evil.com')).toBeNull();
  });
});
