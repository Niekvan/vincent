<template>
  <div
    ref="deployment"
    class="deployment absolute bottom-0 left-0 ml-10 my-4 max-w-md w-full h-0 z-10 transition-transform duration-500"
    :style="{ transform }"
  >
    <transition-group tag="div" name="fade" mode="out-in" class="w-full">
      <message
        :key="`${message.uuid}-first`"
        :is-solution="true"
        class="message"
      >
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
        :key="message._uid"
        v-for="(message, index) in message.content.message_bubbles"
        v-show="index < messageCount"
        :is-solution="true"
        class="flex justify-between items-center message"
      >
        <div class="" v-html="createMarkdown(message.text)" />
        <div class="w-32">
          <c-image
            v-if="message.image.filename"
            :url="message.image.filename"
          />
        </div>
      </message>
      <message
        :key="`${message.uuid}-last`"
        v-show="message.content.message_bubbles.length + 1 < messageCount"
        :is-solution="true"
        class="message"
      >
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
    </transition-group>
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
      messageCount: 0,
      messages: [],
    };
  },
  computed: {
    transform() {
      if (!this.messages.length) return '0px';
      return `translateY(${this.messages
        .slice(0, this.messageCount + 1)
        .reduce(
          (acc, item) => acc - item.getBoundingClientRect().height - 8,
          0
        )}px)`;
    },
  },
  created() {
    this.status = this.$static.statuses.edges
      .map((edge) => edge.node)
      .find((node) => node.uuid === this.message.content.status);
  },
  mounted() {
    this.messages = Array.from(
      this.$refs.deployment.querySelectorAll('.message')
    );
    const images = this.$refs.deployment.querySelectorAll('.observe');
    images.forEach((image) => {
      this.$emit('observe', image);
    });
    const interval = setInterval(() => {
      this.messageCount++;
      if (this.messageCount > this.message.content.message_bubbles.length + 2) {
        clearInterval(interval);
      }
    }, 300);
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
