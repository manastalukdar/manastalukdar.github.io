export default function getTargetBlankLinkRender(md: { renderer: { rules: { link_open: { (tokens: any, idx: any, options: any, env: any, self: any): any; (tokens: any, idx: any, options: any, env: any, self: any): any; }; }; }; }) {
  // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
  // Remember old renderer, if overridden, or proxy to default renderer
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex("target");

    const hrefIndex = tokens[idx].attrIndex("href");
    let isLocal = false;

    if (hrefIndex >= 0) {
      const linkVal = tokens[idx].attrs[hrefIndex][1];
      console.log("linkVal: " + linkVal)
      var length = linkVal.length
      var protocol = linkVal.substring(0, linkVal.lastIndexOf("://"))
      //console.log("protocol: " + protocol)
      var urlString = linkVal.substring(linkVal.lastIndexOf("//")+2, length);
      var baseUrl = urlString.substring(0, urlString.indexOf("/"))
      console.log(baseUrl)
      if (linkVal.charAt(0) === "#" || linkVal.charAt(0) === "/" || protocol.length === 0) {
        isLocal = true;
      }
    }

    if (!isLocal) {
      if (aIndex < 0) {
        tokens[idx].attrPush(["target", "_blank"]); // add new attribute
      } else {
        tokens[idx].attrs[aIndex][1] = "_blank"; // replace value of existing attr
      }
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
};
