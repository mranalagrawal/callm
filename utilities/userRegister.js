import createTokenQuery from './createUserToken'
import setUser from './setUser'

const fetch = require('node-fetch')

const userRegister = async (
  firstName,
  lastName,
  email,
  password,
  marketing,
  age,
  domain,
  access_token,
) => {
  // costruisco la mutation customerCreate
  const userData = setUser(firstName, lastName, email, password, marketing)

  const GRAPHQL_BODY_TOKEN = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/json',
    },
    body: userData,
  }

  // registro effettivamente l'utente
  const response = await fetch(domain, GRAPHQL_BODY_TOKEN)
  await response.json()

  /* console.log(res, "E' qui che si rompe..."); */
  // costruisco la query createTokenQuery, che mi ritorna un token necessario per loggare l'utente
  const createToken = createTokenQuery(email, password)

  const GRAPHQL_BODY_USER = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/json',
    },
    body: createToken,
  }

  // loggo l'utente
  const response1 = await fetch(domain, GRAPHQL_BODY_USER)

  const customerAccessToken = await response1.json()

  return customerAccessToken.data.customerAccessTokenCreate.customerAccessToken
    .accessToken
}

export default userRegister
