<template>
  <v-row class="app pt-3">
    <v-col cols="12">
      <v-card color="cardColor" raised elevation="8">
        <div>
          <v-breadcrumbs
            :items="props.breadcrumbs"
            class="justify-center"
          >
            <template v-slot:title="{ item }">
              <client-only>
              <v-breadcrumbs-item
                  :to="item.href"
                  nuxt
                  exact
              >
                  {{ item.title }}
              </v-breadcrumbs-item>
              </client-only>
            </template>
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-breadcrumbs>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const route = useRoute();
const props = defineProps({
  breadcrumbs: Array
});
//console.log(props.breadcrumbs)
//console.log(route.path)
//:disabled="item.href === route.path"
</script>
