<template>
  <div
    class="avatar absolute top-0 left-0 box-border overflow-hidden bg-red-700 rounded-full"
  >
    <img class="avatar__image" :src="imageSrc" />
  </div>
</template>

<script>
import CImage from './ResizedImage';
export default {
  name: 'Avatar',
  components: {
    CImage,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  computed: {
    imageSrc() {
      return `${this.url.replace(
        'https://a.storyblok.com',
        'https://img2.storyblok.com/200x200/smart'
      )}?time=${Date.now()}`;
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 3rem;
  height: 3rem;
}
</style>
