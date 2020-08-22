<template>
  <Layout>
    <div class="wrapper flex flex-col justify-center">
      <transition-group
        name="fade"
        mode="out-in"
        tag="div"
        class="absolute w-full h-full flex items-center justify-center"
      >
        <globe
          key="globe"
          v-if="world && showWorld"
          class="max-w-screen-md"
          :world="world"
          :solutions="solutions"
          @solution="handleGlobeSolution"
        />
        <video
          key="video"
          v-show="!showWorld"
          ref="video"
          class="video"
          autoplay
          muted
        >
          <source :src="video" type="video/mp4" />
        </video>
      </transition-group>
      <div
        class="chat-container absolute right-0 bottom-0 mr-4 mb-4 w-1/2 max-w-xl h-64 overflow-hidden bg-white bg-opacity-75 rounded-lg shadow-lg"
      >
        <div
          class="flex items-center px-4 h-8 bg-blue-500 text-white font-medium"
        >
          <span class="block leading-none">{{
            $page.global.content.chatbox_top
          }}</span>
        </div>
        <div class="shadow-container relative overflow-hidden">
          <div
            ref="messageBox"
            class="list h-full pl-4 pt-20 pb-20 overflow-y-scroll"
          >
            <component
              :key="`${message.uuid}-${index}`"
              v-for="(message, index) in messages"
              :message="message"
              :avatar="avatar"
              :is-answer="typeof message === 'string'"
              :is="getComponent(message)"
              :show-buttons="!showWorld"
              class="relative flex flex-col items-end pl-16 pr-5"
              @choice="handleChoice"
              @updateScroll="scrollToBottom"
              @observe="observeElement"
              @globe="handleGlobe"
              @reset="handleReset"
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import axios from 'axios';

import { delay } from '@/helpers';

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
      firstMessage: null,
      messages: [],
      avatar: null,
      questions: null,
      solutions: null,
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
    this.avatar = this.$page.global.content.chat_bot;
    this.videos = this.$page.global.content.videos;
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
    this.firstMessage = firstQuestion.node;
    this.messages.push(firstQuestion.node);

    // Set data for the globe
    this.solutions = this.$page.allStoryblokEntry.edges
      .filter((edge) => edge.node.content.component === 'solution')
      .map((edge) => edge.node);

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
      const { link } = data;

      if (this.showWorld && link === this.firstMessage.uuid) {
        await this.handleReset();
        return;
      }

      const newQuestion = this.questions.find(
        (question) => question.uuid === link
      );
      if (
        this.videoIndex < this.videos.length - 1 &&
        !newQuestion.is_startpage
      ) {
        this.videoIndex++;
        this.video = this.videos[this.videoIndex].video.filename;
        this.$refs.video.load();
      }

      setTimeout(() => {
        this.messages.push(newQuestion);
        this.scrollToBottom();
      }, 1000);
    },
    async handleReset() {
      this.showWorld = false;
      this.videoIndex = 0;
      this.video = this.videos[this.videoIndex].video.filename;
      await this.$nextTick();
      this.$refs.video.load();
      this.messages.splice(0);
      this.messages.push(this.firstMessage);
    },
    handleGlobe(show) {
      this.messages.splice(0);
      this.messages.push(this.$page.globeMessage);
      this.showWorld = show;
    },
    async handleGlobeSolution(solution) {
      const deployment = this.deployments.find(
        (deployment) => (deployment.uuid = solution.content.link.id)
      );
      this.messages.push(solution);
      this.scrollToBottom();
      await delay(1000 * (solution.content.bubbles.length + 1));
      this.messages.push(deployment);
      this.scrollToBottom();
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
  global: storyblokEntry(id: "story-17760467-default") {
    content
    id
    uuid
  }
  
  globeMessage: storyblokEntry(id: "story-18324548-default") {
    content
    id
    uuid
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
  scroll-behavior: smooth;
}

.chat-container {
  height: 75%;
  right: 1em;
  bottom: 1em;
}

.shadow-container {
  height: 100%;

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
    z-index: 1;
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
