'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data, error } = await supabase
      .from('study_progress')
      .select('*')
      .order('subject')

    if (error) {
      console.error(error)
      return
    }

    setRows(data || [])
  }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-6">
        CHANMIMIL SUMMER 2026
      </h1>

      <p className="mb-4">
        Supabase Connection Test
      </p>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.id}
            className="border rounded p-3"
          >
            <strong>{row.subject}</strong>
            {' - '}
            {row.item_type}
            {' '}
            {row.item_number}
          </div>
        ))}
      </div>
    </main>
  )
}