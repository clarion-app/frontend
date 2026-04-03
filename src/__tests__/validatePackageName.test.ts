import { describe, it, expect } from 'vitest';
import { validatePackageName } from '../validation/validatePackageName';

describe('validatePackageName', () => {
  it('accepts valid simple package names', () => {
    expect(validatePackageName('react')).toBe(true);
    expect(validatePackageName('lodash')).toBe(true);
    expect(validatePackageName('my-package')).toBe(true);
    expect(validatePackageName('package.name')).toBe(true);
  });

  it('accepts valid scoped package names', () => {
    expect(validatePackageName('@scope/package')).toBe(true);
    expect(validatePackageName('@clarion-app/types')).toBe(true);
    expect(validatePackageName('@my-org/my-package')).toBe(true);
  });

  it('rejects shell metacharacters', () => {
    expect(validatePackageName('; rm -rf /')).toBe(false);
    expect(validatePackageName('name && bad')).toBe(false);
    expect(validatePackageName('package|bad')).toBe(false);
    expect(validatePackageName('package`bad`')).toBe(false);
    expect(validatePackageName('package$bad')).toBe(false);
    expect(validatePackageName('package>bad')).toBe(false);
    expect(validatePackageName('package<bad')).toBe(false);
  });

  it('rejects empty input', () => {
    expect(validatePackageName('')).toBe(false);
    expect(validatePackageName(null as unknown as string)).toBe(false);
    expect(validatePackageName(undefined as unknown as string)).toBe(false);
  });

  it('rejects names exceeding 214 characters', () => {
    const longName = 'a'.repeat(215);
    expect(validatePackageName(longName)).toBe(false);
  });

  it('accepts names at exactly 214 characters', () => {
    const maxName = 'a'.repeat(214);
    expect(validatePackageName(maxName)).toBe(true);
  });

  it('rejects uppercase letters', () => {
    expect(validatePackageName('MyPackage')).toBe(false);
    expect(validatePackageName('PACKAGE')).toBe(false);
  });

  it('rejects names with spaces', () => {
    expect(validatePackageName('my package')).toBe(false);
    expect(validatePackageName(' package')).toBe(false);
  });
});
