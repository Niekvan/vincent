<template>
  <transition name="fade" appear>
    <div :class="isAnswer ? 'self-end' : 'self-start'">
      <div
        class="p-4 mb-2 rounded-lg shadow"
        :class="[
          isAnswer
            ? 'rounded-tr-sm bg-gray-700 text-white'
            : 'rounded-tl-sm bg-white text-gray-800',
          isSolution ? 'max-w-full' : 'max-w-sm',
        ]"
        v-html="message"
      />
    </div>
  </transition>
</template>

<script>
import CButton from './Button';

export default {
  name: 'Message',
  components: {
    CButton,
  },
  props: {
    message: {
      type: String,
      required: true,
    },
    isAnswer: {
      type: Boolean,
    },
    isSolution: {
      type: Boolean,
      default: false,
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
