const USER_KEY = "hisaabkitaab_user";
const TOKEN_KEY = "hisaabkitaab_token";
const EXPIRY_KEY = "hisaabkitaab_token_expiry";
const REMEMBER_KEY = "hisaabkitaab_remember_me";

const ONE_HOUR = 60 * 60 * 1000;

export const saveAuthData = (userData, rememberMe) => {
  clearAuthData();

  if (rememberMe) {
    const expiryTime = Date.now() + ONE_HOUR;

    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, userData.token);
    localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
    localStorage.setItem(REMEMBER_KEY, "true");
  } else {
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
    sessionStorage.setItem(TOKEN_KEY, userData.token);
    sessionStorage.setItem(REMEMBER_KEY, "false");
  }
};

export const getRememberedToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  const rememberMe = localStorage.getItem(REMEMBER_KEY);

  if (!token || !expiry || rememberMe !== "true") {
    return null;
  }

  if (Date.now() > Number(expiry)) {
    clearAuthData();
    return null;
  }

  return token;
};

export const hasValidRememberedSession = () => {
  return Boolean(getRememberedToken());
};

export const getAuthToken = () => {
  const rememberedToken = getRememberedToken();

  if (rememberedToken) {
    return rememberedToken;
  }

  return sessionStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = () => {
  const localUser = localStorage.getItem(USER_KEY);
  const localExpiry = localStorage.getItem(EXPIRY_KEY);
  const rememberMe = localStorage.getItem(REMEMBER_KEY);

  if (localUser && localExpiry && rememberMe === "true") {
    if (Date.now() > Number(localExpiry)) {
      clearAuthData();
      return null;
    }

    return JSON.parse(localUser);
  }

  const sessionUser = sessionStorage.getItem(USER_KEY);
  return sessionUser ? JSON.parse(sessionUser) : null;
};

export const isAuthenticated = () => {
  return Boolean(getAuthToken());
};

export const clearAuthData = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  localStorage.removeItem(REMEMBER_KEY);

  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REMEMBER_KEY);
};