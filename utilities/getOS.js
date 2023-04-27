export function getMobileOperatingSystem(str = '') {
  const match
      = str.match(/(Windows Phone|Android|iPad|iPhone|iPod)/)
      || []

  const obj = {
    'Windows Phone': 'Windows Phone',
    'Android': 'Windows Phone',
    'iPad': 'iOS',
    'iPhone': 'iOS',
    'iPod': 'iOS',
  }

  return obj[match[0]] || false
}
