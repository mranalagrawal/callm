import createTokenQuery from "./createUserToken";
import getUserQuery from "./getUser";

async function userLogin(email, password, domain, access_token) {
  const createToken = createTokenQuery(email, password);

  const GRAPHQL_BODY_TOKEN = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: createToken,
  };

  const response = await fetch(domain, GRAPHQL_BODY_TOKEN);
  const res = await response.json();

  const userToken =
    res.data.customerAccessTokenCreate.customerAccessToken.accessToken;

  const user = getUserQuery(
    res.data.customerAccessTokenCreate.customerAccessToken.accessToken
  );
  const GRAPHQL_BODY_USER = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/graphql",
    },
    body: user,
  };

  const response1 = await fetch(domain, GRAPHQL_BODY_USER);
  const res1 = await response1.json();

  const userData = {
    token: userToken,
    customer: res1.data.customer,
  };
  $nuxt.$emit("login", userData);
  if (process.client) {
    localStorage.setItem("call-me-wine-user", JSON.stringify(userData));
  }

  return userData;
  /*   fetch(domain, GRAPHQL_BODY_TOKEN)
    .then((res) => res.json())
    .then((res) => {
      const userToken =
        res.data.customerAccessTokenCreate.customerAccessToken.accessToken;

      const user = getUserQuery(
        res.data.customerAccessTokenCreate.customerAccessToken.accessToken
      );
      const GRAPHQL_BODY_USER = {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": access_token,
          "Content-Type": "application/graphql",
        },
        body: user,
      };
      fetch(domain, GRAPHQL_BODY_USER)
        .then((res) => res.json())
        .then((res) => {
          console.log("Login completed");
          const userData = {
            token: userToken,
            customer: res.data.customer,
          };
          $nuxt.$emit("login", userData);
          if (process.client) {
            localStorage.setItem("call-me-wine-user", JSON.stringify(userData));
          }
        });
    }); */
}

export default userLogin;
