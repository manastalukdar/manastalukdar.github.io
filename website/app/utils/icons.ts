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
  mdiDownload,
  mdiOpenInNew,
  
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
  'download': mdiDownload,
  'open-in-new': mdiOpenInNew,
  'tag-outline': mdiTagOutline,
  
  // Legal & Contact
  'gavel': mdiGavel,
  'mail': mdiMail,
  
  // Utility
  'theme-light-dark': mdiThemeLightDark,
  'text-search': mdiTextSearch,
  'speedometer': mdiSpeedometer,
  'pin': mdiPin,
} as const

// Helper function to get icon path by name
export function getIconPath(iconName: string): string | undefined {
  const cleanName = iconName.replace('mdi-', '')
  return iconMap[cleanName as keyof typeof iconMap]
}

// Helper function to check if icon exists in our tree-shaken set
export function hasIcon(iconName: string): boolean {
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
}