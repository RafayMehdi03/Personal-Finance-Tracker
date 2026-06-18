const API_BASE_URL = "http://localhost:8080/api/expenses";

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

export const getExpenses = async () => {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return response.json();
};

export const createExpense = async (expenseData) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  return response.json();
};

export const deleteExpense = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }

  return true;
};