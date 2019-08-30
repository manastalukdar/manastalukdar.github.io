const functions = {
  getTargetBlankLinkRender(md) {
    // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
    // Remember old renderer, if overridden, or proxy to default renderer
    const defaultRender =
      md.renderer.rules.link_open ||
      function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
      }

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
      // If you are sure other plugins can't add `target` - drop check below
      const aIndex = tokens[idx].attrIndex('target')

      const hrefIndex = tokens[idx].attrIndex('href')
      let isLocal = false

      if (hrefIndex >= 0) {
        const linkVal = tokens[idx].attrs[hrefIndex][1]
        if (linkVal.charAt(0) === '#') {
          isLocal = true
        }
      }

      if (!isLocal) {
        if (aIndex < 0) {
          tokens[idx].attrPush(['target', '_blank']) // add new attribute
        } else {
          tokens[idx].attrs[aIndex][1] = '_blank' // replace value of existing attr
        }
      }

      // pass token to default renderer.
      return defaultRender(tokens, idx, options, env, self)
    }
  },

  getPlantUmlFencedRender(md) {
    const defaultRender =
      md.renderer.rules.fence ||
      function(tokens, idx, options, env, slf) {
        return slf.renderToken(tokens, idx, options)
      }

    md.renderer.rules.fence = function(tokens, idx, options, env, slf) {
      const token = tokens[idx]
      const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
      let langName = ''
      // let highlighted
      // let i
      // let tmpAttrs
      // let tmpToken

      if (info) {
        langName = info.split(/\s+/g)[0]
      }

      if (langName === 'plantuml') {
        return token.content
      }

      return defaultRender(tokens, idx, options, env, slf)
    }
  }
}

export default {
  functions
}
