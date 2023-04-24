// TODO: Add some cool SVG Icons to show some animations
export function getIconAsImg(icon = 'success') {
  return ({
    success: '<img alt="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJ6IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZmlsbD0iIzI5OTEwMCIgZD0ibTIyLjUxLDQ0LjIxbC0xMi4zMy0xMy4xMy00LjE4LDQuNDYsMTYuNTIsMTcuNTlMNTgsMTUuMzNsLTQuMTgtNC40Ni0zMS4zLDMzLjM0WiIvPjwvc3ZnPgo=" />',
    error: '<img alt="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJ2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZmlsbD0iI0U2MzYyRSIgZD0ibTEwLDU4bC00LTQsMjItMjJMNiwxMGw0LTQsMjIsMjJMNTQsNmw0LDQtMjIsMjIsMjIsMjItNCw0LTIyLTIyLTIyLDIyWiIvPjwvc3ZnPgo=" />',
    close: '<img alt="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJ2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZD0ibTEwLDU4bC00LTQsMjItMjJMNiwxMGw0LTQsMjIsMjJMNTQsNmw0LDQtMjIsMjIsMjIsMjItNCw0LTIyLTIyLTIyLDIyWiIvPjwvc3ZnPg==" />',
  })[icon]
}

export function getIconByFeature(key) {
  // TODO: use enum definitions everywhere and create an Icon viewer for marketing
  return ({
    favourite: 'feature-cmw-favourite',
    FAVOURITE: 'feature-cmw-favourite',
    isnew: 'feature-is-new',
    IS_NEW: 'feature-is-new',
    isInPromotion: 'feature-in-promotion',
    inpromotion: 'feature-in-promotion',
    IN_PROMOTION: 'feature-in-promotion',
    foreveryday: 'feature-for-everyday',
    FOR_EVERYDAY: 'feature-for-everyday',
    togift: 'feature-to-gift',
    TO_GIFT: 'feature-to-gift',
    unusualvariety: 'feature-unusual-variety',
    UNUSUAL_VARIETY: 'feature-unusual-variety',
    rarewine: 'feature-rare-wine',
    RARE_WINE: 'feature-rare-wine',
    artisanal: 'feature-artisanal',
    ARTISANAL: 'feature-artisanal',
    natural: 'feature-artisanal',
    NATURAL: 'feature-artisanal',
    organic: 'feature-organic',
    ORGANIC: 'feature-organic',
    topsale: 'feature-best-seller',
    TOP_SALE: 'feature-best-seller',
  })[key] || 'feature-cmw-favourite'
}
