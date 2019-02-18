import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon,  FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  // ...apply enhancements to the app
  library.add(faUserSecret, faSpinner, faLinkedin, faGithub, faTwitter);

  Vue.component('font-awesome-icon', FontAwesomeIcon);
  Vue.component('font-awesome-layers', FontAwesomeLayers);
  Vue.component('font-awesome-layers-text', FontAwesomeLayersText);
}
