import { getAuthToken, clearAuthData } from "../utils/authStorage";

const API_BASE_URL = "http://localhost:8080/api/incomes";

const getToken = () => getAuthToken();

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getIncomes = async () => {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (response.status === 401 || response.status === 403) {
    clearAuthData();
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch incomes");
  }

  return response.json();
};

export const createIncome = async (incomeData) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(incomeData),
  });

  if (!response.ok) {
    throw new Error("Failed to create income");
  }

  return response.json();
};

export const updateIncome = async (id, incomeData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(incomeData),
  });

  if (!response.ok) {
    throw new Error("Failed to update income");
  }

  return response.json();
};

export const deleteIncome = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete income");
  }

  return true;
};