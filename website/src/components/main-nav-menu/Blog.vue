<template>
  <v-menu
    attach
    bottom
    left
    offset-y
    max-height="500"
  >
    <v-btn
      slot="activator"
      :aria-label="blogText"
      flat
      style="min-width: 48px"
    >
      <span
        class="hidden-sm-and-down mr-1"
        v-text="blogText"
      />
      <v-icon dark>arrow_drop_down</v-icon>
    </v-btn>
    <v-list dense>
      <v-list-tile
        v-for="item in blogItems"
        :key="item.text"
        :href="item.href"
        :target="item.target">
        <v-list-tile-avatar>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-title v-text="item.text"></v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    data: () => ({
      blogText: "Blog",
      blogItems: [
        {
          href: '/blog/',
          target: '_blank',
          icon: 'mdi-newspaper',
          text: 'Posts'
        },
        {
          href: '/blog/categories',
          target: '_blank',
          icon: 'mdi-domain',
          text: 'Categories'
        },
        {
          href: '/blog/tags',
          target: '_blank',
          icon: 'mdi-tag-multiple',
          text: 'Tags'
        },
        {
          href: '/blog/archive',
          target: '_blank',
          icon: 'mdi-archive',
          text: 'Archive'
        }
      ]
    })
  }
</script>
