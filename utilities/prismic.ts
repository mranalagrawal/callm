// create a function to find the slice type
function findSlice(sliceLabel = '', responseObject: { [x: string]: any }) {
  // Loop through all the keys in the object
  for (const key in responseObject) {
    if (Array.isArray(responseObject[key])) {
      // Loop through each 'slice' in the body array
      for (const slice of responseObject[key]) {
        // Check if the slice_label matches the one we're looking for
        if (slice.slice_label === sliceLabel) { return slice }
      }
    }
  }
  return null
}

export { findSlice }
