const fs = require('node:fs')

// eslint-disable-next-line no-console
console.log('Creating vercel.json file...')

const blogBaseUrl = process.env.DEPLOY_ENV === 'prod'
  ? 'https://blog.callmewine.com/'
  : 'https://blog-stage.callmewine.com/'

const config = {
  version: 2,
  builds: [
    {
      src: 'nuxt.config.js',
      use: '@nuxtjs/vercel-builder',
      config: {
        serverFiles: [
          './.nuxt/dist/sitemap-routes.json',
        ],
      },
    },
  ],
  headers: [
    {
      source: '/(.*-[V,C,R,D,B,N,M][0-9]*$)',
      has: [
        {
          value: '.*callmewine.co.uk',
          type: 'host',
        },
      ],
      headers: [
        {
          key: 'x-robots-tag',
          value: 'noindex',
        },
      ],
    },
    {
      source: '/(.*-[V,C,R,D,B,N,M][0-9]*[V,C,R,D,B,N,M][0-9]*$)',
      has: [
        {
          value: '.*callmewine.co.uk',
          type: 'host',
        },
      ],
      headers: [
        {
          key: 'x-robots-tag',
          value: 'noindex',
        },
      ],
    },
    {
      source: '/(.*-[V,C,R,D,B,N,M][0-9]*[V,C,R,D,B,N,M][0-9]*.htm$)',
      has: [
        {
          value: '.*callmewine.co.uk',
          type: 'host',
        },
      ],
      headers: [
        {
          key: 'x-robots-tag',
          value: 'noindex',
        },
      ],
    },
    {
      source: '/([^\\/.]*-[V,C,R,D,B,N,M][0-9]*.htm$)',
      has: [
        {
          value: '.*callmewine.co.uk',
          type: 'host',
        },
      ],
      headers: [
        {
          key: 'x-robots-tag',
          value: 'noindex',
        },
      ],
    },
  ],
  rewrites: [
    {
      source: '/blog',
      destination: blogBaseUrl,
    },
    {
      source: '/blog/:match*',
      destination: `${blogBaseUrl}:match*/`,
    },
  ],

}

fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2))
