const getUniqueListBy = (arr: Record<string, any>, key: string): any[] =>
  ([...new Map(arr.map((item: { [x: string]: any }) => [item[key], item])).values()])

const pick = (obj: Record<string, any> = {}, keys: string[] = []) => Object.fromEntries(
  keys
    .filter(key => key in obj)
    .map(key => [key, obj[key]]),
)

const sortArrayByNumber = (arr: any[] = [], order = '', sort = 'asc') => {
  return arr.sort((a, b) => {
    if (sort === 'asc') {
      return a[order] - b[order]
    } else {
      return b[order] - a[order]
    }
  })
}

const sortArrayByName = (arr: any[] = [], order = '', sort = 'asc') => {
  return arr.sort((a: any, b: any) => {
    const nameA = a[order].toUpperCase() // ignore upper and lowercase
    const nameB = b[order].toUpperCase() // ignore upper and lowercase

    if (sort === 'asc') {
      if (nameA < nameB) {
        return -1
      }

      if (nameA > nameB) {
        return 1
      }

      return 0
    } else {
      if (nameA > nameB) {
        return -1
      }

      if (nameA < nameB) {
        return 1
      }

      return 0
    }
  })
}

const generateHeadHreflang = (obj = {}) => (
  Object.entries(obj)
    .map(([hreflang, href]) => ({
      hid: `alternate-${hreflang}`,
      rel: 'alternate',
      href,
      hreflang,
    }),
    )
)

const chunkArray = (array: any, chunkSize: any) => {
  if (chunkSize <= 0) {
    throw new Error('Chunk size should be greater than 0')
  }

  const chunkedArray = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize))
  }
  return chunkedArray
}

const arrayOrder = ['categories', 'winelists', 'countries', 'regions', 'areas', 'brands']

// Create a function that takes an array and an Object and return the object ordered by the array given

interface ObjectType {
  [key: string]: any[]
}

const orderByArray = (obj: ObjectType): ObjectType => {
  const ordered: ObjectType = {}

  // Iterate through the arrayOrder and copy arrays to the ordered object
  arrayOrder.forEach((key) => {
    if (obj[key]) {
      ordered[key] = [...obj[key]] // Create a copy of the array
    }
  })

  // Iterate through the original object and copy non-array properties to the ordered object
  Object.keys(obj).forEach((key) => {
    if (!arrayOrder.includes(key) && Array.isArray(obj[key])) {
      ordered[key] = [...obj[key]] // Create a copy of the array
    } else if (!arrayOrder.includes(key)) {
      ordered[key] = obj[key]
    }
  })

  return ordered
}

export {
  chunkArray,
  generateHeadHreflang,
  getUniqueListBy,
  orderByArray,
  pick,
  sortArrayByName,
  sortArrayByNumber,
}
