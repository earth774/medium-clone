'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-black hover:text-gray-600"
        >
          Medium
        </Link>
        <div className="flex gap-4 items-center" suppressHydrationWarning>
          <>
            <Link href="/login" className="text-gray-600 hover:text-black">
              Login
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-black">
              Register
            </Link>
          </>
        </div>
      </nav>
    </header>
  )
}

