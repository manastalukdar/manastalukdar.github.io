<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row>
      <post
        :post-metadata="postMetadata"
        :post-content="postContent"
        :url="url"
        :post-id="postId"
      />
    </v-row>
  </v-container>
</template>

<script setup>
// import axios from 'axios'; - Replaced with $fetch for better Nuxt compatibility
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import markdownItTextualUml from 'markdown-it-textual-uml';
import post from '../../../../../components/blog/single-post/post.vue';
import breadcrumbs from '../../../../../components/breadcrumbs';

import { useNavigationStore } from '@/stores/Navigation';
import { useGlobalDataStore } from '@/stores/GlobalData';
import { useBlogMetadataStore } from '@/stores/BlogMetadata';
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const baseUrl = runtimeConfig.public.baseUrl;

// Determine content base URL based on context
// Use relative paths for static sites, full URL for dev server
const contentBaseUrl = process.client && baseUrl.includes('github.io') ? '' : baseUrl;
//console.log(baseUrl)
async function setupBlogMetadata() {
    try {
        if (blogMetadataStore.blogMetadata.length < runtimeConfig.public.blogPostCount) {
          await blogMetadataStore.setupBlogMetadata(runtimeConfig.public.baseUrl);
        }
    } catch (error) {
      console.log(error)
    }
};
await setupBlogMetadata();

import hljs from 'highlight.js/lib/core'; // https://highlightjs.org/
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import java from 'highlight.js/lib/languages/java';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import csharp from 'highlight.js/lib/languages/csharp';
import shell from 'highlight.js/lib/languages/shell';
import powershell from 'highlight.js/lib/languages/powershell';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';
import yaml from 'highlight.js/lib/languages/yaml';
//import { javascript, json, java, css, python, csharp, shell, powershell, markdown, plaintext, yaml } from 'highlight.js/lib/;languages'; //https://github.com/highlightjs/highlight.js/issues/3470
hljs.registerLanguage('java', java);
hljs.registerLanguage('json', json);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('python', python);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('powershell', powershell);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('yaml', yaml);
import fm from 'front-matter';
import getTargetBlankLinkRender from "~/utils/markdownRenderHelpers.ts";

const appOwner = globalDataStore.appOwner;
const currentPage = navigationStore.blog.blogText;
const blogHref = navigationStore.blog.blogItems[0].href;
const blogBaseHref = navigationStore.blog.dynamicItems.blogBase.href;

//https://github.com/markdown-it/markdown-it/issues/495
import MarkdownIt from 'markdown-it';
import markdownItMathjax from 'markdown-it-mathjax';
import markdownItHtml5Embed from 'markdown-it-html5-embed';
import markdownItContainer from 'markdown-it-container';
import markdownItFootnote from 'markdown-it-footnote';
var md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const langClass = 'language-' + lang
        return (
          '<pre><code class="' +
          langClass +
          ' hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true })
            .value +
          '</code></pre>'
        )
        // return hljs.highlight(lang, str).value
        // eslint-disable-next-line no-empty
      } catch (__) {}
    }
    return (
      '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
    )
    // return '' // use external default escaping
  },
}).use(markdownItMathjax).use(markdownItHtml5Embed, {
    html5embed: {
    useImageSyntax: true, // Enables video/audio embed with ![]() syntax (default)
    useLinkSyntax: false, // Enables video/audio embed with []() syntax
  },
}).use(markdownItContainer, 'iframe-container', {
  render(tokens, idx) {
    if (tokens[idx].nesting === 1) {
      // const textToProcess = tokens[idx].info
      // const m = textToProcess.match(/\(.*\)/)
      // const url = m[0].replace('(', '').replace(')', '')
      // opening tag
      return '<div class="iframe-container">\n' // class="plyr__video-embed" id="player"
    } else {
      // closing tag
      return '</div>\n'
    }
  },
}).use(markdownItContainer, 'iframe-container-youtube', {
  render(tokens, idx) {
    if (tokens[idx].nesting === 1) {
      return '<div class="iframe-container-youtube">\n'
    } else {
      // closing tag
      return '</div>\n'
    }
  },
}).use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.headerLink(),
  // permalinkBefore: true,
  // permalinkSymbol: '', // §
}).use(markdownItTocDoneRight, {
  level: 2,
}).use(markdownItFootnote).use(markdownItTextualUml);
getTargetBlankLinkRender(md);
const postIdTemp =
  '/blog/' +
  route.params.year +
  '/' +
  route.params.month +
  '/' +
  route.params.day +
  '/' +
  route.params.post +
  '/';

const postMetadata = blogMetadataStore.getPostMetadata(
  route.params.year,
  route.params.month,
  route.params.day,
  route.params.post
);

// Handle case where post metadata is not found
if (!postMetadata) {
  console.error(`Post metadata not found for: ${route.params.year}/${route.params.month}/${route.params.day}/${route.params.post}`);
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog post not found'
  });
}

let fileContent;
try {
  // Use appropriate base URL based on context (static generation vs runtime)
  const fetchUrl = contentBaseUrl + '/blogdata/' + postMetadata.path;
  fileContent = await $fetch(fetchUrl);
} catch (error) {
  // eslint-disable-next-line no-console
  console.log(`Error fetching blog post content: ${error}`);
  console.log(`Attempted URL: ${contentBaseUrl}/blogdata/${postMetadata.path}`);
  console.log(`Base URL: ${baseUrl}, Client: ${process.client}`);
  fileContent = '';
}
const res = fm(fileContent);
const postContent = md.render(res.body);
const postId = postIdTemp;
const url = baseUrl+ '/' + postIdTemp;

