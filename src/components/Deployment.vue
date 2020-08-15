<template>
  <div>
    <message :is-answer="false" :is-solution="true" class="w-full">
      <h1>Deployment: {{ message.content.title }}</h1>
      <c-image ref="image" :url="message.content.image.filename" />
      <div v-html="content" />
    </message>
    <transition name="fade">
      <div class="flex w-full justify-start">
        <c-button :option="globalSolutions" @click.native="switchToGlobe" />
        <c-button :option="startOver" @click.native="reset" />
      </div>
    </transition>
  </div>
</template>

<script>
import marked from 'marked';

import CButton from './Button';
import CImage from './ResizedImage';
import Message from './Message';

export default {
  name: 'Deployment',
  components: {
    CButton,
    CImage,
    Message,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      content: null,
      globalSolutions: 'View global solutions',
      startOver: 'Start-over',
    };
  },
  created() {
    this.content = marked(this.message.content.content);
  },
  mounted() {
    this.$emit('observe', this.$refs.image.$el);
  },
  methods: {
    switchToGlobe() {
      this.$emit('globe', true);
    },
    reset() {
      this.$emit('reset');
    },
  },
};
</script>
