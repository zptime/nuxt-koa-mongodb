
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/axios' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true, // 代理
    debug: false,
    baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT ||
      3000}`
  },
  proxy: { // 代理配置
    '/api': 'http://localhost:3000'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  },
  manifest: {
    name: 'Nuxt Koa Mongodb',
    short_name: 'Framework',
    lang: 'en',
    display: 'fullscreen',
    start_url: '/',
    theme_color: '#42d69c',
    background_color: '#fff',
    icons: [
      {
        src: '/icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  },
  workbox: {
    dev: true, // 开发人员模式下启用
    config: {
      debug: true // 是否打开调试
    },
    cacheNames: {
      prefix: 'm',
      suffix: process.env.npm_package_version,
      precache: 'custom-precache-name',
      runtime: 'custom-runtime-name'
    },
    cacheOptions: {
      cacheId: process.env.npm_package_name,
      revision: process.env.npm_package_version
    },
    preCaching: [
      '/favicon.ico'
    ],
    runtimeCaching: [
      {
        // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
        urlPattern: 'https://jsonplaceholder.typicode.com/*',
        // Defaults to `networkFirst` if omitted
        handler: 'networkFirst',
        // Defaults to `GET` if omitted
        method: 'GET'
      }
    ]
  }
}
