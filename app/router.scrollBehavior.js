export default function (to, from, savedPosition) {
  if (to.hash) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          selector: to.hash,
          offset: { x: 0, y: (window?.innerWidth > 992 ? 170 : 135) + 120 },
          behavior: 'smooth',
        })
      }, 200)
    })
  }

  if (savedPosition) {
    return savedPosition
  } else {
    return {
      y: 0,
      behavior: 'smooth',
    }
  }
}
