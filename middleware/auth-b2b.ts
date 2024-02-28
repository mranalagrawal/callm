import type { Middleware } from '@nuxt/types'

import { djb2Hash } from '~/utilities/strings'

const allowedPages = [
  'about-us',
  'contact',
  'cookie',
  'corporate-gifts',
  'guide-to-our-wines',
  'login',
  'payments',
  'privacy',
  'recover',
  'register',
  'restaurants-wineshops',
  'shipping',
  'sustainability',
  'terms-of-sales',
  'waiting-for-confirmation',
]

const b2bMiddleware: Middleware = ({ getRouteBaseName, $cookies, $cookieHelpers, $cmwStore, route, localeRoute, redirect }) => {
  if (!$cmwStore.isB2b) { return }

  const cleanedRouteName = getRouteBaseName(route) || ''

  if (allowedPages.includes(cleanedRouteName)) { return }

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
