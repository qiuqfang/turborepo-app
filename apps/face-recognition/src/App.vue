<script setup lang="ts">
import * as faceapi from "face-api.js";
import RecordFace from "./components/RecordFace.vue";
import { onMounted, ref, provide, computed } from "vue";
import { handleToggle } from "@/utils"

const recordFaceRef = ref<InstanceType<typeof RecordFace>>();
const queryVideoRef = ref<HTMLVideoElement>();
const isRecord = ref<boolean | undefined>(false);
const isOneselfFace = ref(false);
let faceMatcher: faceapi.FaceMatcher;
let stream: MediaStream;

const text = computed(() => {
  return isRecord.value ? isOneselfFace.value ? "本人" : "非本人" : "请先记录人脸";
});

provide("queryVideoRef", queryVideoRef);

const onPlay = async () => {
  isRecord.value = !recordFaceRef.value?.referenceImg?.src.includes("202306231687510240753957")
  // 生成参照物
  const result = await faceapi
    .detectSingleFace(recordFaceRef.value?.referenceImg as HTMLImageElement)
    .withFaceLandmarks().withFaceDescriptor();

  if (!result) {
    return
  }
  faceMatcher = new faceapi.FaceMatcher(result);

  // 检测当前视频流中的人脸
  const singleResult = await faceapi.detectSingleFace(
    queryVideoRef.value as HTMLVideoElement
  ).withFaceLandmarks().withFaceDescriptor();

  let bestMatch: faceapi.FaceMatch;

  if (singleResult) {
    bestMatch = await faceMatcher.findBestMatch(singleResult.descriptor)
    console.log(bestMatch)
    isOneselfFace.value = bestMatch!.distance > 0.5 ? false : true;
  } else {
    isOneselfFace.value = false;
  }
  setTimeout(() => onPlay());
};
onMounted(async () => {
  console.log("mounted");
  // 加载模型
  await faceapi.loadFaceRecognitionModel("/models");
  await faceapi.loadFaceLandmarkModel("/models");
  await faceapi.loadSsdMobilenetv1Model("/models");

  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  try {
    queryVideoRef.value!.srcObject = stream;
  } catch (error) {
    // stream as unknown as MediaSource (它的意思是将一个未知类型的对象（可能是通过某种方式获取到的数据流）强制转换为 MediaSource 类型的对象。)
    queryVideoRef.value!.src = window.URL.createObjectURL(stream as unknown as MediaSource);
  }
  queryVideoRef.value!.onloadedmetadata = onPlay;

});
</script>

<template>
  <div class="face_wrapper dark:bg-black h-full flex justify-start items-center flex-col text-black dark:text-cyan-50">
    <video id="face_video" ref="queryVideoRef" class=" w-40 h-40 rounded-[50%] object-fill mt-4 rotate-y-180" src=""
      autoplay></video>
    <div class=" dark:text-cyan-50">
      <h1>{{ text }}</h1>
    </div>
    <RecordFace ref="recordFaceRef" />

    <i class="i-carbon-sun dark:i-carbon-moon cursor-pointer" @click="handleToggle"></i>
  </div>
</template>

<style scoped></style>