const title =
  postMetadata.title +
  ' | ' +
  currentPage +
  ' || ' +
  appOwner;
const description = postMetadata.meta.description;
const keywordsArray = [];
const categoriesArray = [];
const tagsArray = [];
const authorsArray = [];
const authorsStructuredData = [];

// Safely process categories
if (postMetadata.categories && Array.isArray(postMetadata.categories)) {
  postMetadata.categories.forEach((cat) => {
    if (cat && cat.name) {
      categoriesArray.push(cat.name)
      keywordsArray.push(cat.name)
    }
  });
}

// Safely process tags
if (postMetadata.tags && Array.isArray(postMetadata.tags)) {
  postMetadata.tags.forEach((tag) => {
    if (tag && tag.name) {
      tagsArray.push(tag.name)
      keywordsArray.push(tag.name)
    }
  });
}

// Safely process authors
if (postMetadata.authors && Array.isArray(postMetadata.authors)) {
  postMetadata.authors.forEach((author) => {
    if (author && author.name) {
      authorsArray.push(author.name)
      keywordsArray.push(author.name)
      authorsStructuredData.push({
        '@type': 'Person',
        name: author.name,
      })
    }
  });
}
const keywords = keywordsArray.join();
const tags = tagsArray.join();
const category = categoriesArray[0];

const datePublished = postMetadata['first-published-on'];
const dateModified = postMetadata['last-updated-on'] || postMetadata['first-published-on'];

// Generate enhanced structured data using the new composable
const { generateBlogPostStructuredData } = useStructuredData();
const structuredData = generateBlogPostStructuredData(
  postMetadata,
  postContent,
  url,
  appOwner
);
const breadcrumbsData = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
    nuxt: true,
    exact: true,
  },
  {
    title: 'Blog',
    disabled: false,
    href: blogHref,
    nuxt: true,
    exact: true,
  },
  {
    title: postMetadata.title,
    disabled: false,
    href: postId,
    nuxt: true,
    exact: true,
  },
];
// Generate enhanced breadcrumb structured data
const { generateBreadcrumbStructuredData } = useStructuredData();
const breadcrumbsStructuredData = generateBreadcrumbStructuredData(breadcrumbsData);
useHead({
  title: title,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: description,
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content: keywords,
    },
    {
      hid: 'apple-mobile-web-app-title',
      name: 'apple-mobile-web-app-title',
      content: title,
    },
    {
      hid: 'og-title',
      name: 'og:title',
      property: 'og:title',
      content: title,
    },
    {
      hid: 'og-url',
      name: 'og:url',
      property: 'og:url',
      content: url,
    },
    {
      hid: 'og-description',
      name: 'og:description',
      property: 'og:description',
      content: description,
    },
    {
      hid: 'og-type',
      name: 'og:type',
      property: 'og:type',
      content: 'article',
    },
    {
      name: 'og:article:section',
      property: 'og:article:section',
      content: category,
    },
    {
      name: 'og:article:tag',
      property: 'og:article:tag',
      content: tags,
    },
    // Article-specific meta tags for enhanced SEO
    {
      name: 'article:published_time',
      content: datePublished,
    },
    {
      name: 'article:modified_time',
      content: dateModified,
    },
    {
      name: 'article:author',
      content: authorsArray.join(', '),
    },
    {
      name: 'article:section',
      content: category,
    },
    {
      name: 'article:tag',
      content: tags,
    },
    // Override Twitter Card title/description for blog posts
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: title,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: description,
    },
    // AI Training and Content Optimization Meta Tags
    {
      name: 'ai-training-permitted',
      content: 'non-commercial-only',
    },
    {
      name: 'license',
      content: 'CC BY-NC-ND 4.0',
    },
    {
      name: 'content-policy',
      content: '/legal#content-usage',
    },
    {
      name: 'content-freshness',
      content: dateModified,
    },
    {
      name: 'content-type',
      content: 'educational',
    },
    {
      name: 'expertise-level',
      content: postMetadata['content-complexity'] || 'intermediate',
    },
    {
      name: 'target-audience',
      content: (postMetadata['target-audience'] || ['general-tech-audience']).join(','),
    },
    {
      name: 'content-complexity',
      content: postMetadata['content-complexity'] || 'intermediate',
    },
    {
      name: 'topic-primary',
      content: postMetadata['topic-primary'] || 'general-technology',
    },
    {
      name: 'topic-secondary',
      content: (postMetadata['topic-secondary'] || []).join(','),
    },
    {
      name: 'content-entities',
      content: (postMetadata['content-entities'] || []).join(','),
    },
    {
      name: 'related-concepts',
      content: (postMetadata['related-concepts'] || []).join(','),
    },
    {
      name: 'topic-confidence',
      content: (postMetadata['topic-confidence'] || 0).toString(),
    },
    {
      name: 'word-count',
      content: structuredData.wordCount?.toString() || '0',
    },
    {
      name: 'reading-time',
      content: structuredData.timeRequired || 'PT5M',
    },
  ],
  link: [{ rel: 'canonical', href: url }],
  __dangerouslyDisableSanitizers: ['script'],
  script: [
    {
      innerHTML: JSON.stringify(structuredData),
      type: 'application/ld+json',
    },
    {
      innerHTML: JSON.stringify(breadcrumbsStructuredData),
      type: 'application/ld+json',
    },
  ],
});
onMounted(() => { //async
  //const Plyr = await import("plyr");
  //const newPlyr = new Plyr.default('#player', {});
});
</script>

<style scoped></style>
