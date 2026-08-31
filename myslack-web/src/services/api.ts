// Dynamic Base API & SignalR Hub Resolution for Hybrid Network (Cloud & Local Wi-Fi LAN)
const HOST_IP = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL = `http://${HOST_IP}:5000/api`;
export const SIGNALR_HUB_URL = `http://${HOST_IP}:5000/hubs/chat`;

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('myslack_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  public async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API GET request failed with status ${response.status}`);
    }

    return response.json();
  }

  public async post<T>(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API POST request failed with status ${response.status}`);
    }

    return response.json();
  }

  public async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('myslack_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed with status ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiClient();
