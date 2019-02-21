<template light>
    <v-card class="resume-wrapper">
        <iframe frameborder="0" scrolling="no"
        src="https://manastalukdar.github.io/resume-cv" name="resumeBox" id="resumeBox">
        <p>iframes are not supported by your browser.</p>
        </iframe>
    </v-card>
</template>

<script>
export default {}
</script>

<style>
.resume-wrapper {
    position: relative;
    padding-bottom: 200%; /* 56.25% = 16:9 */
    padding-top: 25px;
    height: 0;
    overflow: hidden;
}
.resume-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
    overflow: hidden;
}
</style>
