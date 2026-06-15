type StudyItem = {
  id: number
  subject: string
  item_number: number
  item_type: string
  completed: boolean
  week_number: number
}

type Props = {
  rows: StudyItem[]
  selectedWeek: number
}

export default function WeeklyView({
  rows,
  selectedWeek,
}: Props) {
  const safeRows = rows ?? []

const subjects = [
  ...new Set(safeRows.map((r) => r.subject)),
]

const totalItems = safeRows.length

const completedItems =
  safeRows.filter((r) => r.completed).length

  const overallPercent =
    totalItems === 0
      ? 0
      : Math.round(
          (completedItems / totalItems) * 100
        )

  return (
    <div>
      <h2>
        Week {selectedWeek} Summary
      </h2>

      <div
        style={{
          marginBottom: '20px',
        }}
      >
        <strong>
          Overall Progress:
        </strong>{' '}
        {completedItems} / {totalItems}
        {' '}
        ({overallPercent}%)
      </div>

      {subjects.map((subject) => {
        const subjectRows =
  safeRows.filter(
    (r) =>
      r.subject === subject
  )

        const completed =
          subjectRows.filter(
            (r) => r.completed
          ).length

        const percent =
          subjectRows.length === 0
            ? 0
            : Math.round(
                (completed /
                  subjectRows.length) *
                  100
              )

        return (
          <div
            key={subject}
            style={{
              marginBottom: '15px',
              padding: '10px',
              border:
                '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <strong>
              {subject}
            </strong>

            <div>
              {completed} /{' '}
              {subjectRows.length}
              {' '}
              completed
            </div>

            <div>
              {percent}%
            </div>
          </div>
        )
      })}
    </div>
  )
}