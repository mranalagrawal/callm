/* const getDisallowList = () => process.env.STORE !== 'CMW_UK'
  ? ['/!*?*', '/catalog*']
  : [
      '/?search=',
      '/!*?search=*',
      '/?search=*',
      '/catalog.htm',
      '/catalog.htm?*',
      '/!*catalog.htm',
      '/!*catalog.htm?*',
      '/!*?pricerange=*',
      '/!*?acustom=*',
      '/!*?pcustom=*',
      '/!*?aid=*',
      '/!*?sel=*',
      '/!*?mid=*',
      '/!*?zid=*',
      '/!*?sid=*',
      '/!*?fpid=*',
      '/!*?fid=*',
      '/!*?pid=*',
      '/!*?s_id=*',
      '/!*sort=*',
      '/notificadisponibilita',
      '/en/notificadisponibilita*',
      '/it/',
    ] */
import type { IncomingMessage } from 'node:http'

export default [
  { UserAgent: '*oh' },
  { Disallow: ['/*', '/catalog*'] },
  { BlankLine: true },
  { Comment: 'Comment here' },

  // Be aware that this will NOT work on target: 'static' mode
  // { Sitemap: (req: IncomingMessage) => `https://${req.headers.host}/sitemap.xml` },
  { Sitemap: (req: IncomingMessage) => `https://${req.headers.host}/sitemap.xml` },
  // ...(process.env.DEPLOY_ENV === 'prod' && { Sitemap: req => `https://${req.headers.host}/sitemap.xml` }),
]
