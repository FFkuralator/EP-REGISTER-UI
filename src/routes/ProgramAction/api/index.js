import { API_BASE_URL } from "../../../api/api";

export const fetchOptions = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}?lang=ru`, {
      headers: { }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.result || [];
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return [];
  }
};

export const submitProgram = async (action, data) => {
  return fetch(`${API_BASE_URL}/educational_program/${action}?lang=ru`, {
    method: action === "add" ? "POST" : "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const fetchProgram = async (id) => {
  const response = await fetch(`${API_BASE_URL}/educational_program/hierarchy?educational_program_id=${id}&lang=ru`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result.result[0];
};