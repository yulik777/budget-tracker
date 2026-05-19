const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Generic API response wrapper
 */
interface APIError {
  message?: string;
  error?: string;
}

class APIClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data: unknown;

    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid JSON response from server");
    }

    if (!res.ok) {
      const err = data as APIError;
      throw new Error(err.message || err.error || `HTTP ${res.status}`);
    }

    return data as T;
  }

  // ================= AUTH =================

  async register(email: string, name: string, password: string) {
    return this.request<{
      user: {
        id: string;
        email: string;
        name: string;
      };
    }>("POST", "/auth/register", { email, name, password });
  }

  async login(email: string, password: string) {
    const result = await this.request<{
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        settings: {
          id: string;
          userId: string;
          currency: string;
        };
      };
    }>("POST", "/auth/login", { email, password });

    if (result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  async getCurrentUser() {
    return this.request<{
      user: {
        id: string;
        email: string;
        name: string;
        settings: {
          id: string;
          userId: string;
          currency: string;
        };
      };
    }>("GET", "/auth/me");
  }

  // ================= TRANSACTIONS =================

  async getTransactions() {
    const res = await this.request<{
      transactions: {
        id: string;
        userId: string;
        amount: number;
        type: "income" | "expense";
        category: string;
        description: string;
        date: string;
      }[];
    }>("GET", "/transactions");

    return res.transactions;
  }

  async createTransaction(data: {
    amount: number;
    type: "income" | "expense";
    category: string;
    description: string;
    date: string;
  }) {
    const res = await this.request<{
      transaction: {
        id: string;
        userId: string;
        amount: number;
        type: "income" | "expense";
        category: string;
        description: string;
        date: string;
      };
    }>("POST", "/transactions", data);

    return res.transaction;
  }

  async updateTransaction(
    id: string,
    data: Partial<{
      amount: number;
      type: "income" | "expense";
      category: string;
      description: string;
      date: string;
    }>,
  ) {
    const res = await this.request<{
      transaction: {
        id: string;
        userId: string;
        amount: number;
        type: "income" | "expense";
        category: string;
        description: string;
        date: string;
      };
    }>("PUT", `/transactions/${id}`, data);

    return res.transaction;
  }

  async deleteTransaction(id: string) {
    const res = await this.request<{
      transaction: {
        id: string;
        userId: string;
        amount: number;
        type: "income" | "expense";
        category: string;
        description: string;
        date: string;
      };
    }>("DELETE", `/transactions/${id}`);

    return res.transaction;
  }

  // ================= SETTINGS =================

  async getSettings() {
    const res = await this.request<{
      settings: {
        id: string;
        userId: string;
        currency: string;
      };
    }>("GET", "/settings");

    return res.settings;
  }

  async updateSettings(data: { currency: string }) {
    const res = await this.request<{
      settings: {
        id: string;
        userId: string;
        currency: string;
      };
    }>("PUT", "/settings", data);

    return res.settings;
  }
}

export const apiClient = new APIClient();
