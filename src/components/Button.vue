<template>
  <button
    :key="option._uid"
    class="px-5 py-3 mr-2 mt-4 mb-4 transition duration-150 rounded-md bg-blue-500 hover:bg-blue-600 text-white outline-none focus:outline-none"
    :class="[
      hasChosen && !active
        ? 'cursor-not-allowed opacity-25 hover:blue-bg-500'
        : '',
      hasChosen && active ? 'bg-blue-600 cursor-default' : '',
    ]"
  >
    {{ option.option }}
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    option: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
    },
    hasChosen: {
      type: Boolean,
    },
  },
};
</script>
