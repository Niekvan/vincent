const tailwind = require('tailwindcss');
const postcssNested = require('postcss-nested');

module.exports = {
  siteName: 'Gridsome',
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
};
