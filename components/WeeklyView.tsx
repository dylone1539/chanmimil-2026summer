export default function WeeklyView() {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '20px',
      }}
    >
      <h2>Week 1 Summary</h2>

      <p>Overall Progress: 0%</p>

      <ul>
        <li>Chemistry: 0%</li>
        <li>Biology: 0%</li>
        <li>English (Alex): 0%</li>
        <li>Math: 0%</li>
        <li>Spanish: 0%</li>
      </ul>
    </div>
  )
}