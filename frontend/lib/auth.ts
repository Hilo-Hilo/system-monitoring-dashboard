const isBrowser = typeof window !== 'undefined';

export const auth = {
  setToken: (token: string) => {
    if (isBrowser) {
      localStorage.setItem('auth_token', token);
    }
  },
  
  getToken: () => {
    if (isBrowser) {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  
  removeToken: () => {
    if (isBrowser) {
      localStorage.removeItem('auth_token');
    }
  },
  
  isAuthenticated: () => {
    if (isBrowser) {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  },
};

