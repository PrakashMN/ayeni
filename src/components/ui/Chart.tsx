export interface BarDatum {
  label: string
  value: number
}

const palette = ['bg-cyan-600', 'bg-cyan-500', 'bg-cyan-400', 'bg-cyan-300', 'bg-cyan-200']

export function BarChart({
  data,
  title,
  unit = '',
}: {
  data: BarDatum[]
  title: string
  unit?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <figure className="px-5 py-4">
      <figcaption className="sr-only">{title}</figcaption>
      <div className="flex h-44 items-end gap-3" role="img" aria-label={title}>
        {data.map((d, i) => {
          const height = Math.round((d.value / max) * 100)
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="tabular text-xs font-semibold text-cyan-800">
                {d.value}
                {unit}
              </span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className={`w-full rounded-t-md ${palette[i % palette.length]}`}
                  style={{ height: `${Math.max(height, 3)}%` }}
                />
              </div>
              <span className="text-center text-xs text-cyan-700">{d.label}</span>
            </div>
          )
        })}
      </div>
    </figure>
  )
}

export function StackedSegments({
  segments,
}: {
  segments: { label: string; value: number; className: string }[]
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-cyan-100">
        {segments.map((s) => (
          <div
            key={s.label}
            className={s.className}
            style={{ width: `${(s.value / total) * 100}%` }}
            title={`${s.label}: ${s.value}`}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm text-cyan-800">
            <span className={`h-2.5 w-2.5 rounded-full ${s.className}`} aria-hidden="true" />
            <span className="font-medium">{s.label}</span>
            <span className="tabular text-cyan-700">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
