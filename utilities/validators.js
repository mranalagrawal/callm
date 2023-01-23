export const regexRules = k => ({
  oneNumber: '.*[0-9].*',
  oneUpperCase: '.*[A-Z].*',
  oneLowerCase: '.*[a-z].*',
  oneSpecialChar: '.*[!@#$%^&+=?].*',
  isProduct: '[P][0-9]+',
})[k]

export const isObject = value => (
  typeof value === 'object'
  && !Array.isArray(value)
  && value !== null
)
