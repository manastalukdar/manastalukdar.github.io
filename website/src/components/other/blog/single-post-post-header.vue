<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center class="title">
          <p>
            {{ postMetadata.title }}
          </p>
        </v-layout>
        <v-layout row justify-center>
          Author:&nbsp;
          <nuxt-link
            :to="{ name: 'blog-author-name', params: { name:postMetadata.author } }"
          >
            {{ postMetadata.author }}
          </nuxt-link>
          &nbsp;
          || First Published: {{ postMetadata["first-published-on"] }} || Last Updated: {{ postMetadata["last-updated-on"] }}
        </v-layout>
        <v-layout row justify-center>
          Categories:&nbsp;
          <div
            v-for="item in postMetadata.categories"
            :key="item"
          >
            <nuxt-link
              :to="{ name: 'blog-category-name', params: { name:item } }"
            >
              {{ item }}
            </nuxt-link>
          &nbsp;
          </div>
          &nbsp;|| Tags:&nbsp;
          <div
            v-for="item in postMetadata.tags"
            :key="item"
          >
            <nuxt-link
              :to="{ name: 'blog-tag-name', params: { name:item } }"
            >
              {{ item }}
            </nuxt-link>
          &nbsp;
          </div>
          &nbsp;|| Post-format:&nbsp;
          <nuxt-link
            :to="{ name: 'blog-post-format-type', params: { type: postMetadata['post-format'] } }"
          >
            {{ postMetadata['post-format'] }}
          </nuxt-link>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>

<style>
</style>
