export const regexRules = (k) => ({
  oneNumber: '.*[0-9].*',
  oneUpperCase: '.*[A-Z].*',
  oneLowerCase: '.*[a-z].*',
  oneSpecialChar: '.*[!@#$%^&+=].*',
})[k]
