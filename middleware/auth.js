// import { useCustomer } from '@/store/userV2'

export default async function ({ app, redirect }) {
  // Todo: Make a stronger auth method with cookies
  if (!app.$cookieHelpers.getToken()) {
    // Todo: Define if we want an error page
    /* error({
      errorCode: 503,
      message: 'You are not allowed to see this',
    }) */
    return redirect('/login')
  }
}
