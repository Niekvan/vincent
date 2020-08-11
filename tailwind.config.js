module.exports = {
  purge: {
    content: ['./src/**/*.vue', './src/**/*.js', './src/**/*.html'],
    options: {
      whitelist: [
        'body',
        'html',
        'img',
        'a',
        'g-image',
        'g-image--lazy',
        'g-image--loaded',
      ],
      extractors: [
        {
          extractor: (content) => content.match(/[A-z0-9-:\\/]+/g),
          extensions: ['vue', 'js', 'jsx', 'md', 'html', 'pug'],
        },
      ],
    },
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
