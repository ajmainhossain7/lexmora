export const getSessionToken = () => {
  if (typeof window === 'undefined') return '';
  const name = "better-auth.session_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const getAuthHeaders = () => {
  const token = getSessionToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getUserSession = async () => {
  if (typeof window !== 'undefined') return null;
  const { headers } = await import('next/headers');
  const { auth } = await import('../auth');
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList
  });
  return session?.user || null;
};
