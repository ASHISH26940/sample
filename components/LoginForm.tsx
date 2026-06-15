"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { nhost } from "@/lib/nhost"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const action = isSignUp
        ? await nhost.auth.signUpEmailPassword({ email, password })
        : await nhost.auth.signInEmailPassword({ email, password })

      if (action.body.session) {
        router.push("/dashboard")
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Try again."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold text-center">
        {isSignUp ? "Create Account" : "Sign In"}
      </h1>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded border px-4 py-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full rounded border px-4 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsSignUp(!isSignUp)
          setError("")
        }}
        className="w-full text-sm text-blue-600 hover:underline"
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </button>
    </form>
  )
}
