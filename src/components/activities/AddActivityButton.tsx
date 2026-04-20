'use client'

import { useAuth } from '@/hooks/useAuth'

export default function AddActivityButton() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <button className="px-4 py-2 text-sm font-semibold border border-white/50 text-white rounded hover:bg-white hover:text-black transition-all duration-200">
      + 새 활동 추가
    </button>
  )
}
