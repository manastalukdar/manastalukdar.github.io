// https://nuxtjs.org/guide/modules
// https://github.com/nuxt/nuxt.js/issues/851

const functions = {
  aboutBlurbText: async () => {
    const fm = require('front-matter')
    const aboutBlurbTextRaw = await import(
      './src/components/other/home-page/about-blurb.md'
    )
    const res = fm(aboutBlurbTextRaw.default)
    return res.body
  }
}

export default function helper(options) {
  // You can access and modifiy options (nuxt.config.js) using this.options
  // You can even access nuxt instance using this.nuxt
  // If you want to do async things here, simply return a promise
  // or use second callback argument of function
  this.options.helper.aboutBlurbText = functions.aboutBlurbText
}
