<template>
  <div class="relative" :style="padding">
    <picture>
      <source :data-srcset="srcsetWebp" type="image/webp" />
      <source :data-srcset="srcset" />
      <img :data-src="this.src" data-sizes="auto" class="absolute lazyload" />
    </picture>
  </div>
</template>

<script>
import { sizes, createResizedUrl, calculateRatio } from '@/helpers';
export default {
  name: 'ResizedImage',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      src: null,
      srcset: null,
      srcsetWebp: null,
      padding: null,
    };
  },
  created() {
    this.src = this.url.replace(
      'https://a.storyblok.com',
      'https://img2.storyblok.com/250x0'
    );

    this.srcset = sizes.map(
      (size) => `${createResizedUrl(this.url, size)} ${size}w`
    );
    this.srcstWebp = sizes.map(
      (size) => `${createResizedUrl(this.url, size, true)} ${size}w`
    );

    const ratio = calculateRatio(this.url);
    this.padding = {
      paddingBottom: ratio,
    };
  },
};
</script>

<style></style>
