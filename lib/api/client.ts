// ============================================================
// HTTP API Client - Controle Certo
// Centralized fetch wrapper with token management & refresh
// ============================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.controlecerto.online/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
};

// ---- Token storage (client-side only) ----
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// ---- Refresh logic ----
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("No refresh token available");
  }

  const response = await fetch(
    `${API_BASE_URL}/Auth/GenerateAccessToken/${refreshToken}`
  );

  if (!response.ok) {
    clearTokens();
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  const newAccessToken = data.accessToken;
  setTokens(newAccessToken, refreshToken);
  return newAccessToken;
}

// ---- Core fetch function ----
async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options;

  // Build URL with query params
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url.toString(), {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // If 401, try to refresh token and retry once
  if (response.status === 401 && getRefreshToken()) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }
      const newToken = await refreshPromise;
      refreshPromise = null;

      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url.toString(), {
        ...rest,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      refreshPromise = null;
      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
  }

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage: string;
    try {
      const parsed = JSON.parse(errorBody);
      errorMessage =
        parsed.message || parsed.title || parsed.error || errorBody;
    } catch {
      errorMessage = errorBody || `HTTP ${response.status}`;
    }
    throw new ApiError(errorMessage, response.status);
  }

  // Handle empty responses (204 No Content, etc.)
  const text = await response.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

// ---- ApiError class ----
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ---- Public API methods ----
export const api = {
  get: <T>(endpoint: string, params?: RequestOptions["params"]) =>
    apiFetch<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown, params?: RequestOptions["params"]) =>
    apiFetch<T>(endpoint, { method: "POST", body, params }),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: "PATCH", body }),

  put: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: "PUT", body }),

  delete: <T>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: "DELETE" }),
};
