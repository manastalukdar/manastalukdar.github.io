<template>
  <v-col class="px-0 pt-5">
    <v-card color="cardColor" raised elevation="8" class="py-4">
      <div class="socialSharing" justify="center">
        <div class="socialSharingItems">
          <a :href="emailShare" target="_blank" rel="noopener noreferrer">
            <TreeShakenIcon icon="mdi-email" size="24" class="socialSharingItem" />
          </a>
          <a :href="linkedinShare" target="_blank" rel="noopener noreferrer">
            <TreeShakenIcon icon="mdi-linkedin" size="24" class="socialSharingItem" />
          </a>
          <a :href="twitterShare" target="_blank" rel="noopener noreferrer">
            <TreeShakenIcon icon="mdi-twitter" size="24" class="socialSharingItem" />
          </a>
          <a :href="facebookShare" target="_blank" rel="noopener noreferrer">
            <TreeShakenIcon icon="mdi-facebook" size="24" class="socialSharingItem" />
          </a>
        </div>
      </div>
      <div class="printButton col pt-2" justify="center">
        <TreeShakenIcon icon="mdi-printer" @click="print" style="cursor: pointer;" />
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed } from 'vue'
import { usePaperizer } from 'paperizer'
import TreeShakenIcon from '~/components/TreeShakenIcon.vue'

const props = defineProps({
  url: {
    type: String,
    required: true,
    default: '',
  },
  title: {
    type: String,
    required: true,
    default: '',
  },
  description: {
    type: String,
    required: true,
    default: '',
  },
  quote: {
    type: String,
    required: true,
    default: '',
  },
  hashtags: {
    type: String,
    required: true,
    default: '',
  },
});

const twitterUser = 'ManasTalukdar';

// Social sharing URLs
const emailShare = computed(() => {
  const subject = encodeURIComponent(props.title)
  const body = encodeURIComponent(`${props.description}\n\n${props.url}`)
  return `mailto:?subject=${subject}&body=${body}`
})

const linkedinShare = computed(() => {
  const url = encodeURIComponent(props.url)
  const title = encodeURIComponent(props.title)
  return `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`
})

const twitterShare = computed(() => {
  const url = encodeURIComponent(props.url)
  const text = encodeURIComponent(props.title)
  const hashtags = encodeURIComponent(props.hashtags)
  const via = encodeURIComponent(twitterUser)
  return `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}&via=${via}`
})

const facebookShare = computed(() => {
  const url = encodeURIComponent(props.url)
  const quote = encodeURIComponent(props.quote || props.title)
  const hashtag = props.hashtags ? encodeURIComponent(`#${props.hashtags.split(',')[0]}`) : ''
  return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}&hashtag=${hashtag}`
})

const { paperize } = usePaperizer('printMe', {
  styles: [
    '/styles/print-blog-post.css'
  ]
});

const print = () => {
  paperize()
};
</script>

<style>
.socialSharingItems {
  display: flex;
  justify-content: center;
}
.socialSharingItem {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
