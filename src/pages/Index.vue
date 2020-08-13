<template>
  <Layout>
    <div class="wrapper flex flex-col">
      <!-- <video class="video" autoplay muted loop>
        <source :src="video" type="video/mp4" />
      </video> -->
      <globe
        class="absolute"
        v-if="world"
        :world="world"
        :deployments="deployments"
      />
      <div
        class="shadow-container relative ml-40 w-1/2 max-w-lg h-full overflow-hidden bg-transparent rounded-lg"
      >
        <div ref="messageBox" class="list flex flex-col items-end pt-20 pb-20">
          <Message
            :key="`${message.uuid}-${index}`"
            v-for="(message, index) in messages"
            :message="message"
            @choice="handleChoice"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import { json } from 'd3-fetch';

import Globe from '../components/Globe';
import Message from '../components/Message';

export default {
  name: 'Home',
  metaInfo: {
    title: 'Hello, world!',
  },
  components: {
    Message,
    Globe,
  },
  data() {
    return {
      video: null,
      messages: [],
      questions: null,
      deployments: null,
      world: null,
    };
  },
  async created() {
    this.world = await json(
      'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
    );
    const globalNode = this.$page.allStoryblokEntry.edges.find(
      (edge) => edge.node.name === 'global'
    );

    this.video = globalNode.node.content.background_video.filename;

    this.questions = this.$page.allStoryblokEntry.edges
      .filter((edge) =>
        ['question', 'solution', 'deployment'].includes(
          edge.node.content.component
        )
      )
      .map((edge) => edge.node);

    // Set the first question
    const firstQuestion = this.$page.allStoryblokEntry.edges.find(
      (edge) =>
        edge.node.is_startpage === true &&
        edge.node.content.component === 'question'
    );
    this.messages.push(firstQuestion.node);

    this.deployments = this.$page.allStoryblokEntry.edges
      .filter((edge) => edge.node.content.component === 'deployment')
      .map((edge) => edge.node);
  },
  methods: {
    handleChoice(data) {
      const { answer, link } = data;
      const newQuestion = this.questions.find(
        (question) => question.uuid === link
      );
      this.messages.push(answer);
      this.$nextTick(() => {
        this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
      });
      setTimeout(() => {
        this.messages.push(newQuestion);
        this.$nextTick(() => {
          this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
        });
      }, 1000);
    },
  },
};
</script>

<page-query>
query {
  allStoryblokEntry {
    edges {
      node {
        uuid
        name
        content
        is_startpage
      }
    }
  }
}
</page-query>

<style lang="postcss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.video {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.list {
  width: calc(100% + 17px);
  height: 100%;
  overflow-y: scroll;
  scroll-behavior: smooth;
}
.shadow-container {
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 5rem;
    left: 0;
    right: 0;
  }

  &::before {
    top: 0;
    background: linear-gradient(to top, hsla(0, 0%, 100%, 0) 25%, #ffffff 100%);
  }

  &::after {
    bottom: 0;
    background: linear-gradient(
      to bottom,
      hsla(0, 0%, 100%, 0) 25%,
      #ffffff 100%
    );
  }
}
</style>
