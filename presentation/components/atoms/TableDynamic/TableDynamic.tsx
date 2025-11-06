import React, { useState, useCallback } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export type ColumnType<T = any> = {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, record: T, index: number) => React.ReactNode
  sorter?: boolean | ((a: T, b: T) => number)
  filterOptions?: Array<{ label: string; value: any }>
  className?: string
}

export interface TableDynamicProps<T = any> {
  columns: ColumnType<T>[]
  data: T[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  scroll?: {
    x?: number
    y?: number
  }
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>
  className?: string
  rowClassName?: string | ((record: T, index: number) => string)
  emptyText?: React.ReactNode
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

const EmptyState = ({ emptyText }: { emptyText?: React.ReactNode }) => (
  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
    {emptyText || 'No data available'}
  </div>
)

function TableDynamicComponent<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  scroll,
  onRow,
  className = '',
  rowClassName,
  emptyText,
}: TableDynamicProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  const handleSort = useCallback((key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }, [sortConfig])

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return (
        <span className="ml-1 text-gray-400">
          <ChevronUpIcon className="w-4 h-4" />
        </span>
      )
    }
    return (
      <span className="ml-1 text-blue-600">
        {sortConfig.direction === 'asc' ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </span>
    )
  }

  const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  const getRowClassName = useCallback((record: T, index: number) => {
    const baseClass = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer'
    if (typeof rowClassName === 'function') {
      return `${baseClass} ${rowClassName(record, index)}`
    }
    if (typeof rowClassName === 'string') {
      return `${baseClass} ${rowClassName}`
    }
    return baseClass
  }, [rowClassName])

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <LoadingSpinner />
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <EmptyState emptyText={emptyText} />
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
      <div
        className="overflow-x-auto"
        style={{ maxWidth: scroll?.x ? `${scroll.x}px` : undefined }}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${getAlignment(
                    column.align
                  )} ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  {column.sorter ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {column.title}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    <span className="font-semibold">{column.title}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
            style={{ maxHeight: scroll?.y ? `${scroll.y}px` : undefined, overflowY: scroll?.y ? 'auto' : undefined }}
          >
            {sortedData.map((record, index) => {
              const rowProps = onRow ? onRow(record, index) : {}
              return (
                <tr
                  key={index}
                  className={getRowClassName(record, index)}
                  {...rowProps}
                >
                  {columns.map((column) => {
                    const value = record[column.key]
                    return (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getAlignment(
                          column.align
                        )}`}
                      >
                        {column.render ? column.render(value, record, index) : value}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current * pagination.pageSize >= pagination.total}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.current - 1) * pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                  disabled={pagination.current === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {pagination.current}
                </span>
                <button
                  onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                  disabled={pagination.current * pagination.pageSize >= pagination.total}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const TableDynamic = React.memo(TableDynamicComponent) as typeof TableDynamicComponent