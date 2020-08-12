<template>
  <Layout>
    <div class="wrapper flex">
      <video class="video" autoplay muted loop>
        <source :src="video" type="video/mp4" />
      </video>
      <div
        class="chat flex flex-col px-3 py-2 bg-white bg-opacity-75 rounded-lg"
      >
        <Message
          :key="message.uuid"
          v-for="message in messages"
          :message="message"
          @choice="handleChoice"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import Message from '../components/Message';

export default {
  name: 'Home',
  metaInfo: {
    title: 'Hello, world!',
  },
  components: {
    Message,
  },
  data() {
    return {
      video: null,
      messages: [],
      questions: null,
    };
  },
  created() {
    const globalNode = this.$page.allStoryblokEntry.edges.find(
      (edge) => edge.node.name === 'global'
    );

    this.video = globalNode.node.content.background_video.filename;
    this.questions = this.$page.allStoryblokEntry.edges
      .filter((edge) =>
        ['question', 'solution'].includes(edge.node.content.component)
      )
      .map((edge) => edge.node);

    // Set the first question
    const firstQuestion = this.$page.allStoryblokEntry.edges.find(
      (edge) =>
        edge.node.is_startpage === true &&
        edge.node.content.component === 'question'
    );
    this.messages.push(firstQuestion.node);
  },
  methods: {
    handleChoice(data) {
      const { answer, link } = data;
      const newQuestion = this.questions.find(
        (question) => question.uuid === link
      );
      this.messages.push(answer);
      setTimeout(() => {
        this.messages.push(newQuestion);
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

  justify-content: center;
  align-items: center;
}
.video {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.chat {
  width: 50%;
  max-width: 768px;
  height: 80%;
}
</style>
