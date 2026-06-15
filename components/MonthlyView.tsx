type StudyItem = {
  week_number: number | string
  completed: boolean
}

type Props = {
  rows?: StudyItem[]
}

export default function MonthlyView({
  rows,
}: Props) {
  const safeRows = rows ?? []

  const weeks = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div>
      <h2
        style={{
          marginBottom: '20px',
        }}
      >
        Summer Progress
      </h2>

    

      {weeks.map((week) => {
        const weekRows = safeRows.filter(
          (r) =>
            Number(r.week_number) === week
        )

        const completed =
          weekRows.filter(
            (r) => r.completed
          ).length

        const percent =
          weekRows.length === 0
            ? 0
            : Math.round(
                (completed /
                  weekRows.length) *
                  100
              )

        return (
          <div
            key={week}
            style={{
              marginBottom: '20px',
            }}
          >
            <strong>
              Week {week}
            </strong>

            <div
              style={{
                width: '100%',
                background: '#eee',
                height: '20px',
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '5px',
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  background: '#22c55e',
                  height: '100%',
                }}
              />
            </div>

            <div
              style={{
                marginTop: '5px',
              }}
            >
              {completed} / {weekRows.length}
              ({percent}%)
            </div>
          </div>
        )
      })}
    </div>
  )
}