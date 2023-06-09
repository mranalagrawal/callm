import { storeToRefs } from 'pinia'
import { useCustomer } from '~/store/customer'
import { cleanRoutesLocales } from '~/utilities/strings'

const excludePages = ['login', 'waiting-for-confirmation']

export default async function ({ app, route, redirect }) {
  if (app.$config.STORE !== 'B2B')
    return

  // This shouldn't run on these pages, so we exit the middleware if the page is on the list
  if (excludePages.includes(cleanRoutesLocales(route.name))) {
    console.log('HERE', route.name)
    return
  }

  const customerStore = useCustomer()
  const { customer } = storeToRefs(customerStore)

  if (!app.$cookieHelpers.getToken())
    return redirect('/login')

  if (app.$cookieHelpers.getToken() && !customer.value.validated)
    return redirect('/waiting-for-confirmation')
}
