import { defineSitemapEventHandler } from '#imports'
import * as getRoutes from '../../../app/utils/getRoutes'
import dayjs from 'dayjs'

export default defineSitemapEventHandler(async () => {
  // Generate all routes using existing logic
  getRoutes.functions.generateRoutes()
  
  const urls: any[] = []
  
  // Add individual blog post URLs
  const blogMetadata = getRoutes.properties.nuxtGenerateRoutes.filter((route: any) => 
    route.route.includes('/blog/') && 
    route.route.match(/\/\d{4}\/\d{2}\/\d{2}\//) && // Match YYYY/MM/DD pattern
    route.payload.title // Ensure it has post metadata
  )
  
  blogMetadata.forEach((routeData: any) => {
    const postMetadata = routeData.payload
    urls.push({
      loc: routeData.route,
      lastmod: dayjs(postMetadata['last-updated-on']).toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    })
  })
  
  // Add tag pages
  getRoutes.properties.tags.forEach((tag: any) => {
    urls.push({
      loc: `/blog/tag/${tag.slug}/`,
      changefreq: 'weekly',
      priority: 0.6
    })
  })
  
  // Add category pages
  getRoutes.properties.categories.forEach((category: any) => {
    urls.push({
      loc: `/blog/category/${category.slug}/`,
      changefreq: 'weekly', 
      priority: 0.6
    })
  })
  
  // Add author pages
  getRoutes.properties.authors.forEach((author: any) => {
    urls.push({
      loc: `/blog/author/${author.slug}/`,
      changefreq: 'monthly',
      priority: 0.5
    })
  })
  
  // Add post format pages
  const postFormats = getRoutes.properties.nuxtGenerateRoutes.filter((route: any) =>
    route.route.includes('/blog/post-format/')
  )
  
  postFormats.forEach((routeData: any) => {
    urls.push({
      loc: routeData.route,
      changefreq: 'monthly',
      priority: 0.5
    })
  })
  
  // Add archive pages (year/month/day)
  const archiveRoutes = getRoutes.properties.nuxtGenerateRoutes.filter((route: any) => 
    route.route.match(/\/blog\/\d{4}(\/\d{2})?(\/\d{2})?\/$/)) // Match /blog/YYYY/, /blog/YYYY/MM/, /blog/YYYY/MM/DD/
  
  archiveRoutes.forEach((routeData: any) => {
    const segments = routeData.route.split('/').filter(Boolean)
    let priority = 0.4
    
    // Adjust priority based on archive granularity
    if (segments.length === 2) priority = 0.6 // Year only
    else if (segments.length === 3) priority = 0.5 // Year/Month
    else priority = 0.4 // Year/Month/Day
    
    urls.push({
      loc: routeData.route,
      changefreq: 'monthly',
      priority
    })
  })
  
  return urls
})