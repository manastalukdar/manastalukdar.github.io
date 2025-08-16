/**
 * Markdown-it plugin to transform image tags for Nuxt Image optimization
 * Converts regular img tags to use responsive images with WebP/AVIF support
 */

export default function markdownImagePlugin(md: any) {
  // Override the default image renderer
  md.renderer.rules.image = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex('src');
    const altIndex = token.attrIndex('alt');
    
    if (srcIndex < 0) {
      return self.renderToken(tokens, idx, options);
    }

    const src = token.attrs[srcIndex][1];
    const alt = altIndex >= 0 ? token.attrs[altIndex][1] : '';
    
    // Convert relative blogdata paths to absolute paths
    const absoluteSrc = src.startsWith('../../../../../blogdata/') 
      ? src.replace('../../../../../blogdata/', '/blogdata/') 
      : src;
    
    // Check if this is a video file based on extension
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const isVideo = videoExtensions.some(ext => absoluteSrc.toLowerCase().endsWith(ext));
    
    // Also check for common video file patterns in URLs
    const videoPatterns = [/\.mp4(\?|$)/i, /\.webm(\?|$)/i, /\.ogg(\?|$)/i, /\.mov(\?|$)/i, /\.avi(\?|$)/i];
    const isVideoByPattern = videoPatterns.some(pattern => pattern.test(absoluteSrc));
    
    if (isVideo || isVideoByPattern) {
      // Render as video element for video files
      return `<video
        src="${absoluteSrc}"
        controls
        preload="metadata"
        class="blog-video"
        style="max-width: 100%; height: auto;"
      >
        Your browser does not support the video tag.
      </video>`;
    } else {
      // Use regular img tag for images with optimized attributes
      return `<img
        src="${absoluteSrc}"
        alt="${alt}"
        loading="lazy"
        class="blog-image"
        style="max-width: 100%; height: auto;"
      />`;
    }
  };
}