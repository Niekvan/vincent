<template>
  <transition name="fade" appear>
    <div :class="isAnswer ? 'self-end' : 'self-start'">
      <div
        class="p-4 mb-2 rounded-lg shadow"
        :class="[
          isAnswer
            ? 'mt-4 mb-4 rounded-tr-sm bg-gray-700 text-white'
            : 'rounded-tl-sm bg-white text-gray-800',
          isSolution ? 'max-w-full' : 'max-w-sm',
        ]"
      >
        <slot>
          <div v-html="message" />
        </slot>
      </div>
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
