// Tree-shakable MDI icons - only imports the icons we actually use
// This approach dramatically reduces bundle size vs loading all 7000+ icons

import {
  // Most used icons (20+ references)
  mdiPrinter,
  
  // Common icons (10+ references)
  mdiMagnify,
  
  // Frequent icons (5+ references)
  mdiCheckCircle,
  mdiChevronRight,
  mdiBookmark,
  mdiChevronLeft,
  
  // Moderate usage icons (3-4 references)
  mdiNewspaper,
  mdiMenuDown,
  mdiFileDocumentOutline,
  mdiFileDocument,
  mdiCog,
  mdiAccountGroup,
  mdiLinkedin,
  
  // Regular usage icons (2 references)
  mdiThemeLightDark,
  mdiTextSearch,
  mdiText,
  mdiTagOutline,
  mdiSpeedometer,
  mdiPin,
  
  // Additional common navigation/UI icons
  mdiMenu,
  mdiClose,
  mdiHome,
  mdiInformation,
  mdiBriefcaseOutline,
  mdiDomain,
  mdiTagMultiple,
  mdiFormatListBulletedType,
  mdiArchive,
  mdiSealVariant,
  mdiAccountTie,
  mdiScaleBalance,
  mdiBookEdit,
  mdiHumanMaleBoard,
  mdiMicrophoneVariant,
  mdiBookOpenVariant,
  mdiScriptText,
  mdiListBox,
  
  // Navigation drawer specific icons
  mdiGavel,
  mdiMail,
  
  // Menu navigation icons
  mdiMenuLeft,
  mdiMenuRight,
  
  // About section icons
  mdiSchool,
  mdiHandshake,
  mdiDeskLamp,
  mdiThumbUp,
  mdiMedal,
  mdiAccountHeart,
  mdiToolboxOutline,
  
  // Contact icons
  mdiEmailBox,
  mdiAlphaX,
  
  // Social/external icons
  mdiGithub,
  mdiTwitter,
  mdiEmail,
  mdiWeb,
  
  // Content icons
  mdiCalendar,
  mdiClock,
  mdiEye,
  mdiShare,
  mdiHeart,
  mdiComment,
  mdiCommentSearch,
  mdiDownload,
  mdiOpenInNew,
  
  // Blog component icons
  mdiBookmarkOutline,
  mdiChevronDown,
  mdiChevronUp,
  mdiFormatListBulleted,
  mdiArrowRight,
  mdiMinus,
  mdiViewList,
  mdiBookOpenPageVariant,
  mdiFacebook,
  
  // Search component icons
  mdiFilterVariant,
  mdiFolderOutline,
  mdiCalendarRange,
  mdiCogOutline,
  mdiFileSearch,
  mdiMagnifyClose,
  mdiClockOutline,
  mdiInformationOutline,
  mdiNumeric,
  
  // Legal page icons
  mdiCopyright,
  mdiCreativeCommons,
  mdiRobot,
  
  // Post format icons
  mdiNoteText,
  mdiImageMultiple,
  mdiLinkVariant,
  mdiImage,
  mdiFormatQuoteOpen,
  mdiMessage,
  mdiVideo,
  mdiVolumeHigh,
  
  // Missing icons
  mdiBrain,
  mdiFilter,
  mdiLightbulb,
  
} from '@mdi/js'

