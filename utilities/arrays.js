export const getUniqueListBy = (arr, key) => ([...new Map(arr.map(item => [item[key], item])).values()])

export const pick = (obj = {}, keys = []) => Object.fromEntries(
  keys
    .filter(key => key in obj)
    .map(key => [key, obj[key]]),
)
