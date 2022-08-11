import createTokenQuery from "./createUserToken";
import setUser from "./setUser";
import userLogin from "./userLogin";

const fetch = require("node-fetch");

const userRegister = async (
  firstName,
  lastName,
  email,
  password,
  marketing,
  age,
  domain,
  access_token
) => {
  // costruisco la mutation customerCreate
  const userData = setUser(firstName, lastName, email, password, marketing);

  /* const GRAPHQL_BODY_TOKEN = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": "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",
      "Content-Type": "application/graphql",
    },
    body: userData,
  };

  
  const response = await fetch(
    "https://callmewine.myshopify.com/admin/api/2022-07/graphql.json",
    GRAPHQL_BODY_TOKEN
  );
  const res = await response.json(); */

  const GRAPHQL_BODY_TOKEN = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: userData,
  };

  // registro effettivamente l'utente
  const response = await fetch(domain, GRAPHQL_BODY_TOKEN);
  const res = await response.json();

  console.log(res, "E' qui che si rompe...");
  // costruisco la query createTokenQuery, che mi ritorna un token necessario per loggare l'utente
  const createToken = createTokenQuery(email, password);

  const GRAPHQL_BODY_USER = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: createToken,
  };

  // loggo l'utente
  const response1 = await fetch(domain, GRAPHQL_BODY_USER);

  const res1 = await response1.json();

  console.log("before");
  const user = await userLogin(email, password, domain, access_token);

  console.log("after");
};

export default userRegister;
