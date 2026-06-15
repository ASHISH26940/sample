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
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome{user ? ", " + (user.displayName || user.email) : ""}
          </h1>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded border px-4 py-1 text-sm text-gray-600 hover:bg-gray-100"
        >
          Sign Out
        </button>
      </div>

      <Transcript />
    </div>
  )
}
