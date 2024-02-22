import type { Middleware } from '@nuxt/types'
import { djb2Hash } from '~/utilities/strings'

const excludePages = [
  'login',
  'register',
  'recover',
  'waiting-for-confirmation',
  'about-us',
  'corporate-gifts',
  'sustainability',
  'restaurants-wineshops',
  'gift-cards',
  'guide-to-our-wines',
]

const b2bMiddleware: Middleware = ({ getRouteBaseName, $cookies, $cookieHelpers, $cmwStore, route, localeRoute, redirect }) => {
  if (!$cmwStore.isB2b) { return }

  const cleanedRouteName = getRouteBaseName(route) || ''

  if (excludePages.includes(cleanedRouteName)) { return }

  const sessionToken = $cookieHelpers.getToken()
  const b2bApprovedToken = $cookies.get('b2b-approved')

  // Todo: Remove the assertions when TS stops complaining
  // @ts-expect-error should be fine without the assertion (as unknown as string)
  if (!sessionToken) { return redirect(localeRoute('/login')) }

  // @ts-expect-error should be fine without the assertion (as unknown as string)
  if (!b2bApprovedToken) { return redirect(localeRoute('/waiting-for-confirmation')) }

  // @ts-expect-error should be fine without the assertion (as unknown as string)
  if (b2bApprovedToken !== djb2Hash(sessionToken)) { return redirect(localeRoute('/waiting-for-confirmation')) }
}

export default b2bMiddleware
