export default [
  { UserAgent: '*oh' },
  { Disallow: ['/*?*', '/catalog*'] },
  { BlankLine: true },
  { Comment: 'Comment here' },

  // Be aware that this will NOT work on target: 'static' mode
  { Sitemap: req => `https://${req.headers.host}/sitemap.xml` },
]
