/**
 * Access tokens live in memory only (never localStorage) so XSS cannot read them from storage.
 * PREFERRED PRODUCTION SETUP: the backend issues an httpOnly, Secure, SameSite cookie and no
 * token is exposed to JavaScript at all; this in-memory slot is then simply unused.
 */
let accessToken: string | null = null;

export const tokenStorage = {
  get: () => accessToken,
  set: (token: string | null | undefined) => {
    accessToken = token ?? null;
  },
  clear: () => {
    accessToken = null;
  },
};
