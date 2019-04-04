<template>
  <v-layout
    wrap
  >
    <v-flex xs12>
      <v-layout row justify-center title>
        <p>
          {{ postMetadata.title }}
        </p>
      </v-layout>
      <v-layout row justify-center wrap>
        Authors:&nbsp;
        <div
          v-for="item in postMetadata.authors"
          :key="item['name']"
        >
          <nuxt-link
            :to="{ name: 'blog-author-name', params: { name:item['url-slug'] } }"
          >
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        &nbsp;
        || First Published: {{ postMetadata["first-published-on"] }} || Last Updated: {{ postMetadata["last-updated-on"] }}
      </v-layout>
      <v-layout row justify-center wrap>
        Categories:&nbsp;
        <div
          v-for="item in postMetadata.categories"
          :key="item['name']"
        >
          <nuxt-link
            :to="{ name: 'blog-category-name', params: { name:item['url-slug'] } }"
          >
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        &nbsp;|| Tags:&nbsp;
        <div
          v-for="item in postMetadata.tags"
          :key="item['name']"
        >
          <nuxt-link
            :to="{ name: 'blog-tag-name', params: { name:item['url-slug'] } }"
          >
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        &nbsp;|| Post-format:&nbsp;
        <nuxt-link
          :to="{ name: 'blog-post-format-type', params: { type: postMetadata['post-format']['url-slug'] } }"
        >
          {{ postMetadata['post-format'].name }}
        </nuxt-link>
      </v-layout>
    </v-flex>
  </v-layout>
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
