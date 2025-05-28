import * as XLSX from 'xlsx'

export function DateToUTCDate(date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  )
}

export function ExportExcel(data, fileName) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, fileName)

  XLSX.writeFile(wb, fileName + '.xlsx')
}

export const toElephantCase = (key) => {
  return key
    .replace(/_/g, ' ') // Replace underscores with spaces
    .toLowerCase() // Convert to lowercase
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize the first letter of each word
}

export const isValidDate = (dateStr) => {
  const date = new Date(dateStr)
  // Check if the date is valid and matches the original input
  return !isNaN(date.getTime()) && dateStr === date.toISOString().slice(0, 10)
}

export const formatDate = (dateStr) => {
  const date = new Date(dateStr)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()

  // Format as "dd-MM-yyyy"
  const formattedDate = `${day}-${month}-${year}`
  return formattedDate
}

export const parseDate = (dateString) => {
  if (!dateString) return null

  const [day, month, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // Month is zero-based
}

export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // Format as "dd-MM-yyyy"
  const formattedDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`
  return formattedDate
}

export const isEmptyObject = (obj) => {
  if (obj === null || obj === undefined) return true

  return Object.keys(obj).length === 0
}
