<template>
  <div
    ref="deployment"
    class="deployment absolute bottom-0 left-0 ml-4 my-4 max-w-md w-full z-10"
  >
    <message :is-solution="true">
      <div class="flex justify-between text-blue-500">
        <h1 class="mb-2">
          Deployment:
          <span class="font-medium">{{ message.content.title }}</span>
        </h1>
        <span class="underline cursor-pointer" @click="reset">close</span>
      </div>
      <c-image :url="message.content.image.filename" />
    </message>
    <message
      :key="message.uuid"
      v-for="message in message.content.message_bubbles"
      :is-solution="true"
      class="flex justify-between items-center"
    >
      <div class="" v-html="createMarkdown(message.text)" />
      <div class="w-32">
        <c-image v-if="message.image.filename" :url="message.image.filename" />
      </div>
    </message>
    <message :is-solution="true">
      <p>
        Status:
        <span
          class="inline-block px-2 leading-relaxed text-xs rounded-full uppercase te font-semibold"
          :class="status.content.text_colour"
          :style="{ background: status.content.colour }"
          >{{ status.content.text }}</span
        >
        <br />
        {{ message.content.status_comment }}
      </p>
    </message>
  </div>
</template>

<script>
import marked from 'marked';

import Avatar from './Avatar';
import CButton from './Button';
import CImage from './ResizedImage';
import Message from './Message';

export default {
  name: 'Deployment',
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
  },
  data() {
    return {
      status: null,
    };
  },
  created() {
    this.status = this.$static.statuses.edges
      .map((edge) => edge.node)
      .find((node) => node.uuid === this.message.content.status);
  },
  mounted() {
    const images = this.$refs.deployment.querySelectorAll('.observe');
    images.forEach((image) => {
      this.$emit('observe', image);
    });
  },
  methods: {
    reset() {
      this.$emit('resetDeployment');
    },
    createMarkdown(content) {
      return marked(content);
    },
  },
};
</script>

<static-query>
query {
  statuses: allStoryblokEntry(filter: { parent_id: { eq: 18481268 }}) {
    edges {
      node {
        uuid
        name
        content
      }
    }
  }
}
</static-query>
