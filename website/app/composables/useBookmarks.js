import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

export const useBookmarks = () => {
  const STORAGE_KEY = 'blogBookmarks'
  const bookmarks = ref([])
  const isLoaded = ref(false)

  // Load bookmarks from localStorage on initialization
  const loadBookmarks = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          // Validate and migrate data if needed
          if (Array.isArray(parsed)) {
            bookmarks.value = parsed.map(bookmark => ({
              'url-slug': bookmark['url-slug'],
              title: bookmark.title,
              'first-published-on': bookmark['first-published-on'],
              categories: bookmark.categories || [],
              tags: bookmark.tags || [],
              'post-format': bookmark['post-format'] || { name: 'Standard', 'url-slug': 'standard' },
              excerpt: bookmark.excerpt || '',
              'reading-time': bookmark['reading-time'] || { minutes: 1, text: '1 min read' },
              bookmarkedAt: bookmark.bookmarkedAt || new Date().toISOString(),
              // Store essential metadata for display
              authors: bookmark.authors || []
            }))
          }
        }
        isLoaded.value = true
      } catch (error) {
        console.warn('Failed to load bookmarks from localStorage:', error)
        bookmarks.value = []
        isLoaded.value = true
      }
    }
  }

  // Save bookmarks to localStorage
  const saveBookmarks = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
      } catch (error) {
        console.warn('Failed to save bookmarks to localStorage:', error)
      }
    }
  }

  // Watch for changes and save automatically
  watch(bookmarks, saveBookmarks, { deep: true })

  // Check if a post is bookmarked
  const isBookmarked = (postData) => {
    if (!postData || !postData['url-slug']) return false
    return bookmarks.value.some(bookmark => 
      bookmark['url-slug'] === postData['url-slug'] &&
      bookmark['first-published-on'] === postData['first-published-on']
    )
  }

  // Add a bookmark
  const addBookmark = (postData) => {
    if (!postData || !postData['url-slug']) {
      console.warn('Invalid post data for bookmark')
      return false
    }

    // Check if already bookmarked
    if (isBookmarked(postData)) {
      return false
    }

    const bookmark = {
      'url-slug': postData['url-slug'],
      title: postData.title,
      'first-published-on': postData['first-published-on'],
      categories: postData.categories || [],
      tags: postData.tags || [],
      'post-format': postData['post-format'] || { name: 'Standard', 'url-slug': 'standard' },
      excerpt: postData.excerpt || '',
      'reading-time': postData['reading-time'] || { minutes: 1, text: '1 min read' },
      authors: postData.authors || [],
      bookmarkedAt: new Date().toISOString()
    }

    bookmarks.value.unshift(bookmark) // Add to beginning for recent-first order
    return true
  }

  // Remove a bookmark
  const removeBookmark = (postData) => {
    if (!postData || !postData['url-slug']) return false

    const index = bookmarks.value.findIndex(bookmark => 
      bookmark['url-slug'] === postData['url-slug'] &&
      bookmark['first-published-on'] === postData['first-published-on']
    )

    if (index > -1) {
      bookmarks.value.splice(index, 1)
      return true
    }
    return false
  }

  // Toggle bookmark status
  const toggleBookmark = (postData) => {
    if (isBookmarked(postData)) {
      return removeBookmark(postData)
    } else {
      return addBookmark(postData)
    }
  }

  // Get all bookmarks
  const getBookmarks = () => {
    return bookmarks.value
  }

  // Clear all bookmarks
  const clearBookmarks = () => {
    bookmarks.value = []
  }

  // Get bookmarks count
  const bookmarkCount = computed(() => bookmarks.value.length)

  // Get recently bookmarked posts (last 5)
  const recentBookmarks = computed(() => {
    return bookmarks.value
      .sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt))
      .slice(0, 5)
  })

  // Search bookmarks
  const searchBookmarks = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return bookmarks.value
    }

    const term = searchTerm.toLowerCase()
    return bookmarks.value.filter(bookmark => 
      bookmark.title.toLowerCase().includes(term) ||
      bookmark.excerpt.toLowerCase().includes(term) ||
      bookmark.categories.some(cat => cat.name.toLowerCase().includes(term)) ||
      bookmark.tags.some(tag => tag.name.toLowerCase().includes(term))
    )
  }

  // Filter bookmarks by category
  const filterByCategory = (categorySlug) => {
    if (!categorySlug) return bookmarks.value
    return bookmarks.value.filter(bookmark => 
      bookmark.categories.some(cat => cat['url-slug'] === categorySlug)
    )
  }

  // Filter bookmarks by tag
  const filterByTag = (tagSlug) => {
    if (!tagSlug) return bookmarks.value
    return bookmarks.value.filter(bookmark => 
      bookmark.tags.some(tag => tag['url-slug'] === tagSlug)
    )
  }

  // Export bookmarks as JSON
  const exportBookmarks = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      count: bookmarks.value.length,
      bookmarks: bookmarks.value
    }
    return JSON.stringify(exportData, null, 2)
  }

  // Import bookmarks from JSON
  const importBookmarks = (jsonData, mergeMode = true) => {
    try {
      const importData = JSON.parse(jsonData)
      
      if (!importData.bookmarks || !Array.isArray(importData.bookmarks)) {
        throw new Error('Invalid bookmark data format')
      }

      if (mergeMode) {
        // Merge with existing bookmarks, avoiding duplicates
        const existingUrls = new Set(bookmarks.value.map(b => `${b['url-slug']}-${b['first-published-on']}`))
        const newBookmarks = importData.bookmarks.filter(bookmark => 
          !existingUrls.has(`${bookmark['url-slug']}-${bookmark['first-published-on']}`)
        )
        bookmarks.value = [...bookmarks.value, ...newBookmarks]
      } else {
        // Replace existing bookmarks
        bookmarks.value = importData.bookmarks
      }

      return {
        success: true,
        imported: importData.bookmarks.length,
        total: bookmarks.value.length
      }
    } catch (error) {
      console.error('Failed to import bookmarks:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get bookmark statistics
  const getBookmarkStats = () => {
    const categoryCount = {}
    const tagCount = {}
    const formatCount = {}

    bookmarks.value.forEach(bookmark => {
      // Count categories
      bookmark.categories.forEach(cat => {
        categoryCount[cat.name] = (categoryCount[cat.name] || 0) + 1
      })

      // Count tags
      bookmark.tags.forEach(tag => {
        tagCount[tag.name] = (tagCount[tag.name] || 0) + 1
      })

      // Count formats
      const format = bookmark['post-format']?.name || 'Standard'
      formatCount[format] = (formatCount[format] || 0) + 1
    })

    return {
      total: bookmarks.value.length,
      categories: Object.entries(categoryCount).map(([name, count]) => ({ name, count })),
      tags: Object.entries(tagCount).map(([name, count]) => ({ name, count })),
      formats: Object.entries(formatCount).map(([name, count]) => ({ name, count }))
    }
  }

  // Initialize bookmarks on first use
  if (!isLoaded.value) {
    loadBookmarks()
  }

  return {
    bookmarks: computed(() => bookmarks.value),
    bookmarkCount,
    recentBookmarks,
    isLoaded: computed(() => isLoaded.value),
    
    // Core functions
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    getBookmarks,
    clearBookmarks,
    
    // Search and filter
    searchBookmarks,
    filterByCategory,
    filterByTag,
    
    // Import/export
    exportBookmarks,
    importBookmarks,
    
    // Statistics
    getBookmarkStats,
    
    // Utility
    loadBookmarks,
    saveBookmarks
  }
}