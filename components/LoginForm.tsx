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
    <div className="w-full max-w-md bg-[#FEFAE0] border border-[#283618] p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#283618]">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-base text-[#46483c]">
          {isSignUp
            ? "Enter your details to get started."
            : "Please enter your details to sign in."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold tracking-wider uppercase text-[#1b1c18]" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#46483c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 pl-10 pr-3 bg-[#FEFAE0] border border-[#283618] focus:border-[3px] focus:border-[#283618] focus:ring-0 outline-none transition-all placeholder-[#283618]/50 text-base text-[#1b1c18]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold tracking-wider uppercase text-[#1b1c18]" htmlFor="password">
              Password
            </label>
            {!isSignUp && (
              <button type="button" className="text-xs font-bold text-[#283618] hover:underline">
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#46483c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={3}
              className="w-full h-12 pl-10 pr-3 bg-[#FEFAE0] border border-[#283618] focus:border-[3px] focus:border-[#283618] focus:ring-0 outline-none transition-all placeholder-[#283618]/50 text-base text-[#1b1c18]"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-bold text-[#BC6C25] flex items-center gap-1">
            <svg className="w-4 h-4 fill-[#BC6C25]" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 mt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#606C38] text-[#FEFAE0] text-sm font-semibold tracking-wider uppercase hover:bg-[#283618] hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-50"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>

      <div className="text-center pt-4 border-t border-[#283618]">
        <p className="text-base text-[#46483c]">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError("")
            }}
            className="text-sm font-semibold tracking-wider uppercase text-[#283618] hover:text-[#606C38] transition-colors"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  )
}
