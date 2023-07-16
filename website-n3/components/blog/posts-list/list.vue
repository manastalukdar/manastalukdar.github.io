<template>
  <v-row>
    <v-col class="py-2" cols="12">
      <v-data-iterator
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="passedProps.postsList"
        row
        wrap
      >
        <template v-slot:default="props">
          <v-row v-for="item in props.items" :key="item.raw.name">
            <singlePost :post-metadata="item.raw" />
          </v-row>
          <!--<hr>-->
        </template>

        <template v-slot:footer>
          <div class="d-flex align-center justify-space-around pa-4">
            <span class="grey--text">Items per page</span>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="text"
                  color="primary"
                  class="ml-2"
                  append-icon="mdi-chevron-down"
                  v-bind="props"
                >
                  {{ itemsPerPage }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  :title="number"
                  @click="itemsPerPage = number"
                ></v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span
              class="mr-4
              grey--text"
            >
              Page {{ page }} of {{ numberOfPages() }}
            </span>
            <v-btn
              icon
              size="small"
              @click="prevPage()"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              class="ml-2"
              @click="nextPage()"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-iterator>
    </v-col>
  </v-row>
</template>

<script setup>
import singlePost from './single-post.vue'
const passedProps = defineProps({
  postsList: {
    type: Array,
    required: true,
    default() {
      return {}
    }
  },
});
const itemsPerPageArray = [5, 10];
const itemsPerPage = ref(5);
const page = ref(1);
function numberOfPages() {
  return Math.ceil(passedProps.postsList.length / itemsPerPage.value);
};
function nextPage() {
  if (page.value + 1 <= numberOfPages()) {
    page.value += 1;
  }
  //console.log(page.value)
};
function prevPage() {
  if (page.value - 1 >= 1) {
    page.value -= 1;
  }
  //console.log(page.value)
};
</script>
