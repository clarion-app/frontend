import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { validateSslEnv } from '../ssl-validation';

const ROOT_DIR = '/fake/project';

describe('validateSslEnv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('missing env vars', () => {
    it('throws a clear error when VITE_SSL_CERT_FILE is missing', () => {
      expect(() => validateSslEnv({}, ROOT_DIR)).toThrow('VITE_SSL_CERT_FILE is not set');
    });

    it('throws a clear error when VITE_SSL_KEY_FILE is missing', () => {
      expect(() =>
        validateSslEnv({ VITE_SSL_CERT_FILE: '../cert.pem' }, ROOT_DIR),
      ).toThrow('VITE_SSL_KEY_FILE is not set');
    });

    it('throws a clear error when VITE_HOST is missing', () => {
      expect(() =>
        validateSslEnv(
          { VITE_SSL_CERT_FILE: '../cert.pem', VITE_SSL_KEY_FILE: '../key.pem' },
          ROOT_DIR,
        ),
      ).toThrow('VITE_HOST is not set');
    });
  });

  describe('missing cert files', () => {
    it('throws when cert file does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);

      expect(() =>
        validateSslEnv(
          { VITE_SSL_CERT_FILE: '../cert.pem', VITE_SSL_KEY_FILE: '../key.pem', VITE_HOST: '192.168.1.1' },
          ROOT_DIR,
        ),
      ).toThrow('SSL certificate file not found');
    });

    it('throws when key file does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
        return String(p) === path.resolve(ROOT_DIR, '../cert.pem');
      });

      expect(() =>
        validateSslEnv(
          { VITE_SSL_CERT_FILE: '../cert.pem', VITE_SSL_KEY_FILE: '../key.pem', VITE_HOST: '192.168.1.1' },
          ROOT_DIR,
        ),
      ).toThrow('SSL key file not found');
    });
  });

  describe('unreadable cert files', () => {
    it('throws when cert file is not readable', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'accessSync').mockImplementation((p) => {
        if (String(p) === path.resolve(ROOT_DIR, '../cert.pem')) {
          throw new Error('EACCES');
        }
      });

      expect(() =>
        validateSslEnv(
          { VITE_SSL_CERT_FILE: '../cert.pem', VITE_SSL_KEY_FILE: '../key.pem', VITE_HOST: '192.168.1.1' },
          ROOT_DIR,
        ),
      ).toThrow('SSL certificate file is not readable');
    });

    it('throws when key file is not readable', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'accessSync').mockImplementation((p) => {
        if (String(p) === path.resolve(ROOT_DIR, '../key.pem')) {
          throw new Error('EACCES');
        }
      });

      expect(() =>
        validateSslEnv(
          { VITE_SSL_CERT_FILE: '../cert.pem', VITE_SSL_KEY_FILE: '../key.pem', VITE_HOST: '192.168.1.1' },
          ROOT_DIR,
        ),
      ).toThrow('SSL key file is not readable');
    });
  });

  describe('valid configuration', () => {
    it('returns resolved paths and host when all inputs are valid', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'accessSync').mockImplementation(() => {});

      const result = validateSslEnv(
        { VITE_SSL_CERT_FILE: '../cert.pem', VITE_SSL_KEY_FILE: '../key.pem', VITE_HOST: '192.168.1.1' },
        ROOT_DIR,
      );

      expect(result).toEqual({
        certPath: path.resolve(ROOT_DIR, '../cert.pem'),
        keyPath: path.resolve(ROOT_DIR, '../key.pem'),
        host: '192.168.1.1',
      });
    });
  });
});
