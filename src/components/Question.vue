<template>
  <div>
    <avatar :url="avatar.filename" />
    <message
      :key="bubble._uid"
      v-for="bubble in bubbles"
      :message="bubble.message"
      :is-answer="false"
    />
    <transition name="fade" mode="out-in">
      <div v-if="!chosen" class="flex w-full justify-end">
        <c-button
          v-show="showOptions"
          :key="option._uid"
          v-for="option in message.content.options"
          :option="option.option"
          @click.native="handleChoice(option)"
        />
      </div>
      <message
        v-else
        :key="chosen._uid"
        :message="chosen.option"
        :is-answer="true"
      />
    </transition>
  </div>
</template>

<script>
import { delay } from '@/helpers';

import Avatar from './Avatar';
import CButton from './Button';
import Message from './Message';

export default {
  name: 'Question',
  components: {
    Avatar,
    CButton,
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
  },
  data() {
    return {
      bubbles: [],
      showOptions: false,
      chosen: null,
    };
  },
  async created() {
    for await (const message of this.message.content.question) {
      this.bubbles.push(message);
      this.$emit('updateScroll');
      await delay(Number(message.delay));
    }

    this.showOptions = true;
    this.$emit('updateScroll');
  },
  methods: {
    handleChoice(option) {
      if (this.chosen === null) {
        this.chosen = option;
        this.$emit('choice', { link: option.link.id });
      }
    },
  },
};
</script>
