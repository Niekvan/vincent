<template>
  <transition name="fade" appear>
    <div :class="isAnswer ? 'self-end' : 'self-start'">
      <div
        class="p-4 mb-2 max-w-sm rounded-lg shadow"
        :class="
          isAnswer
            ? 'rounded-tr-sm bg-gray-700 text-white'
            : 'rounded-tl-sm bg-white text-gray-800'
        "
        v-html="content"
      />
      <template v-if="!isAnswer && message.content.options">
        <div class="flex w-full justify-start">
          <button
            :key="option._uid"
            v-for="option in message.content.options"
            class="px-5 py-3 mr-2 mt-4 mb-4 transition duration-150 rounded-md bg-blue-500 hover:bg-blue-600 text-white outline-none focus:outline-none"
            :class="[
              chosen && chosen !== option._uid
                ? 'cursor-not-allowed opacity-25 hover:blue-bg-500'
                : '',
              chosen && chosen === option._uid
                ? 'bg-blue-600 cursor-default'
                : '',
            ]"
            @click="handleChoice(option)"
          >
            {{ option.option }}
          </button>
        </div>
      </template>
    </div>
  </transition>
</template>

<script>
import marked from 'marked';

export default {
  name: 'Message',
  props: {
    message: {
      type: [Object, String],
      required: true,
    },
  },
  data() {
    return {
      isAnswer: typeof this.message === 'string',
      chosen: null,
    };
  },
  computed: {
    content() {
      return this.message?.content
        ? this.message?.content.component === 'question'
          ? this.message.content.question
          : marked(this.message.content.content)
        : this.message;
    },
  },
  methods: {
    handleChoice(option) {
      if (this.chosen === null) {
        this.chosen = option._uid;
        this.$emit('choice', { answer: option.answer, link: option.link.id });
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
::v-deep {
  h1 {
    font-size: 2em;
  }
}
</style>
