/**
 * Validates npm package names to prevent shell injection attacks.
 * Follows npm naming rules: optional @scope/, then lowercase alphanumeric with hyphens and dots.
 * Rejects shell metacharacters, uppercase letters, spaces, and names > 214 characters.
 */
export const validatePackageName = (name: string): boolean => {
  if (!name) return false;
  if (name.length > 214) return false;
  // Matches valid npm package names: optional @scope/, then lowercase alphanumeric, hyphens, dots, tildes
  const npmNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  return npmNameRegex.test(name);
};
