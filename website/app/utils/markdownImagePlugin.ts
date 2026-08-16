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
    
    // Check for media files by extension (allowing a query string / hash suffix)
    const isVideo = /\.(mp4|webm|ogv|mov|avi)([?#]|$)/i.test(absoluteSrc);
    // .ogg is ambiguous; treat it as video for backwards compatibility
    const isVideoOgg = /\.ogg([?#]|$)/i.test(absoluteSrc);
    const isAudio = /\.(mp3|wav|m4a|aac|flac|oga|opus)([?#]|$)/i.test(absoluteSrc);

    if (isVideo || isVideoOgg) {
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
    } else if (isAudio) {
      // Render as audio element for audio files
      return `<audio
        src="${absoluteSrc}"
        controls
        preload="metadata"
        class="blog-audio"
        style="max-width: 100%;"
      >
        Your browser does not support the audio tag.
      </audio>`;
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