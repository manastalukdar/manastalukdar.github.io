const functions = {
  getTargetBlankLinkRender(md: any) {
    // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
    // Remember old renderer, if overridden, or proxy to default renderer
    const defaultRender =
      md.renderer.rules.link_open ||
      function (tokens: any, idx: any, options: any, env: any, self: any) {
        return self.renderToken(tokens, idx, options)
      }

    md.renderer.rules.link_open = function (tokens: any, idx: any, options: any, env: any, self: any) {
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
}

export default {
  functions,
}
