<template>
  <div id="gr_custom_widget_1693083477" />
</template>

<script setup>
// import axios from 'axios'; - Removed as it's not actually used
const goodreadsbaseURL = 'https://www.goodreads.com';
const url = "/review/custom_widget/5987383.Reading?cover_position=left&cover_size=small&num_books=5&order=d&shelf=currently-reading&show_author=1&show_cover=0&show_rating=0&show_review=0&show_tags=0&show_title=1&sort=date_updated&widget_bg_color=FFFFFF&widget_bg_transparent=&widget_border_width=1&widget_id=1693083477&widget_text_color=000000&widget_title_size=medium&widget_width=medium";
onMounted(() => {
const goodreadsScript = document.createElement("script");
goodreadsScript.setAttribute(
      "src",
      goodreadsbaseURL+url
    );
document.head.appendChild(goodreadsScript);
/*const dummy = axiosInstance
  .get(url)
  .then(response  => {
    console.log(response)
  })
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // eslint-disable-next-line no-console
      console.log(error.response.data)
      // eslint-disable-next-line no-console
      console.log(error.response.status)
      // eslint-disable-next-line no-console
      console.log(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // eslint-disable-next-line no-console
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      // eslint-disable-next-line no-console
      console.log('Error', error.message)
    }
    // eslint-disable-next-line no-console
    console.log(error.config)
  });
  console.log(dummy)*/
});
</script>

<style>
.gr_custom_container_1693083477 {
    /* customize your Goodreads widget container here*/
    border: 1px solid gray;
    border-radius:10px;
    padding: 10px 8px 10px 8px;
    min-width: 220px;
    /*background-color:  #FFFFFF;
    color: #000000;
    width: 300px*/
}
.gr_custom_header_1693083477 {
  /* customize your Goodreads header here*/
  border-bottom: 1px solid gray;
  /*width: 100%;*/
  margin-bottom: 5px;
  text-align: center;
  font-size: 120%
}
.gr_custom_each_container_1693083477 {
  /* customize each individual book container here */
  width: 100%;
  clear: both;
  margin-bottom: 10px;
  overflow: auto;
  padding-bottom: 4px;
  border-bottom: 1px dotted #aaa;
}
.gr_custom_book_container_1693083477 {
  /* customize your book covers here */
  overflow: hidden;
  height: 60px;
    float: left;
    margin-right: 4px;
    width: 39px;
}
.gr_custom_author_1693083477 {
  /* customize your author names here */
  font-size: 10px;
}
.gr_custom_tags_1693083477 {
  /* customize your tags here */
  font-size: 10px;
  color: gray;
}
.gr_custom_rating_1693083477 {
  /* customize your rating stars here */
  float: right;
}
</style>
