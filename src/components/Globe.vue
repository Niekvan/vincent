<template>
  <div ref="container" class="relative w-full h-full">
    <svg ref="svg" class="w-full h-full overflow-visible text-blue-500">
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop stop-color="#82fff7" offset="0%" />
          <stop stop-color="#00ff22" offset="100%" />
        </radialGradient>
      </defs>
      <path class="fill-current stroke-blue-500" :d="path" />
      <path
        class="fill-current text-transparent stroke-gray-500"
        :d="graticulePath"
      />
      <circle
        :key="solution.uuid"
        v-for="solution in solutions"
        :cx="coordinateToProjection(solution, 0)"
        :cy="coordinateToProjection(solution, 1)"
        :class="calculateFill(solution)"
        class="cursor-pointer"
        r="16"
        fill="url('#g1')"
        @mouseenter="cancelRotation($event, solution)"
        @mouseleave="continueRotation"
        @click="showSolution(solution)"
      />
    </svg>
    <transition name="fade">
      <div
        v-show="showTooltip"
        class="tooltip absolute p-2 bg-white shadow rounded"
        :style="tooltipPosition"
      >
        {{ tooltipText }}
      </div>
    </transition>
  </div>
</template>

<script>
import { select } from 'd3-selection';
import { geoPath, geoOrthographic, geoGraticule, geoDistance } from 'd3-geo';
import * as topojson from 'topojson';

let geoJson;

export default {
  name: 'Globe',
  props: {
    solutions: {
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
      rotation: [0, -25, 0],
      projection: null,
      resize: false,
      center: null,
      animationId: null,
      showTooltip: false,
      tooltipPosition: null,
      tooltipText: null,
    };
  },
  created() {
    geoJson = topojson.feature(this.world, this.world.objects.countries);
    this.projection = geoOrthographic();
  },
  mounted() {
    window.addEventListener('resize', this.handleResize, true);
    this.$nextTick(() => {
      this.center = [
        this.$refs.svg.clientWidth / 2,
        this.$refs.svg.clientHeight / 2,
      ];
      this.projection = geoOrthographic().fitSize(
        [this.$refs.svg.clientWidth, this.$refs.svg.clientHeight],
        geoJson
      );
      this.animationId = window.requestAnimationFrame(this.rotate);
    });
  },
  methods: {
    coordinateToProjection(solution, index) {
      return this.projection([
        Number(solution.content.long),
        Number(solution.content.lat),
      ])[index];
    },
    calculateFill(solution) {
      if (this.projection === null || this.center === null)
        return 'text-transparent';

      const coordinate = [
        Number(solution.content.long),
        Number(solution.content.lat),
      ];
      const distance = geoDistance(
        coordinate,
        this.projection.invert(this.center)
      );
      return distance > Math.PI / 2 ? 'fill-current text-transparent' : '';
    },
    rotate() {
      {
        if (this.resize) {
          this.center = [
            this.$refs.svg.clientWidth / 2,
            this.$refs.svg.clientHeight / 2,
          ];
          this.projection = geoOrthographic().fitSize(
            [this.$refs.svg.clientWidth, this.$refs.svg.clientHeight],
            geoJson
          );
          this.resize = false;
        }

        this.rotation[0] = this.rotation[0] + 0.2;

        this.projection.rotate(this.rotation);

        const geoGenerator = geoPath().projection(this.projection);
        this.path = geoGenerator(geoJson);

        const graticule = geoGraticule().step([10, 10]);
        this.graticulePath = geoGenerator(graticule());

        this.animationId = window.requestAnimationFrame(this.rotate);
      }
    },
    async cancelRotation(e, solution) {
      window.cancelAnimationFrame(this.animationId);
      const bodyRect = this.$refs.container.getBoundingClientRect();
      const box = e.target.getBoundingClientRect();

      this.tooltipPosition = {
        left: `${box.left - bodyRect.left + (box.right - box.left) / 2}px`,
        top: `${box.top - bodyRect.top}px`,
      };
      this.tooltipText = solution.content.title;
      await this.$nextTick();
      this.showTooltip = true;
    },
    continueRotation() {
      this.showTooltip = false;
      this.animationId = window.requestAnimationFrame(this.rotate);
    },
    showSolution(solution) {
      this.$emit('solution', solution);
    },
    handleResize() {
      this.resize = true;
    },
  },
};
</script>

<style scoped>
.tooltip {
  transform: translateX(-50%) translateY(calc(-100% - 0.5rem));
}
</style>
