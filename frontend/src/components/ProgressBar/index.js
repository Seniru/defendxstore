import "./ProgressBar.css"

export default function ProgressBar({ min, max, progress, label }) {
  return (
    <progress min={min} max={max} value={progress} data-label={label}>
      jio
    </progress>
  )
}
