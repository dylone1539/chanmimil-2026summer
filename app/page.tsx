'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import DailyView from '../components/DailyView'
import WeeklyView from '../components/WeeklyView'
import MonthlyView from '../components/MonthlyView'

type StudyItem = {
  id: number
  subject: string
  item_number: number
  item_type: string
  completed: boolean
  week_number: number
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
  const [activeTab, setActiveTab] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily')

  const [selectedWeek, setSelectedWeek] = useState(1)

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

  async function addLecture(subject: string) {
  const subjectRows = rows.filter(
    (r) =>
      r.subject === subject &&
      r.week_number === selectedWeek
  )

  const maxNumber =
    Math.max(
      ...subjectRows.map((r) => r.item_number),
      0
    )

  const { error } = await supabase
    .from('study_progress')
    .insert({
      subject,
      item_type: 'Lecture',
      item_number: maxNumber + 1,
      completed: false,
      week_number: selectedWeek,
    })

  if (error) {
    alert('Failed to add lecture')
    console.error(error)
    return
  }

  loadData()
}

async function addHomework(subject: string) {
  const subjectRows = rows.filter(
    (r) =>
      r.subject === subject &&
      r.week_number === selectedWeek &&
      r.item_type === 'Homework'
  )

  const maxNumber = Math.max(
    ...subjectRows.map((r) => r.item_number),
    0
  )

  const { error } = await supabase
    .from('study_progress')
    .insert({
      subject,
      item_type: 'Homework',
      item_number: maxNumber + 1,
      completed: false,
      week_number: selectedWeek,
    })

  if (error) {
    alert('Failed to add homework')
    return
  }

  loadData()
}

async function addExam(subject: string) {
  const subjectRows = rows.filter(
    (r) =>
      r.subject === subject &&
      r.week_number === selectedWeek &&
      r.item_type === 'Exam'
  )

  const maxNumber = Math.max(
    ...subjectRows.map((r) => r.item_number),
    0
  )

  const { error } = await supabase
    .from('study_progress')
    .insert({
      subject,
      item_type: 'Exam',
      item_number: maxNumber + 1,
      completed: false,
      week_number: selectedWeek,
    })

  if (error) {
    alert('Failed to add exam')
    return
  }

  loadData()
}

async function deleteItem(id: number) {
  const confirmed = window.confirm(
    'Delete this item?'
  )

  if (!confirmed) {
    return
  }

  const { error } = await supabase
    .from('study_progress')
    .delete()
    .eq('id', id)

  if (error) {
    alert('Delete failed')
    return
  }

  loadData()
}

const weekRows = rows.filter(
  (r: any) => r.week_number === selectedWeek
)

console.log('rows:', rows.length)
console.log('weekRows:', weekRows.length)

  const subjects = [
  ...new Set(weekRows.map((r) => r.subject))
]

  const totalItems = weekRows.length

const completedItems =
  weekRows.filter((r) => r.completed).length

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
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <button onClick={() => setActiveTab('daily')}>
          Daily
        </button>

        <button onClick={() => setActiveTab('weekly')}>
          Weekly
        </button>

        <button onClick={() => setActiveTab('monthly')}>
          Monthly
        </button>
      </div>

      {activeTab !== 'monthly' && (
<div
  style={{
    marginBottom: '20px',
  }}
>
  <label
    style={{
      marginRight: '10px',
      fontWeight: 'bold',
    }}
  >
    Current Week:
  </label>

  <select
    value={selectedWeek}
    onChange={(e) =>
      setSelectedWeek(Number(e.target.value))
    }
  >
    <option value={1}>Week 1</option>
    <option value={2}>Week 2</option>
    <option value={3}>Week 3</option>
    <option value={4}>Week 4</option>
    <option value={5}>Week 5</option>
    <option value={6}>Week 6</option>
    <option value={7}>Week 7</option>
    <option value={8}>Week 8</option>
  </select>
</div>
      )}

{activeTab === 'daily' && (
  <>

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
          const subjectRows = weekRows.filter(
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
                border: `3px solid ${subjectColors[subject] || '#999'
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
                  <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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

  <button
  onClick={() =>
    deleteItem(item.id)
  }
  style={{
    marginLeft: '10px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
  }}
  title="Delete"
>
  🗑️
</button>
</div>
                </div>
              ))}

              <div
  style={{
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  }}
>
  <button
    onClick={() => addLecture(subject)}
  >
    + Lecture
  </button>

  <button
    onClick={() => addHomework(subject)}
  >
    + Homework
  </button>

  <button
    onClick={() => addExam(subject)}
  >
    + Exam
  </button>
</div>
            </div>
          )
        })}

         </>
)}

{activeTab === 'weekly' && (
  <WeeklyView
    rows={weekRows}
    selectedWeek={selectedWeek}
  />
)}

{activeTab === 'monthly' && (
  <>

    <MonthlyView rows={rows} />
  </>
)}

    </main>
  )
}