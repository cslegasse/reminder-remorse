const API_URL = 'http://localhost:8000/api'

export async function fetchEndpoint(endpoint:string, method: 'POST'|'GET', data:object|null=null) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : null,
    });
  
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  
    return response.json();
}