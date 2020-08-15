<template>
  <div>
    <message
      :key="bubble._uid"
      v-for="bubble in bubbles"
      :message="bubble.message"
      :is-answer="false"
      :is-solution="true"
      :class="bubble.class ? 'w-full' : ''"
    />
  </div>
</template>

<script>
import marked from 'marked';

import { delay, createResponsiveImage } from '@/helpers';

import CButton from './Button';
import Message from './Message';

export default {
  name: 'Solution',
  components: {
    CButton,
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
      bubbles: [],
    };
  },
  async mounted() {
    for await (const message of this.message.content.bubbles) {
      this.bubbles.push(message);
      this.$emit('updateScroll');
      await delay(1000);
    }

    const message = this.createHTML();
    this.bubbles.push({ message, class: true });

    await this.$nextTick();
    const img = document.getElementById(this.message.content.image.id);
    this.$emit('observe', img);

    this.showOptions = true;
    this.$emit('updateScroll');
  },
  methods: {
    createHTML() {
      const image = createResponsiveImage(
        this.message.content.image.filename,
        this.message.content.image.id
      );
      return `<h1>${this.message.content.title}</h1>\n${image}\n${marked(
        this.message.content.content
      )}`;
    },
  },
};
</script>
