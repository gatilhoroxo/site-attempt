// Test data for E2E tests

export const testUrls = {
  homepage: 'site-attempt/',
  gatilhos: 'site-attempt/content/gatilhos/',
  posts: 'site-attempt/content/posts/',
  projects: 'site-attempt/content/projects/',
  docs: 'site-attempt/docs/',
  mcJourney: 'site-attempt/content/projects/mc-journey/',
  conceptsPage: 'site-attempt/content/gatilhos/conceitos-fundamentais/',
  diaryPage: 'site-attempt/content/gatilhos/diario-de-aprendizado/'
};

export const searchQueries = {
  valid: [
    'conceitos',
    'aprendizado',
    'gpio',
    'diário',
    'projetos'
  ],
  invalid: [
    'randomStringThatShouldNotExist123',
    '!!!@@@###',
    ''
  ]
};

export const navigationStates = {
  nav: 'nav',
  search: 'search',
  repos: 'repos'
};

export const testContent = {
  searchResults: {
    minExpected: 1,
    maxExpected: 50
  },
  fontSizes: {
    min: 14,
    max: 20,
    default: 16
  }
};

export const selectors = {
  sidebar: '[data-sidebar]',  
  sidebarToggle: '[data-sidebar-toggle]',
  sidebarNav: '[data-nav-state]',
  sidebarSearch: '[data-search-state]',
  sidebarRepos: '[data-repos-state]',
  searchInput: '[data-search-input]',
  searchResults: '[data-search-results]',
  themeToggle: '[data-theme-toggle]',
  fontSizeIncrease: '[data-font-increase]',
  fontSizeDecrease: '[data-font-decrease]',
  breadcrumb: '[data-breadcrumb]',
  breadcrumbItems: '[data-breadcrumb-item]'
};