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
      // const tracks = stream.getTracks();
      // for (const track of tracks) {
      //   track.stop();
      // }
    }
  };
  videoEl.onloadedmetadata = onPlay;
});

const isFace = ref(false);

const handleToggle = () => {
  const htmlEl = document.documentElement

  htmlEl.classList.toggle("dark");
  if (htmlEl.classList.value.includes("dark")) {
    localStorage.theme = "dark";
  } else {
    localStorage.theme = "light";
  }
};
</script>

<template>
  <div class="face_wrapper dark:bg-black h-full flex justify-start items-center flex-col text-black dark:text-cyan-50">
    <video id="face_video" class=" w-40 h-40 rounded-[50%] object-fill mt-4 rotate-y-180" src="" autoplay></video>
    <div class=" dark:text-cyan-50 mt-4">
      <h1>{{ isFace ? "人类" : "特殊物种" }}</h1>
    </div>

    <i class="i-carbon-sun dark:i-carbon-moon cursor-pointer" @click="handleToggle"></i>
  </div>
</template>

<style scoped></style>
