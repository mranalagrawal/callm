export const getUniqueListBy = (arr, key) => ([...new Map(arr.map(item => [item[key], item])).values()])

export const pick = (obj = {}, keys = []) => Object.fromEntries(
  keys
    .filter(key => key in obj)
    .map(key => [key, obj[key]]),
)

export const sortArrayByNumber = (arr = [], order = '', sort = 'asc') => {
  return arr.sort((a, b) => {
    if (sort === 'asc')
      return a[order] - b[order]
    else
      return b[order] - a[order]
  })
}

export const sortArrayByName = (arr = [], order = '', sort = 'asc') => {
  return arr.sort((a, b) => {
    const nameA = a[order].toUpperCase() // ignore upper and lowercase
    const nameB = b[order].toUpperCase() // ignore upper and lowercase

    if (sort === 'asc') {
      if (nameA < nameB)
        return -1

      if (nameA > nameB)
        return 1

      return 0
    } else {
      if (nameA > nameB)
        return -1

      if (nameA < nameB)
        return 1

      return 0
    }
  })
}
