import { getAuthToken, clearAuthData } from "../utils/authStorage";

const API_BASE_URL = "http://localhost:8080/api/budgets";

const getToken = () => getAuthToken();

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getBudgets = async () => {
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
    throw new Error("Failed to fetch budgets");
  }

  return response.json();
};

export const createBudget = async (budgetData) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData),
  });

  if (!response.ok) {
    throw new Error("Failed to create budget");
  }

  return response.json();
};

export const updateBudget = async (id, budgetData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData),
  });

  if (!response.ok) {
    throw new Error("Failed to update budget");
  }

  return response.json();
};

export const deleteBudget = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete budget");
  }

  return true;
};