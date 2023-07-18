<script setup lang="ts">
import { ref, inject, type Ref } from "vue";


const queryVideoRef: Ref<HTMLVideoElement> | undefined = inject("queryVideoRef");
const referenceImg = ref<HTMLImageElement>();
const inputFileRef = ref<HTMLInputElement>();

// 记录人脸
const handleRecordFace = async () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = queryVideoRef!.value.videoWidth;
    canvas.height = queryVideoRef!.value.videoHeight;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.drawImage(queryVideoRef!.value, 0, 0);
    canvas.toBlob((blob: any) => {
        const url = URL.createObjectURL(blob);
        referenceImg.value!.src = url;
        queryVideoRef?.value.load();
    });
}

defineExpose({
    inputFileRef,
    referenceImg
})
</script>

<template>
    <button class="btn" @click="handleRecordFace">记录人脸</button>
    <img ref="referenceImg" class="w-40 h-40 rounded-[50%] object-fill rotate-y-180 my-4"
        src="../assets/202306231687510240753957.jpg" alt="">
    <canvas id="canvas" hidden></canvas>
</template>