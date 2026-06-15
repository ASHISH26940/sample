"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { nhost } from "@/lib/nhost"
import { Transcript } from "@/components/Transcript"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string; displayName?: string } | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const session = nhost.getUserSession()
    if (!session) {
      router.push("/login")
      return
    }
    setUser(session.user ?? null)
    setChecking(false)
  }, [router])

  const handleSignOut = async () => {
    await nhost.auth.signOut({})
    nhost.clearSession()
    router.push("/login")
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FEFAE0] text-[#283618]">
        Loading...
      </div>
    )
  }

  const email = user?.displayName || user?.email || "user@example.com"

  return (
    <div className="min-h-screen flex bg-[#FEFAE0] text-[#283618]">
      {/* Sidebar */}
      <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 py-6 border-r border-[#283618] bg-[#FEFAE0] z-50">
        <div className="px-6 mb-6">
          <h1 className="text-2xl font-bold text-[#283618] mb-1 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            System Admin
          </h1>
          <p className="text-xs font-bold opacity-70">{email}</p>
        </div>
        <ul className="flex flex-col flex-1">
          <li>
            <a className="flex items-center gap-4 px-6 py-3 bg-[#283618] text-[#FEFAE0] font-bold transition-all hover:bg-[#606C38] hover:text-[#FEFAE0] active:scale-95 duration-100" href="#">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
              <span className="text-sm font-semibold tracking-wider uppercase">Overview</span>
            </a>
          </li>

        </ul>
        <div className="mt-auto border-t border-[#283618] pt-3">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 w-full px-6 py-3 text-[#283618] hover:bg-[#e4e2db] transition-all active:scale-95 duration-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-semibold tracking-wider uppercase">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen bg-[#FEFAE0]">
        {/* Top bar */}
        <header className="flex justify-end items-center px-6 w-full h-16 border-b border-[#283618] bg-[#FEFAE0] shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold tracking-wider uppercase text-[#283618]">{email}</span>
            <div className="w-10 h-10 border border-[#283618] bg-[#e4e2db] overflow-hidden flex items-center justify-center">
              <svg className="w-6 h-6 text-[#283618]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-12">
          <Transcript />
        </div>
      </main>
    </div>
  )
}
