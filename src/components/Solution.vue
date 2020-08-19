<template>
  <div>
    <avatar :url="avatar.filename" />
    <message
      :key="bubble._uid"
      v-for="bubble in bubbles"
      :message="bubble.message"
      :is-answer="false"
    />
    <message
      v-show="showSolution"
      :is-answer="false"
      :is-solution="true"
      class="w-full"
    >
      <c-image ref="image" :url="message.content.image.filename" />
      <div v-html="content" />
    </message>
    <template v-if="showButtons">
      <transition name="fade" mode="out-in">
        <div v-if="!chosen" class="flex w-full justify-end">
          <c-button
            v-show="showButton"
            :option="answer"
            @click.native="handleChoice(message.content.link)"
          />
        </div>
        <message
          v-else
          :key="chosen._uid"
          :message="answer"
          :is-answer="true"
        />
      </transition>
    </template>
  </div>
</template>

<script>
import marked from 'marked';

import { delay, createResponsiveImage } from '@/helpers';

import Avatar from './Avatar';
import CButton from './Button';
import CImage from './ResizedImage';
import Message from './Message';

export default {
  name: 'Solution',
  components: {
    Avatar,
    CButton,
    CImage,
    Message,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    avatar: {
      type: Object,
      required: true,
    },
    showButtons: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      bubbles: [],
      answer: 'View depoyment solution',
      content: null,
      showSolution: false,
      showButton: false,
      chosen: null,
    };
  },
  async mounted() {
    for await (const message of this.message.content.bubbles) {
      this.bubbles.push(message);
      this.$emit('updateScroll');
      await delay(1000);
    }

    this.content = marked(this.message.content.content);
    await this.$nextTick();
    this.showSolution = true;
    this.$emit('observe', this.$refs.image.$el);

    this.showButton = true;
    this.$emit('updateScroll');
  },
  methods: {
    handleChoice(option) {
      if (this.chosen === null) {
        this.chosen = option;
        this.$emit('choice', { link: option.id });
      }
    },
  },
};
</script>
