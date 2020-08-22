<template>
  <div>
    <avatar :url="avatar.filename" />
    <message :is-answer="false" :is-solution="true" class="w-full">
      <h1>Deployment: {{ message.content.title }}</h1>
      <c-image ref="image" :url="message.content.image.filename" />
      <div v-html="content" />
      <span
        class="inline-block px-2 leading-relaxed text-xs rounded-full uppercase te font-semibold"
        :class="status.content.text_colour"
        :style="{ background: status.content.colour }"
        >{{ status.content.text }}</span
      >
    </message>
    <transition name="fade">
      <div class="flex w-full justify-end">
        <c-button
          v-if="showButtons"
          :option="globalSolutions"
          @click.native="switchToGlobe"
        />
        <c-button :option="startOver" @click.native="reset" />
      </div>
    </transition>
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
    avatar: {
      type: Object,
      required: true,
    },
    showButtons: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      content: null,
      globalSolutions: 'View global solutions',
      startOver: 'Start-over',
      status: null,
    };
  },
  created() {
    this.content = marked(this.message.content.content);
    this.status = this.$static.statuses.edges
      .map((edge) => edge.node)
      .find((node) => node.uuid === this.message.content.status);
  },
  mounted() {
    this.$emit('observe', this.$refs.image.$el);
  },
  methods: {
    switchToGlobe() {
      this.$emit('globe', true);
    },
    reset() {
      this.$emit('reset');
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
