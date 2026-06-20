import { clearAuthData, getAuthToken } from "../utils/authStorage";

const API_BASE_URL = "http://localhost:8080/api/settings";

const getAuthHeaders = () => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleAuthError = (response) => {
  if (response.status === 401 || response.status === 403) {
    clearAuthData();
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }
};

export const changePassword = async (passwordData) => {
  const response = await fetch(`${API_BASE_URL}/change-password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });

  handleAuthError(response);

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        data.detail ||
        "Failed to change password"
    );
  }

  return data;
};