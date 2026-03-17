const en = {
  app: {
    title: 'Trashy Workshop Downloader',
    subtitle: 'I made this random sh*t within hours, so don\'t blame me for this :(',
  },
  nav: {
    home: 'Home',
    about: 'About',
  },
  search: {
    placeholder: 'Enter Workshop URL or Mod ID',
    button: 'Open Depot',
    queue: 'Queue Download',
    hint: 'Supports Steam Workshop links or numeric IDs',
    searching: 'Searching...',
    submitted: 'Added to download queue',
    queueFailed: 'Failed to add to queue',
  },
  queueError: {
    alreadyDownloaded: 'Already downloaded within a day',
    tooManyQueued: 'Too many queued items, please try later',
  },
  versions: {
    title: 'Available Versions',
    empty: 'No versions available',
    loading: 'Loading...',
    notFound: 'Mod not found',
    version: 'Version',
    lastModified: 'Last Modified',
    selectVersion: 'Select a version to view files',
  },
  files: {
    title: 'Mod Files',
    titleResourcePack: 'Resource Pack',
    name: 'File Name',
    size: 'Size',
    lastModified: 'Last Modified',
    download: 'Download',
    back: 'Back to versions',
    backToParent: 'Back to parent folder',
    empty: 'No files in this version',
  },
  error: {
    network: 'Network error, please check your connection',
    notFound: 'The requested resource does not exist',
    server: 'Server error, please try again later',
    unknown: 'An unknown error occurred',
    invalidInput: 'Please enter a valid mod ID or link',
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  language: {
    zh: '中文',
    en: 'English',
  },
  storage: {
    title: 'Server Storage',
    free: 'Free',
    total: 'Total',
    used: 'Used',
    loading: 'Loading...',
    loadFailed: 'Failed to load storage info',
  },
  usage: {
    title: 'Usage',
    steps: [
      'Go to tModLoader Workshop (https://steamcommunity.com/app/1281930/workshop/)\nor Terraria Workshop (https://steamcommunity.com/app/105600/workshop/)',
      'Search for the mod / resource pack you want',
      'Click into the mod info page (where you can see the green "+ Subscribe" button)',
      'Copy the page link',
      'Come back to this page and paste the link into the textbox above',
      'Click "Open Depot"',
      'If it shows 404, click "Queue Download", wait 10-30s for the server to pull mods from Steam',
      'Then click "Open Depot" again',
      'You got the mod files! Yay!',
    ],
    tips: [
      'It would be better to check if the mod files have been downloaded by clicking "Open Depot" first, so less time will be wasted',
      'Only click "Queue Download" if you think the mod files have been updated',
      'Collection workshop items are not supported, please download them one by one',
    ],
  },
  footer: {
    disclaimer: 'This site provides Steam Workshop mod mirror downloads',
  },
}

export default en
