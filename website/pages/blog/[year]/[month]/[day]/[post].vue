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
import axios from 'axios';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import markdownItTextualUml from 'markdown-it-textual-uml';
import mermaid from 'mermaid/dist/mermaid.esm.mjs';
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
const baseUrl= runtimeConfig.public.baseUrl;
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
import getTargetBlankLinkRender from '../../../../../utils/markdownRenderHelpers.ts';

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
          '<pre><div class="' +
          langClass +
          ' hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true })
            .value +
          '</div></pre>'
        )
        // return hljs.highlight(lang, str).value
        // eslint-disable-next-line no-empty
      } catch (__) {}
    }
    return (
      '<pre><div class="hljs">' + md.utils.escapeHtml(str) + '</div></pre>'
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
const fileContent = await axios
.get(baseUrl+ '/blogdata/' + postMetadata.path)
.catch(function (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // eslint-disable-next-line no-console
    console.log(error.response.data)
    // eslint-disable-next-line no-console
    console.log(error.response.status)
    // eslint-disable-next-line no-console
    console.log(error.response.headers)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // eslint-disable-next-line no-console
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    // eslint-disable-next-line no-console
    console.log('Error', error.message)
  }
  // eslint-disable-next-line no-console
  console.log(error.config)
});
const res = fm(fileContent.data);
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
postMetadata.categories.forEach((cat) => {
  categoriesArray.push(cat.name)
  keywordsArray.push(cat.name)
});
postMetadata.tags.forEach((tag) => {
  tagsArray.push(tag.name)
  keywordsArray.push(tag.name)
});
postMetadata.authors.forEach((author) => {
  authorsArray.push(author.name)
  keywordsArray.push(author.name)
  authorsStructuredData.push({
    '@type': 'Person',
    name: author.name,
  })
});
const keywords = keywordsArray.join();
const tags = tagsArray.join();
const category = categoriesArray[0];

const datePublished = postMetadata['first-published-on'];
const dateModified = postMetadata['last-updated-on'];
const headline = postMetadata.title;
const articleBody = postMetadata.excerpt + ' ...';
const structuredData = {
  '@context': 'http://schema.org',
  '@type': 'BlogPosting',
  datePublished,
  dateModified,
  headline,
  description,
  articleBody,
  genre: category,
  keywords,
  author: authorsStructuredData,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url,
  },
  publisher: {
    '@type': 'Organization',
    name: appOwner + ' - Personal Website',
    logo: {
      '@type': 'ImageObject',
      url: baseUrl+ '/images/android-chrome-512x512.png',
    },
  },
  image: baseUrl+ '/images/android-chrome-512x512.png',
};
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
const breadcrumbsStructuredDataArray = breadcrumbsData.map(
  (item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@id': baseUrl+ item.href,
      name: item.title,
    },
  })
);
const breadcrumbsStructuredData = {
  '@context': 'http://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbsStructuredDataArray,
};
// let mermaid = null
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
  // if (mermaid == null) {
  //   mermaid = require('mermaid')
  // }
  mermaid.initialize({
    startOnLoad: true,
    theme: 'forest',
  })
});
</script>

<style scoped></style>
