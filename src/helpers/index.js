export const delay = (time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

export const createResizedUrl = (url, size, webp = false) => {
  if (webp) {
    return `https://img2.storyblok.com/${size}x0/filters:format(webp)${url.replace(
      'https://a.storyblok.com',
      ''
    )}`;
  }

  return `https://img2.storyblok.com/${size}x0${url.replace(
    'https://a.storyblok.com',
    ''
  )}`;
};

export const calculateRatio = (url) => {
  const reg = /(?:^https:\/\/a\.storyblok\.com\/f\/[0-9]+\/)(?<width>[0-9]+)x(?<height>[0-9]+)/g;
  const match = reg.exec(url);
  if (match) {
    const { width, height } = match.groups;
    return `${(height / width) * 100}%`;
  }
  return 0;
};

export const sizes = [
  '300',
  '500',
  '600',
  '700',
  '1000',
  '1200',
  '1500',
  '1700',
  '2000',
];

export const createResponsiveImage = (url, id) => {
  const src = url.replace(
    'https://a.storyblok.com',
    'https://img2.storyblok.com/250x0'
  );
  const srcset = sizes.map((size) => `${createResizedUrl(url, size)} ${size}w`);
  const srcstWebp = sizes.map(
    (size) => `${createResizedUrl(url, size, true)} ${size}w`
  );

  const ratio = calculateRatio(url);

  return `
  <div id="${id}" style="padding-bottom: ${ratio}; position: relative;">
    <picture>
      <source data-srcset="${srcstWebp}" type="image/webp">
      <source data-srcset="${srcset}">
      <img data-src="${src}" data-sizes="auto" class="image lazyload">
    </picture>
  </div>`;
};
