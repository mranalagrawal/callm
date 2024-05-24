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
