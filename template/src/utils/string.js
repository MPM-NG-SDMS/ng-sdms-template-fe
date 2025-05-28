/**
 * Get initials from a name
 * @param {string} name - Full name to get initials from
 * @param {number} [limit=2] - Maximum number of initials to return
 * @returns {string} Initials in uppercase
 * @example
 * getInitials('John Doe') // returns 'JD'
 * getInitials('John Doe Smith', 2) // returns 'JS'
 * getInitials('john') // returns 'J'
 */
export function getInitials(name, limit = 2) {
  if (!name) return ''

  return name
    .split(' ')
    .map(part => part[0])
    .filter(char => char && /[A-Za-z]/.test(char))
    .slice(0, limit)
    .join('')
    .toUpperCase()
} 