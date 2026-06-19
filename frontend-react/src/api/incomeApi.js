const API_BASE_URL = "http://localhost:8080/api/incomes";

const getToken = () => {
  return localStorage.getItem("hisaabkitaab_token");
};

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