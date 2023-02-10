export default async function ({ route, redirect }) {
  if (route.path.split('-').at(-1).startsWith('B') && route.path.includes('cantina')) {
    let handle = ''
    handle = route.path.replace('cantina', 'winery')
    handle = handle.replace('.htm', '')

    return redirect(handle)
  }
}
