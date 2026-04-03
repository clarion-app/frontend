import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatePackageName } from '../validation/validatePackageName';

// Mock import.meta.hot
const mockHotSend = vi.fn();

vi.mock('../Echo', () => ({}));

beforeEach(() => {
  mockHotSend.mockClear();
});

// Simulate the validation logic from clarionAppsListener
const simulateInstall = (packageName: string): boolean => {
  if (!packageName || packageName.length === 0) return false;
  if (!validatePackageName(packageName)) return false;
  mockHotSend('frontend:from-client', { install: packageName });
  return true;
};

const simulateUninstall = (packageName: string): boolean => {
  if (!packageName || packageName.length === 0) return false;
  if (!validatePackageName(packageName)) return false;
  mockHotSend('frontend:from-client', { uninstall: packageName });
  return true;
};

describe('clarionAppsListener package name validation', () => {
  it('rejects malicious package names with shell metacharacters for install', () => {
    simulateInstall('; rm -rf /');
    expect(mockHotSend).not.toHaveBeenCalled();
  });

  it('rejects malicious package names with shell metacharacters for uninstall', () => {
    simulateUninstall('&& evil-command');
    expect(mockHotSend).not.toHaveBeenCalled();
  });

  it('accepts valid scoped package names for install', () => {
    simulateInstall('@clarion-app/types');
    expect(mockHotSend).toHaveBeenCalledWith('frontend:from-client', { install: '@clarion-app/types' });
  });

  it('accepts valid simple package names for install', () => {
    simulateInstall('react');
    expect(mockHotSend).toHaveBeenCalledWith('frontend:from-client', { install: 'react' });
  });

  it('accepts valid simple package names for uninstall', () => {
    simulateUninstall('lodash');
    expect(mockHotSend).toHaveBeenCalledWith('frontend:from-client', { uninstall: 'lodash' });
  });
});

