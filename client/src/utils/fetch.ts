const API_URL = 'http://localhost:8000'

export async function fetchEndpoint(endpoint:string, method: 'POST'|'GET', data:object={}) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  
    return response.json();
}