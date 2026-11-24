// Cliente de API para conectar con el backend de Express
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; total?: number }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('farmacia_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching ${endpoint}:`, error);
    return {
      success: false,
      message: error.message || 'Error de conexión con el servidor',
    };
  }
}
