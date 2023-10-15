const tailwind = require('tailwindcss');
const postcssNested = require('postcss-nested');

module.exports = {
  siteName: 'Geodesign',
  // siteUrl: process.env.SITE_URL,
  pathPrefix: process.env.PATH_PREFIX,
  outputDir: 'docs',
  plugins: [
    {
      use: 'gridsome-source-storyblok',
      options: {
        client: {
          accessToken: process.env.STORYBLOK_KEY,
        },
        types: {
          story: {
            typeName: 'StoryblokEntry',
          },
        },
      },
    },
  ],
  css: {
    loaderOptions: {
      postcss: {
        plugins: [tailwind, postcssNested],
      },
    },
  },
  configureWebpack: {
    resolve: {
      mainFields: ['module', 'main'],
    },
  },
};
