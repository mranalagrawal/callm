export const GETHOMEPRODUCTBYQUERY = `query getHomeMetaObject($handle: MetaobjectHandleInput!) { 
    metaobject(handle: $handle) { 
      handle 
      fields { 
        key 
        value 
      } 
    } 
  }`
export const GET_META_OBJECT_BY_ID = `
  query GetMetaObjectById($id: ID!) {
    metaobject(id: $id) {
      handle
      fields {
        key
        value
      }
    }
  }
`
export const getNewHero = lang => `
  query GetMetaObjectById($id: ID!) {
    metaobject(id: $id) {
      id
      handle
      fields {
        key
        value
      }
      image: field(key: "image") {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      backgroundColor: field(key: "background_color") { value }
      link: field(key: "link_${lang}") { value }
      buttonText: field(key: "button_text_${lang}") { value }
      title: field(key: "title_${lang}") { value }
    }
  }
`
