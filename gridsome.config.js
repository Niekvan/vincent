const tailwind = require('tailwindcss');

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
        plugins: [tailwind],
      },
    },
  },
};
