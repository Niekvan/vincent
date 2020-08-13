<template>
  <svg ref="svg" class="w-full h-full text-gray-300">
    <path class="fill-current stroke-gray-500" :d="path" />
    <path
      class="fill-current text-transparent stroke-gray-500"
      :d="graticulePath"
    />
    <circle
      :key="deployment.content._uid"
      v-for="deployment in deployments"
      :cx="coordinateToProjection(deployment, 0)"
      :cy="coordinateToProjection(deployment, 1)"
      :class="calculateFill(deployment)"
      class="fill-current cursor-pointer"
      r="7"
      @mouseenter="cancelRotation"
      @mouseleave="continueRotation"
      @click="showDeployment(deployment)"
    />
  </svg>
</template>

<script>
import { select } from 'd3-selection';
import { geoPath, geoOrthographic, geoGraticule, geoDistance } from 'd3-geo';
import * as topojson from 'topojson';

let geoJson;

export default {
  name: 'Globe',
  props: {
    deployments: {
      type: Array,
      required: true,
    },
    world: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      path: '',
      graticulePath: '',
      rotation: [0, -30, 0],
      projection: null,
      center: null,
      animationId: null,
    };
  },
  created() {
    geoJson = topojson.feature(this.world, this.world.objects.countries);
    this.projection = geoOrthographic();
  },
  mounted() {
    this.$nextTick(() => {
      this.center = [
        this.$refs.svg.clientWidth / 2,
        this.$refs.svg.clientHeight / 2,
      ];
      this.projection.fitSize(
        [this.$refs.svg.clientWidth, this.$refs.svg.clientHeight],
        geoJson
      );
      this.animationId = window.requestAnimationFrame(this.rotate);
    });
  },
  methods: {
    coordinateToProjection(deployment, index) {
      return this.projection([
        Number(deployment.content.long),
        Number(deployment.content.lat),
      ])[index];
    },
    calculateFill(deployment) {
      if (this.projection === null || this.center === null)
        return 'text-transparent';

      const coordinate = [
        Number(deployment.content.long),
        Number(deployment.content.lat),
      ];
      const distance = geoDistance(
        coordinate,
        this.projection.invert(this.center)
      );
      return distance > Math.PI / 2 ? 'text-transparent' : 'text-blue-500';
    },
    rotate() {
      {
        this.rotation[0] = this.rotation[0] + 0.2;

        this.projection.rotate(this.rotation);

        const geoGenerator = geoPath().projection(this.projection);
        this.path = geoGenerator(geoJson);

        const graticule = geoGraticule().step([10, 10]);
        this.graticulePath = geoGenerator(graticule());

        this.animationId = window.requestAnimationFrame(this.rotate);
      }
    },
    cancelRotation() {
      window.cancelAnimationFrame(this.animationId);
    },
    continueRotation() {
      this.animationId = window.requestAnimationFrame(this.rotate);
    },
    showDeployment(deployment) {
      this.$emit('deployment', deployment);
    },
  },
};
</script>

<style scoped></style>
