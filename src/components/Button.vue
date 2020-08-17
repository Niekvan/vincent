<template>
  <button
    class="px-5 py-3 ml-2 first:ml-0 mt-4 mb-4 transition duration-150 rounded-md bg-blue-500 hover:bg-blue-600 text-white outline-none focus:outline-none"
  >
    {{ option }}
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    option: {
      type: String,
      required: true,
    },
  },
};
</script>
