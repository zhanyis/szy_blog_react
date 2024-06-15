<template>
  <div class="home-container relative">
    <zdog-logo ref="zdog" class="mx-auto zdog-logo" style="position: sticky;top: 0"/>
    <div class="btn-group">
      <div class="hello-world rounded-3xl link-box">
        HELLO WORLD
      </div>
      <div class="link-box hello-world-1 cursor-pointer">
        <div class="bg-emerald-900 rounded-3xl btn-text">
          GAMES (doing)
        </div>
      </div>
      <div class="link-box hello-world-2 cursor-pointer">
        <div class="bg-fuchsia-900 rounded-3xl btn-text">
          STOCK ROBOT (doing)
        </div>
      </div>
      <div class="link-box hello-world-3 cursor-pointer">
        <div class="bg-rose-900 rounded-3xl btn-text">
          ABOUT ME (doing)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import zdogLogo from './components/zdogLogo.vue';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  const logoTl = gsap.timeline();

  logoTl
    .to('.zdog-logo', { scale: 0.6, rotate: 360, ease: 'slow' })
    // .to('.zdog-logo', { y: '20vh' })

  ScrollTrigger.create({
    animation: logoTl,
    trigger: '.zdog-logo',
    start: 'center center',
    end: 'top top',
    scrub: 1,
    // markers: true,
  })

  const helloWorldTL = gsap.timeline();

  helloWorldTL
    .to('.hello-world', { opacity: 1, ease: 'slow' })
    .to('.hello-world-1', { opacity: 1, ease: 'slow' })
    .to('.hello-world-2', { opacity: 1, ease: 'slow' })
    .to('.hello-world-3', { opacity: 1, ease: 'slow' })
    // .to('.zdog-logo', { y: '20vh' })

  ScrollTrigger.create({
    animation: helloWorldTL,
    trigger: '.btn-group',
    start: 'top center',
    end: 'top 180px',
    scrub: 1,
    // markers: true,
  })


  // gsap.to('.zdog-logo', {
  //   scrollTrigger: {
  //     trigger: '.hello-world',
  //     start: 'top bottom',
  //     end: 'top top',
  //     pin: true,
  //     markers: true,
  //     scrub: 2,
  //   },
  // })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((trigger) => {
  // 把 ScrollTrigger 綁定的動畫消除
    trigger.kill();
  });
  // 消除綁定 MatchMedia();
  ScrollTrigger.clearMatchMedia();
});

const router = useRouter()

const jumpToComment = () => {
  router.push('/comment')
}
</script>

<style scoped>

.home-page-color {
  color: #fff;
  background-color: bisque;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.home-container {
  min-height: calc(100vh - 4rem);
  color: #fff;
}

.zdog-logo {
  margin-top: calc(50vh - 75px);
}

.hello-world {
  /* margin-top: calc(50vh - 75px); */
}

.btn-group {

}

.link-box {
  height: calc((100vh - 4rem - 180px) / 4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.links {
  margin-top: 60vh;
}

.btn-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  padding: 40px;
  width: 66.666667%;
}
</style>
