<script setup lang="ts">
import * as faceapi from "face-api.js";
import { onMounted, ref } from "vue";

onMounted(async () => {
  console.log("mounted");
  const result = await faceapi.loadTinyFaceDetectorModel("/models");

  console.log(result, "loadTinyFaceDetectorModel");

  const videoEl = document.getElementById("face_video") as HTMLVideoElement;

  const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  try {
    videoEl.srcObject = stream;
  } catch (error) {
    // stream as unknown as MediaSource (它的意思是将一个未知类型的对象（可能是通过某种方式获取到的数据流）强制转换为 MediaSource 类型的对象。)
    videoEl.src = window.URL.createObjectURL(stream as unknown as MediaSource);
  }

  const onPlay = async () => {
    const detection = await faceapi.detectSingleFace(
      videoEl,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
      })
    );
    console.log(detection);
    if (!detection) {
      setTimeout(() => onPlay());
    } else {
      isFace.value = true;
      console.log(stream.getTracks());
      const tracks = stream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
    }
  };
  videoEl.onloadedmetadata = onPlay;
});

const isFace = ref(false);
</script>

<template>
  <div class="face_wrapper dark:bg-black h-full">
    <video id="face_video" src="" autoplay hidden></video>
    <div class="flex justify-center items-center dark:text-cyan-50">
      <h1>{{ isFace ? "人类" : "特殊物种" }}</h1>
    </div>
  </div>
</template>

<style scoped>
#face_video {
  width: 100vw;
  height: 100vh;
}
</style>
