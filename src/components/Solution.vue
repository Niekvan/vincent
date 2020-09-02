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
            :option="$static.global.content.view_deployment_button"
            @click.native="handleChoice(message.content.link)"
          />
        </div>
        <message
          v-else-if="chosen"
          :key="chosen._uid"
          :message="$static.global.content.view_deployment_button"
          :is-answer="true"
        />
      </transition>
    </template>
    <template v-if="chosen">
      <transition name="fade">
        <div class="flex w-full justify-end">
          <c-button
            v-if="showButtons"
            :option="globalSolutions"
            @click.native="switchToGlobe"
          />
          <c-button :option="startOver" @click.native="reset" />
        </div>
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
      globalSolutions: 'View global solutions',
      startOver: 'Start-over',
      content: null,
      showSolution: false,
      showButton: false,
      chosen: null,
    };
  },
  created() {
    console.log(this.$static.global.content);
  },
  async mounted() {
    for await (const message of this.message.content.bubbles) {
      this.bubbles.push(message);
      this.$emit('updateScroll');
      await delay(Number(message.delay));
    }

    this.content = marked(this.message.content.content);
    await this.$nextTick();
    this.showSolution = true;
    this.$emit('observe', this.$refs.image.$el);

    this.showButton = true;
    if (this.showButtons === false) {
      this.chosen = true;
    }
    this.$emit('updateScroll');
  },
  methods: {
    handleChoice(option) {
      if (this.chosen === null) {
        this.chosen = option;
        this.$emit('deployment', option.id);
      }
    },
    switchToGlobe() {
      this.$emit('globe', true);
    },
    reset() {
      this.$emit('reset');
    },
  },
};
</script>

<static-query>
query {
  global: storyblokEntry(id: "story-17760467-default") {
    content
    id
    uuid
  }
}
</static-query>
