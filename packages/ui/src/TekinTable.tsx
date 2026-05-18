import type { ReactNode } from 'react'

export type TekinTableColumn<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

export type TekinTableProps<T> = {
  columns: TekinTableColumn<T>[]
  data: T[]
  rowKey: (row: T) => string
  empty?: ReactNode
}

export function TekinTable<T>({
  columns,
  data,
  rowKey,
  empty,
}: TekinTableProps<T>) {
  if (data.length === 0 && empty) {
    return <>{empty}</>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--tekin-gray-200)] bg-[color:var(--tekin-white)] shadow-[var(--tekin-shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm text-[color:var(--tekin-gray-800)]">
          <thead>
            <tr className="border-b border-[color:var(--tekin-gray-200)] bg-[color:var(--tekin-gray-50)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-[12px] font-medium uppercase tracking-wide text-[color:var(--tekin-gray-600)] ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-[color:var(--tekin-gray-200)] last:border-b-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 align-middle ${col.className ?? ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
