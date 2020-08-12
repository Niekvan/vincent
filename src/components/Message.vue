<template>
  <transition name="fade" appear>
    <div
      class="p-2 mb-2 bg-blue-400 text-gray-800 max-w-sm rounded-md"
      :class="isAnswer ? 'self-end' : 'self-start'"
    >
      <div v-html="content" />
      <template v-if="!isAnswer && message.content.options">
        <div class="flex w-full justify-end">
          <button
            :key="option._uid"
            v-for="option in message.content.options"
            class="px-2 py-1 ml-2 text-sm bg-blue-900 text-gray-200 rounded-md"
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
      this.$emit('choice', { answer: option.answer, link: option.link.id });
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
