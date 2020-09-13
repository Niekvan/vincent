<template>
  <transition name="fade" appear>
    <div
      class="p-4 mb-2 rounded-lg shadow"
      :class="[
        isAnswer
          ? 'self-end mt-4 mb-4 rounded-tr-sm bg-blue-700 text-blue-100'
          : 'self-start rounded-tl-sm bg-white text-gray-800',
        isSolution ? 'max-w-full' : 'max-w-sm',
      ]"
    >
      <slot>
        <div v-html="message" />
      </slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Message',
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
