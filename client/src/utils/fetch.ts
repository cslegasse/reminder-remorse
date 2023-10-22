// const API_URL = 'http://localhost:8000/api'
import { API_URL } from "@/config";

export async function fetchEndpoint(
  endpoint: string,
  method: "POST" | "GET",
  data: object | null = null
) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: data ? JSON.stringify(data) : null,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
