<template>
  <div class="question">
    <message
      :key="bubble._uid"
      v-for="bubble in bubbles"
      :message="bubble.message"
      :is-answer="false"
    />
    <transition name="fade">
      <div v-show="showOptions" class="flex w-full justify-start">
        <c-button
          :key="option._uid"
          v-for="option in message.content.options"
          :option="option.option"
          @click.native="handleChoice(option)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { delay } from '@/helpers';

import CButton from './Button';
import Message from './Message';

export default {
  name: 'Question',
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
      showOptions: false,
    };
  },
  async created() {
    for await (const message of this.message.content.question) {
      this.bubbles.push(message);
      this.$emit('updateScroll');
      await delay(500);
    }

    this.showOptions = true;
    this.$emit('updateScroll');
  },
  methods: {
    handleChoice(option) {
      this.$emit('choice', { answer: option.answer, link: option.link.id });
    },
  },
};
</script>
