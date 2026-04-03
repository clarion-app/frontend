/**
 * Validates a post-login redirect URL to prevent open redirect attacks.
 * Returns the URL only if it is a safe relative internal path.
 * Returns null for external URLs, javascript: URIs, protocol-relative URLs, or empty input.
 */
export const validateRedirect = (url: string): string | null => {
  if (!url) return null;
  // Must start with exactly one / (not //) and contain only safe path characters
  // Rejects protocol-relative URLs (//), external URLs, and javascript: URIs
  const safe = /^\/[^/][a-zA-Z0-9\-/_.\?&=]*$/.test(url) || url === '/';
  return safe ? url : null;
};
