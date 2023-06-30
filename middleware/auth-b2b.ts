import type { Middleware } from '@nuxt/types'
import { cleanRoutesLocales, djb2Hash } from '~/utilities/strings'

const excludePages = ['login', 'waiting-for-confirmation']

const b2bMiddleware: Middleware = ({ app, route, localeLocation, redirect }) => {
  if (app.$config.STORE !== 'B2B')
    return

  const cleanedRouteName = cleanRoutesLocales(`${route.name}`)

  if (excludePages.includes(cleanedRouteName))
    return

  const sessionToken = app.$cookieHelpers.getToken()
  const b2bApprovedToken = app.$cookies.get('b2b-approved')

  // Todo: Remove the assertions when TS stops complaining
  if (!sessionToken)
    // @ts-expect-error should be fine without the assertion (as unknown as string)
    return redirect(localeLocation('/login'))

  if (!b2bApprovedToken)
    // @ts-expect-error should be fine without the assertion (as unknown as string)
    return redirect(localeLocation('/waiting-for-confirmation'))

  if (b2bApprovedToken !== djb2Hash(sessionToken))
    // @ts-expect-error should be fine without the assertion (as unknown as string)
    return redirect(localeLocation('/waiting-for-confirmation'))
}

export default b2bMiddleware
