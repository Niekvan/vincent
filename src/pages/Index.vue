<template>
  <Layout>
    <div class="wrapper flex flex-col">
      <transition name="fade" mode="out-in">
        <globe
          class="absolute"
          v-if="world && showWorld"
          :world="world"
          :deployments="deployments"
        />
        <video v-else ref="video" class="video" autoplay muted loop>
          <source :src="video" type="video/mp4" />
        </video>
      </transition>
      <div
        class="shadow-container relative ml-40 w-1/2 max-w-lg h-full overflow-hidden bg-transparent rounded-lg"
      >
        <div ref="messageBox" class="list pt-20 pb-20">
          <component
            :key="`${message.uuid}-${index}`"
            v-for="(message, index) in messages"
            :message="message"
            :is-answer="typeof message === 'string'"
            :is="getComponent(message)"
            class="flex flex-col items-end"
            @choice="handleChoice"
            @updateScroll="scrollToBottom"
            @observe="observeElement"
            @globe="handleGlobe"
            @reset="handleReset"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import axios from 'axios';

import Globe from '../components/Globe';

import Message from '../components/Message';

import Deployment from '../components/Deployment';
import Question from '../components/Question';
import Solution from '../components/Solution';

export default {
  name: 'Home',
  metaInfo: {
    title: 'Geodesign',
  },
  components: {
    Globe,
    Deployment,
    Message,
    Question,
    Solution,
  },
  data() {
    return {
      messages: [],
      questions: null,
      deployments: null,
      world: null,
      observer: null,
      showWorld: false,
      video: null,
      videoIndex: 0,
      videos: null,
    };
  },
  metaInfo() {
    const edge = this.$page.allStoryblokEntry.edges.find(
      (edge) => edge.node.name === 'global'
    );
    return {
      link: edge.node.content.videos.map((item) => ({
        rel: 'preload',
        href: item.video.filename,
        as: 'video',
        type: 'video/mp4',
      })),
    };
  },
  async created() {
    const globalNode = this.$page.allStoryblokEntry.edges.find(
      (edge) => edge.node.name === 'global'
    );

    this.videos = globalNode.node.content.videos;
    this.video = this.videos[0].video.filename;

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

    const { data: world } = await axios.get(
      'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
    );
    this.world = world;
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (window.lazySizes) {
            window.lazySizes.autoSizer.updateElem(entry.target);
          }
          this.observer.unobserve(entry.target);
        }
      });
    });
  },
  methods: {
    async handleChoice(data) {
      const { answer, link } = data;
      const newQuestion = this.questions.find(
        (question) => question.uuid === link
      );
      if (this.videoIndex < this.videos.length - 1) {
        this.videoIndex++;
        this.video = this.videos[this.videoIndex].video.filename;
        this.$refs.video.load();
      }
      this.messages.push(answer);
      this.scrollToBottom();

      setTimeout(() => {
        this.messages.push(newQuestion);
        this.scrollToBottom();
      }, 1000);
    },
    handleReset() {
      this.videoIndex = 0;
      this.video = this.videos[this.videoIndex].video.filename;
      this.$refs.video.load();
      this.showWorld = false;
      this.messages.splice(1);
    },
    handleGlobe(show) {
      this.showWorld = show;
    },
    async scrollToBottom() {
      await this.$nextTick();
      this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
    },
    getComponent(item) {
      if (typeof item === 'string') return 'message';
      return item.content.component;
    },
    observeElement(element) {
      this.observer.observe(element);
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
