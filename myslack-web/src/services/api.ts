import { registerSupabaseUser, fetchSupabaseUsers } from './supabaseClient';

// Dynamic Base API & SignalR Hub Resolution for Hybrid Network (Cloud, Online Tunnel & Local Wi-Fi LAN)
const HOST_IP = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const isRelativeRoute = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.protocol === 'https:' || window.location.hostname !== 'localhost');
export const API_BASE_URL = isRelativeRoute ? '/api' : `http://${HOST_IP}:5000/api`;
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

  // Central Database Auth & Sync Methods
  public async registerCentralUser(data: {
    displayName: string;
    email: string;
    role: string;
    currentTask?: string;
    devPasscode?: string;
    clientIp?: string;
  }) {
    // Sync with Supabase Cloud DB
    registerSupabaseUser({
      displayName: data.displayName,
      email: data.email,
      role: data.role,
      currentTask: data.currentTask,
      clientIp: data.clientIp,
      isApproved: data.role !== 'developer' || data.devPasscode === 'DEV-SECRET-2026',
    }).catch((e) => console.warn('Supabase cloud sync skipped:', e));

    try {
      return await this.post<{ token: string; user: any; pendingApproval: boolean }>('/auth/register', data);
    } catch (err) {
      console.warn('Backend API endpoint offline or running on static cloud host (Vercel). Account saved locally.');
      return { token: `local-token-${Date.now()}`, user: data, pendingApproval: false };
    }
  }

  public async loginCentralUser(email: string, password?: string) {
    try {
      return await this.post<{ token: string; user: any }>('/auth/login', { email, password });
    } catch (err) {
      console.warn('Backend login API offline. Using local authentication.');
      return null;
    }
  }

  public async fetchCentralUsers() {
    let users: any[] = [];
    try {
      users = await this.get<any[]>('/auth/users');
    } catch (err) {
      console.warn('Backend user fetch offline. Operating in client-side mode.');
    }

    try {
      const supabaseUsers = await fetchSupabaseUsers();
      if (Array.isArray(supabaseUsers) && supabaseUsers.length > 0) {
        const mapped = supabaseUsers.map((su) => ({
          id: su.id,
          displayName: su.display_name,
          email: su.email,
          role: su.role,
          status: su.status,
          customTask: su.custom_task,
          avatarUrl: su.avatar_url,
          isApproved: su.is_approved,
          registeredIp: su.registered_ip,
          createdAt: su.created_at,
        }));
        users = [...users, ...mapped];
      }
    } catch (err) {
      console.warn('Supabase fetch skipped:', err);
    }

    return users;
  }

  public async updateCentralUser(userId: string, updates: any) {
    try {
      return await this.post<any>('/auth/update-user', { userId, updates });
    } catch (err) {
      return null;
    }
  }
}

export const apiService = new ApiClient();


