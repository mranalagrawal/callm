export default (context) => {
  window.redirectApp = (url) => {
    context.app.router.push(url)
  }
}
