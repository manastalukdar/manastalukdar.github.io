import { groupBy } from 'lodash-es'
import blogMetadata from '../../public/blogdata/metadata/blog_metadata.json'
import dayjs from 'dayjs'

export const properties = {
  sitemapRoutes: <any>[],
  nuxtGenerateRoutes: <any>[],
  feedItems: <any>[],
  tags: <any>[],
  categories: <any>[],
  authors: <any>[],
  postFormats: <any>[],
  baseUrl: '',
}

export const functions = {
  initializeProperties() {
    properties.sitemapRoutes = []
    properties.nuxtGenerateRoutes = []
    properties.feedItems = []
    properties.tags = []
    properties.categories = []
    properties.authors = []
    properties.postFormats = []
  },
  setBaseUrl(baseUrl: string) {
    properties.baseUrl = baseUrl
  },
  getBlogPostCount() {
    return blogMetadata.length
  },
  generateRoutes() {
    functions.initializeProperties()

    properties.nuxtGenerateRoutes.push({
      route: '/',
      payload: blogMetadata,
    })

    properties.nuxtGenerateRoutes.push({
      route: '/blog/',
      payload: blogMetadata,
    })

    blogMetadata.forEach((postmetadata) => {
      const dayjsObj = dayjs(postmetadata['first-published-on'])
      const route =
        '/blog/' +
        dayjsObj.format('YYYY-MM-DD').replace(/-/g, '/') +
        '/' +
        postmetadata['url-slug'] +
        '/'
      properties.nuxtGenerateRoutes.push({
        route,
        payload: postmetadata,
      })
      properties.sitemapRoutes.push(route)
      if (properties.feedItems.length < 10) {
        properties.feedItems.push(
          helperFunctions.getFeedItem(postmetadata, route)
        )
      }
    })

    const groupedByPostFormat = groupBy(blogMetadata, function (postmetadata) {
      return postmetadata['post-format']['url-slug']
    })
    for (const [key, value] of Object.entries(groupedByPostFormat)) {
      const route = '/blog/post-format/' + key + '/'
      const postFormatName = value[0]['post-format'].name
      properties.postFormats.push({
        name: postFormatName,
        slug: key,
        count: value.length,
      })
      properties.nuxtGenerateRoutes.push({
        route,
        payload: value,
      })
      properties.sitemapRoutes.push(route)
    }

    properties.nuxtGenerateRoutes.push({
      route: '/blog/post-formats/',
      payload: properties.postFormats,
    })

    // https://stackoverflow.com/questions/55450096/how-to-groupby-in-lodash-for-each-item-in-a-nested-array
    const groupedByAuthor = blogMetadata.reduce<any>(function (acc, curr) {
      curr.authors.forEach(function (item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    for (const [key, value] of Object.entries<any>(groupedByAuthor)) {
      const route = '/blog/author/' + key + '/'
      const authorName = value[0].authors.filter((author: { [x: string]: string; name: any }) => {
        if (author['url-slug'] === key) {
          return author.name
        } else {
          return ''
        }
      })
      properties.authors.push({
        name: authorName[0].name,
        slug: key,
        count: value.length,
      })
      properties.nuxtGenerateRoutes.push({
        route,
        payload: value,
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByTag = blogMetadata.reduce<any>(function (acc, curr) {
      curr.tags.forEach(function (item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    for (const [key, value] of Object.entries<any>(groupedByTag)) {
      const route = '/blog/tag/' + key + '/'
      const tagName = value[0].tags.filter((tag: { [x: string]: string; name: any }) => {
        if (tag['url-slug'] === key) {
          return tag.name
        } else {
          return ''
        }
      })
      properties.tags.push({
        name: tagName[0].name,
        slug: key,
        count: value.length,
      })
      properties.nuxtGenerateRoutes.push({
        route,
        payload: value,
      })
      properties.sitemapRoutes.push(route)
    }

    properties.nuxtGenerateRoutes.push({
      route: '/blog/tags/',
      payload: properties.tags,
    })

    const groupedByCategories = blogMetadata.reduce<any>(function (acc, curr) {
      curr.categories.forEach(function (item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    for (const [key, value] of Object.entries<any>(groupedByCategories)) {
      const route = '/blog/category/' + key + '/'
      const catName = value[0].categories.filter((category: { [x: string]: string; name: any }) => {
        if (category['url-slug'] === key) {
          return category.name
        } else {
          return ''
        }
      })
      properties.categories.push({
        name: catName[0].name,
        slug: key,
        count: value.length,
      })
      properties.nuxtGenerateRoutes.push({
        route,
        payload: value,
      })
      properties.sitemapRoutes.push(route)
    }

    properties.nuxtGenerateRoutes.push({
      route: '/blog/categories/',
      payload: properties.categories,
    })

    const groupedByYear = blogMetadata.reduce<any>(function (acc, curr) {
      const dayjsObj = dayjs(curr['first-published-on'])
      const year = dayjsObj.format('YYYY')
      if (acc[year]) {
        acc[year].push(curr)
      } else {
        acc[year] = [curr]
      }
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByYear)) {
      const route = '/blog/' + key + '/'
      properties.nuxtGenerateRoutes.push({
        route,
        payload: value,
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByMonth = blogMetadata.reduce<any>(function (acc, curr) {
      const dayjsObj = dayjs(curr['first-published-on'])
      const year = dayjsObj.format('YYYY')
      const month = dayjsObj.format('MM')
      const key = year + '-' + month
      if (acc[key]) {
        acc[key].push(curr)
      } else {
        acc[key] = [curr]
      }
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByMonth)) {
      const year = key.split('-')[0]
      const month = key.split('-')[1]
      const route = '/blog/' + year + '/' + month + '/'
      properties.nuxtGenerateRoutes.push({
        route,
        payload: value,
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByDay = blogMetadata.reduce<any>(function (acc, curr) {
      const dayjsObj = dayjs(curr['first-published-on'])
      const year = dayjsObj.format('YYYY')
      const month = dayjsObj.format('MM')
      const day = dayjsObj.format('DD')
      const key = year + '-' + month + '-' + day
      if (acc[key]) {
        acc[key].push(curr)
      } else {
        acc[key] = [curr]
      }
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByDay)) {
      const year = key.split('-')[0]
      const month = key.split('-')[1]
      const day = key.split('-')[2]
      const route = '/blog/' + year + '/' + month + '/' + day + '/'
      properties.nuxtGenerateRoutes.push({
        route,
        payload: value,
      })
      properties.sitemapRoutes.push(route)
    }
  },
}

export const helperFunctions = {
  getFeedItem(postMetadata: any, route: any) {
    const authorsTemp: { name: any }[] = []
    postMetadata.authors.forEach(function (author: any) {
      authorsTemp.push({
        name: author.name,
      })
    })
    const item = {
      title: postMetadata.title,
      id: route,
      link: properties.baseUrl + route,
      description: postMetadata.meta.description,
      content: postMetadata.excerpt + ' ...read more',
      date: new Date(postMetadata['first-published-on']),
      dateupdated: new Date(postMetadata['last-updated-on']),
      author: authorsTemp,
    }

    return item
  },
}
