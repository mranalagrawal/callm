declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}

// This should work :(
/* declare module "*.{graphql,svg,jpeg,jpg,png}" {
  const value: string;
  export default value;
} */


declare module "*.graphql"
declare module "*.svg"
declare module "*.jpeg"
declare module "*.jpg"
declare module "*.png"
declare module "vue-lazy-hydration"
