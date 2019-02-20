<template>
    <div class="wrapper">
        <iframe frameborder="0"
        src="https://manastalukdar.github.io/tempsandbox/blog" name="imgbox" id="imgbox">
        <p>iframes are not supported by your browser.</p>
        </iframe>
    </div>
</template>

<script>
export default {}
</script>

<style>
.wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    padding-top: 25px;
    height: 0;
}
.wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
