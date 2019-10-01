/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const siteConfig = {
  title: 'Adviser',
  tagline: 'Quality task runner with a linter fashion',
  repoUrl: 'https://github.com/Jam3/adviser',
  url: 'https://jam3.github.io',
  baseUrl: '/adviser/',

  projectName: 'adviser',
  organizationName: 'Jam3',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'about', label: 'Docs' },
    { doc: 'api', label: 'API' },
    { page: 'help', label: 'Help' },
    { href: 'https://github.com/jam3/adviser', label: 'GitHub' },
    { blog: true, label: 'Blog' }
  ],

  /* path to images for header/footer */
  headerIcon: 'img/favicon.ico',
  footerIcon: 'img/favicon.ico',
  favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#20232a',
    secondaryColor: '#0068b4'
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Crafted with ❤️ by Jam3 in Canada. MIT license`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default'
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/social-logo.jpg',
  twitterImage: 'img/social-logo.jpg',

  scrollToTop: true,
  enableUpdateTime: true,
  enableUpdateBy: true
};

module.exports = siteConfig;
