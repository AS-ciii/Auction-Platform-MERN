"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "auctioneer" | "buyer"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const loading = status === "loading"

  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email || "",
    role: session.user.role as "admin" | "auctioneer" | "buyer"
  } : null

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    setError(null)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Auto login after registration
      await login(email, password)
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await signOut({ redirect: false })
    } catch (error) {
      setError((error as Error).message)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
