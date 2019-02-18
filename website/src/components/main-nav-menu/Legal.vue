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
      :aria-label="legalText"
      flat
      :to="legalPath"
      style="min-width: 48px"
    >
      <span
        class="hidden-sm-and-down mr-1"
        v-text="legalText"
      />
    </v-btn>
  </v-menu>
</template>

<script>
  export default {
    data: () => ({
      legalText: "Legal",
      legalPath: "/legal/"
    })
  }
</script>
