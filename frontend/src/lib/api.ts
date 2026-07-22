// ── API Base ──
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

type RequestOptions = {
  method?: string
  body?: unknown
  params?: Record<string, string | number | undefined>
  headers?: Record<string, string>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, headers = {} } = options

  let url = `${API_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value))
    })
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  // Attach auth token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }))
    throw new Error(error.message || `Error ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) return undefined as T

  return response.json()
}

// Helper to extract list from wrapped responses like { data: [...] }
export function extractList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[]
  if (response && typeof response === 'object') {
    const obj = response as Record<string, unknown>
    if (obj.data && Array.isArray(obj.data)) return obj.data as T[]
    if (obj.content && Array.isArray(obj.content)) return obj.content as T[]
  }
  return []
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    request<T>(endpoint, { params }),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}
