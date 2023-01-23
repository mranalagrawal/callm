export default function (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return {
      y: 0,
      behavior: 'smooth',
    }
  }
}
