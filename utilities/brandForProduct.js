const getBrandById = (brandId) => {
  return `query {
        articles(first: 200, query:"tag:${brandId}")  {
            nodes {
                title
                handle
                id   
                contentHtml    
                image {
                  url
                }
            }
        }
      }`;
};

export async function getBrandForProduct(domain, access_token, brandId) {
  const brandQuery = getBrandById(brandId);

  const GRAPHQL_BODY = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/graphql",
    },
    body: brandQuery,
  };

  const brandData = await fetch(domain, GRAPHQL_BODY).then((res) => res.json());

  const data = brandData.data.articles.nodes[0];

  return data;
}
