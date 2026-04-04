import fs from 'fs';
import path from 'path';

export interface SslEnvVars {
  VITE_SSL_CERT_FILE?: string;
  VITE_SSL_KEY_FILE?: string;
  VITE_HOST?: string;
}

export interface SslConfig {
  certPath: string;
  keyPath: string;
  host: string;
}

export function validateSslEnv(env: SslEnvVars, rootDir: string): SslConfig {
  if (!env.VITE_SSL_CERT_FILE) {
    throw new Error('VITE_SSL_CERT_FILE is not set in .env. This must point to your SSL certificate PEM file.');
  }
  if (!env.VITE_SSL_KEY_FILE) {
    throw new Error('VITE_SSL_KEY_FILE is not set in .env. This must point to your SSL private key PEM file.');
  }
  if (!env.VITE_HOST) {
    throw new Error('VITE_HOST is not set in .env. This must be the IP or hostname matching your SSL certificate.');
  }

  const certPath = path.resolve(rootDir, env.VITE_SSL_CERT_FILE);
  const keyPath = path.resolve(rootDir, env.VITE_SSL_KEY_FILE);

  if (!fs.existsSync(certPath)) {
    throw new Error(`SSL certificate file not found: ${certPath} (from VITE_SSL_CERT_FILE=${env.VITE_SSL_CERT_FILE})`);
  }
  if (!fs.existsSync(keyPath)) {
    throw new Error(`SSL key file not found: ${keyPath} (from VITE_SSL_KEY_FILE=${env.VITE_SSL_KEY_FILE})`);
  }

  try {
    fs.accessSync(certPath, fs.constants.R_OK);
  } catch {
    throw new Error(`SSL certificate file is not readable: ${certPath}`);
  }
  try {
    fs.accessSync(keyPath, fs.constants.R_OK);
  } catch {
    throw new Error(`SSL key file is not readable: ${keyPath}`);
  }

  return { certPath, keyPath, host: env.VITE_HOST };
}
