import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {version} = require('../package.json') as {version: string};

const config: Config = {
  title: '@k9n/eslint-plugin-prefer-implicit',
  tagline: 'If the browser already knows it, don\'t repeat it.',
  favicon: 'img/logo.svg',

  future: {
    v4: true,
  },

  url: 'https://k9n-dev.github.io',
  baseUrl: '/eslint-plugin-prefer-implicit/',

  organizationName: 'k9n-dev',
  projectName: 'eslint-plugin-prefer-implicit',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl:
            'https://github.com/k9n-dev/eslint-plugin-prefer-implicit/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '@k9n/eslint-plugin-prefer-implicit',
      logo: {
        alt: '@k9n/eslint-plugin-prefer-implicit logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'rulesSidebar',
          position: 'left',
          label: 'Rules',
        },
        {
          type: 'dropdown',
          label: `v${version}`,
          position: 'right',
          items: [
            {
              label: 'Release Notes',
              href: 'https://github.com/k9n-dev/eslint-plugin-prefer-implicit/releases',
            },
            {
              label: 'Contributing',
              href: 'https://github.com/k9n-dev/eslint-plugin-prefer-implicit/blob/main/CONTRIBUTING.md',
            },
          ],
        },
        {
          href: 'https://github.com/k9n-dev/eslint-plugin-prefer-implicit',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guide',
          items: [
            {label: 'Getting Started', to: '/getting-started'},
            {label: 'Configuration', to: '/configuration'},
            {label: 'Framework Support', to: '/framework-support'},
          ],
        },
        {
          title: 'Rules',
          items: [
            {label: 'no-redundant-role', to: '/rules/no-redundant-role'},
            {label: 'no-destructive-role', to: '/rules/no-destructive-role'},
            {label: 'no-conflicting-aria', to: '/rules/no-conflicting-aria'},
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Release Notes',
              href: 'https://github.com/k9n-dev/eslint-plugin-prefer-implicit/releases',
            },
            {
              label: 'Contributing',
              href: 'https://github.com/k9n-dev/eslint-plugin-prefer-implicit/blob/main/CONTRIBUTING.md',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/k9n-dev/eslint-plugin-prefer-implicit',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@k9n/eslint-plugin-prefer-implicit',
            },
          ],
        },
      ],
      copyright: `Released under the MIT License. Copyright © ${new Date().getFullYear()} @k9n/eslint-plugin-prefer-implicit.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
