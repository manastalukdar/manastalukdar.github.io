<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li>
        <a href="https://www.linkedin.com/in/manastalukdar/" target="_blank">
        <font-awesome-icon :icon="['fab', 'linkedin']" size="2x"/>
        </a>
      </li>
      <li>
        <a href="https://github.com/manastalukdar" target="_blank">
        <font-awesome-icon :icon="['fab', 'github']" size="2x"/>
        </a>
      </li>
      <li>
        <a href="https://www.twitter.com/manastalukdar/" target="_blank">
        <font-awesome-icon :icon="['fab', 'twitter']" size="2x"/>
        </a>
      </li>
    </ul>
    <br>
    <ul>
      <li>
        <a href="https://manastalukdar.github.io/resume-cv/" target="_blank">
        Resume (long)
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  name: 'Home',
  data () {
    return {
      msg: ''
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
