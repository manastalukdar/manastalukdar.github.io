<template>
  <v-toolbar app>
    <v-toolbar-title class="headline text-uppercase" href="/">
      <span class="font-weight-light link">Manas Talukdar</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <toolbar-blog/>
        <v-btn flat href="/about/">About</v-btn>
        <v-btn flat href="/legal/">Legal</v-btn>
        <toolbar-contact/>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
}
</script>

<style>

</style>
