export default function (to, from, savedPosition) {
  const { hash } = to
  if (hash && hash !== '#brand-products') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          selector: hash,
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
