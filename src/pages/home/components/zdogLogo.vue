<template>
  <canvas class="zdog-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Zdog from "zdog";

onMounted(() => {
  const TAU = Zdog.TAU;

  let illo = new Zdog.Illustration({
    // set canvas with selector
    element: '.zdog-canvas',
    dragRotate: true,
    // stop rotation when dragging starts
    onDragStart: function() {
    },
  });

  let body = new Zdog.Box({
    addTo: illo,
    rotate: { z: -TAU/32, x: TAU/64, y: TAU/32 },
    width: 100,
    height: 100,
    depth: 100,
    stroke: false,
    color: '#fff', // default face color
  });

  let rect = new Zdog.Rect({
    addTo: body,
    width: 102,
    height: 102,
    stroke: 5,
    translate: { z: 53},
    color: '#000',
  });

  let circle = new Zdog.Ellipse({
    addTo: rect,
    diameter: 80,
    stroke: 5,
    color: '#000',
  });

  new Zdog.Ellipse({
    addTo: circle,
    diameter: 1,
    translate: { x: -10, y: -10, z: 2.5 },
    stroke: 5,
    color: '#000',
  }).copy({
    // overwrite original options
    translate: { x: 10, y: -10, z: 2.5 },
  });

  new Zdog.Ellipse({
    addTo: circle,
    diameter: 30,
    quarters: 2, // semi-circle
    translate: { y: 10, z: 2.5 },
    // rotate semi-circle to point up
    rotate: { z: TAU/4 },
    stroke: 5,
    // hide when front-side is facing back
    backface: false,
  });

  function animate() {
    illo.updateRenderGraph();
    requestAnimationFrame(animate)
  }
  // start animation
  animate();
});
</script>

<style scoped>
canvas {
  display: block;
  width: 400px;
  height: 400px;
  cursor: move;
}
</style>