// Icon mapping object for easy access
export const iconMap = {
  // Most used
  'printer': mdiPrinter,
  'magnify': mdiMagnify,
  
  // Common UI
  'check-circle': mdiCheckCircle,
  'chevron-right': mdiChevronRight,
  'chevron-left': mdiChevronLeft,
  'bookmark': mdiBookmark,
  'menu-down': mdiMenuDown,
  'menu': mdiMenu,
  'close': mdiClose,
  'cog': mdiCog,
  
  // Navigation
  'home': mdiHome,
  'information': mdiInformation,
  'newspaper': mdiNewspaper,
  'briefcase-outline': mdiBriefcaseOutline,
  'domain': mdiDomain,
  'tag-multiple': mdiTagMultiple,
  'format-list-bulleted-type': mdiFormatListBulletedType,
  'archive': mdiArchive,
  'book-open-variant': mdiBookOpenVariant,
  
  // Professional
  'account-group': mdiAccountGroup,
  'seal-variant': mdiSealVariant,
  'account-tie': mdiAccountTie,
  'scale-balance': mdiScaleBalance,
  'book-edit': mdiBookEdit,
  'human-male-board': mdiHumanMaleBoard,
  'microphone-variant': mdiMicrophoneVariant,
  
  // Documents
  'file-document': mdiFileDocument,
  'file-document-outline': mdiFileDocumentOutline,
  'text': mdiText,
  'script-text': mdiScriptText,
  'list-box': mdiListBox,
  
  // Social
  'linkedin': mdiLinkedin,
  'github': mdiGithub,
  'twitter': mdiTwitter,
  'email': mdiEmail,
  'web': mdiWeb,
  
  // Content/Blog
  'calendar': mdiCalendar,
  'clock': mdiClock,
  'eye': mdiEye,
  'share': mdiShare,
  'heart': mdiHeart,
  'comment': mdiComment,
  'comment-search': mdiCommentSearch,
  'download': mdiDownload,
  'open-in-new': mdiOpenInNew,
  'tag-outline': mdiTagOutline,
  
  // Legal & Contact
  'gavel': mdiGavel,
  'mail': mdiMail,
  'email-box': mdiEmailBox,
  
  // Menu navigation
  'menu-left': mdiMenuLeft,
  'menu-right': mdiMenuRight,
  
  // About section
  'school': mdiSchool,
  'handshake': mdiHandshake,
  'desk-lamp': mdiDeskLamp,
  'thumb-up': mdiThumbUp,
  'medal': mdiMedal,
  'account-heart': mdiAccountHeart,
  'toolbox-outline': mdiToolboxOutline,
  
  // Social platforms
  'alpha-x': mdiAlphaX,
  
  // Utility
  'theme-light-dark': mdiThemeLightDark,
  'text-search': mdiTextSearch,
  'speedometer': mdiSpeedometer,
  'pin': mdiPin,
  
  // Blog components
  'bookmark-outline': mdiBookmarkOutline,
  'chevron-down': mdiChevronDown,
  'chevron-up': mdiChevronUp,
  'format-list-bulleted': mdiFormatListBulleted,
  'arrow-right': mdiArrowRight,
  'minus': mdiMinus,
  'view-list': mdiViewList,
  'book-open-page-variant': mdiBookOpenPageVariant,
  'facebook': mdiFacebook,
  
  // Search components
  'filter-variant': mdiFilterVariant,
  'folder-outline': mdiFolderOutline,
  'calendar-range': mdiCalendarRange,
  'cog-outline': mdiCogOutline,
  'file-search': mdiFileSearch,
  'magnify-close': mdiMagnifyClose,
  'clock-outline': mdiClockOutline,
  'information-outline': mdiInformationOutline,
  'numeric': mdiNumeric,
  
  // Legal page
  'copyright': mdiCopyright,
  'creative-commons': mdiCreativeCommons,
  'robot': mdiRobot,
  
  // Post format icons
  'note-text': mdiNoteText,
  'image-multiple': mdiImageMultiple,
  'link-variant': mdiLinkVariant,
  'image': mdiImage,
  'format-quote-open': mdiFormatQuoteOpen,
  'message': mdiMessage,
  'video': mdiVideo,
  'volume-high': mdiVolumeHigh,
  
  // Missing icons
  'brain': mdiBrain,
  'filter': mdiFilter,
  'lightbulb': mdiLightbulb,
} as const

// Helper function to get icon path by name
export function getIconPath(iconName: string | undefined): string | undefined {
  if (!iconName) return undefined
  const cleanName = iconName.replace('mdi-', '')
  return iconMap[cleanName as keyof typeof iconMap]
}

// Helper function to check if icon exists in our tree-shaken set
export function hasIcon(iconName: string | undefined): boolean {
  if (!iconName) return false
  const cleanName = iconName.replace('mdi-', '')
  return cleanName in iconMap
}

// Export all icons for direct import if needed
export {
  mdiPrinter,
  mdiMagnify,
  mdiCheckCircle,
  mdiChevronRight,
  mdiBookmark,
  mdiChevronLeft,
  mdiNewspaper,
  mdiMenuDown,
  mdiFileDocumentOutline,
  mdiFileDocument,
  mdiCog,
  mdiAccountGroup,
  mdiLinkedin,
  mdiThemeLightDark,
  mdiTextSearch,
  mdiText,
  mdiTagOutline,
  mdiSpeedometer,
  mdiPin,
  mdiMenu,
  mdiClose,
  mdiHome,
  mdiInformation,
  mdiBriefcaseOutline,
  mdiDomain,
  mdiTagMultiple,
  mdiFormatListBulletedType,
  mdiArchive,
  mdiSealVariant,
  mdiAccountTie,
  mdiScaleBalance,
  mdiBookEdit,
  mdiHumanMaleBoard,
  mdiMicrophoneVariant,
  mdiBookOpenVariant,
  mdiScriptText,
  mdiListBox,
  mdiGithub,
  mdiTwitter,
  mdiEmail,
  mdiWeb,
  mdiCalendar,
  mdiClock,
  mdiEye,
  mdiShare,
  mdiHeart,
  mdiComment,
  mdiDownload,
  mdiOpenInNew,
  mdiGavel,
  mdiMail,
  mdiMenuLeft,
  mdiMenuRight,
  mdiSchool,
  mdiHandshake,
  mdiDeskLamp,
  mdiThumbUp,
  mdiMedal,
  mdiAccountHeart,
  mdiToolboxOutline,
  mdiEmailBox,
  mdiAlphaX,
  
  // Blog component exports
  mdiBookmarkOutline,
  mdiChevronDown,
  mdiChevronUp,
  mdiFormatListBulleted,
  mdiArrowRight,
  mdiMinus,
  mdiViewList,
  mdiBookOpenPageVariant,
  mdiFacebook,
  
  // Search component exports
  mdiFilterVariant,
  mdiFolderOutline,
  mdiCalendarRange,
  mdiCogOutline,
  mdiFileSearch,
  mdiMagnifyClose,
  mdiClockOutline,
  mdiInformationOutline,
  mdiNumeric,
  
  // Legal page exports
  mdiCopyright,
  mdiCreativeCommons,
  mdiRobot,
  
  // Post format exports
  mdiNoteText,
  mdiImageMultiple,
  mdiLinkVariant,
  mdiImage,
  mdiFormatQuoteOpen,
  mdiMessage,
  mdiVideo,
  mdiVolumeHigh,
  
  // Missing icon exports
  mdiBrain,
  mdiFilter,
  mdiLightbulb,
}