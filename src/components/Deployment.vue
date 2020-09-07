<template>
  <div
    ref="deployment"
    class="deployment absolute bottom-0 left-0 ml-10 py-4 max-w-md w-full h-full z-10 overflow-hidden"
  >
    <transition-group
      ref="scroll"
      tag="div"
      name="fade"
      mode="out-in"
      class="scroll h-full overflow-y-scroll"
    >
      <message
        :key="`${message.uuid}-first`"
        :is-solution="true"
        class="message message--first bg-blue-500 mt-4 rounded-tl-lg"
      >
        <div class="flex justify-between text-blue-500">
          <h1 :class="{ 'mb-2': message.content.image.filename }">
            Deployment:
            <span class="font-medium">{{ message.content.title }}</span>
          </h1>
          <span class="underline cursor-pointer" @click="reset">close</span>
        </div>
        <c-image
          v-if="message.content.image.filename"
          :url="message.content.image.filename"
        />
      </message>
      <message
        :key="message._uid"
        v-for="(message, index) in message.content.message_bubbles"
        v-show="index < messageCount"
        :is-solution="true"
        class="flex justify-between items-center rounded-tl-lg message"
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
        class="message rounded-tl-lg"
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
      this.$nextTick(
        () =>
          (this.$refs.scroll.$el.scrollTop = this.$refs.scroll.$el.scrollHeight)
      );
      if (this.messageCount > this.message.content.message_bubbles.length + 2) {
        clearInterval(interval);
      }
    }, 1000);
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

<style lang="postcss" scoped>
.deployment {
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1.5rem;
    left: 0;
    right: 0;
  }

  &::before {
    top: 1rem;
    background: linear-gradient(to top, hsla(0, 0%, 100%, 0) 25%, #ffffff 100%);
    z-index: 1;
  }

  &::after {
    bottom: 1rem;
    background: linear-gradient(
      to bottom,
      hsla(0, 0%, 100%, 0) 25%,
      #ffffff 100%
    );
  }
}

.message {
  &--first {
    &::v-deep {
      & > div {
        @apply text-white;
      }
    }
  }
}

.scroll {
  width: calc(100% + 17px);
  scroll-behavior: smooth;
}
</style>
