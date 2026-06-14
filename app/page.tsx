'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type StudyItem = {
  id: number
  subject: string
  item_number: number
  item_type: string
  completed: boolean
}

const subjectColors: Record<string, string> = {
  'Chemistry': '#ef4444',
  'Biology': '#a855f7',
  'English (Alex)': '#3b82f6',
  'Math': '#22c55e',
  'Spanish': '#eab308',
}

export default function Home() {
  const [rows, setRows] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data, error } = await supabase
      .from('study_progress')
      .select('*')
      .order('subject')
      .order('item_number')

    if (error) {
      console.error(error)
      return
    }

    setRows(data || [])
    setLoading(false)
  }

  async function toggleItem(id: number, current: boolean) {
    const { error } = await supabase
      .from('study_progress')
      .update({
        completed: !current,
        completed_at: !current ? new Date().toISOString() : null,
      })
      .eq('id', id)

    if (error) {
      alert('Update failed')
      return
    }

    loadData()
  }

  const subjects = [...new Set(rows.map((r) => r.subject))]

  const totalItems = rows.length
  const completedItems = rows.filter((r) => r.completed).length

  const overallPercent =
    totalItems === 0
      ? 0
      : Math.round((completedItems / totalItems) * 100)

  return (
    <main
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        CHANMIMIL SUMMER 2026
      </h1>

      <div
        style={{
          marginBottom: '25px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '10px',
        }}
      >
        <h2>Overall Progress</h2>

        <div
          style={{
            width: '100%',
            background: '#eee',
            borderRadius: '10px',
            overflow: 'hidden',
            height: '24px',
          }}
        >
          <div
            style={{
              width: `${overallPercent}%`,
              background: '#22c55e',
              height: '100%',
            }}
          />
        </div>

        <p style={{ marginTop: '8px' }}>
          {completedItems} / {totalItems} completed
          ({overallPercent}%)
        </p>
      </div>

      {loading && <p>Loading...</p>}

      {!loading &&
        subjects.map((subject) => {
          const subjectRows = rows.filter(
            (r) => r.subject === subject
          )

          const completed = subjectRows.filter(
            (r) => r.completed
          ).length

          const percent = Math.round(
            (completed / subjectRows.length) * 100
          )

          return (
            <div
              key={subject}
              style={{
                marginBottom: '30px',
                border: `3px solid ${
                  subjectColors[subject] || '#999'
                }`,
                borderRadius: '12px',
                padding: '15px',
              }}
            >
              <h2
                style={{
                  color: subjectColors[subject] || '#000',
                  marginBottom: '10px',
                }}
              >
                {subject}
              </h2>

              <p
                style={{
                  marginBottom: '15px',
                  fontWeight: 'bold',
                }}
              >
                Progress: {percent}%
              </p>

              {subjectRows.map((item) => (
                <div
                  key={item.id}
                  style={{
                    marginBottom: '8px',
                  }}
                >
                  <label
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() =>
                        toggleItem(
                          item.id,
                          item.completed
                        )
                      }
                      style={{
                        marginRight: '10px',
                      }}
                    />

                    {item.item_type} {item.item_number}
                  </label>
                </div>
              ))}
            </div>
          )
        })}
    </main>
  )
}