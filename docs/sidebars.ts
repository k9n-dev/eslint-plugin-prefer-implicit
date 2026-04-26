import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    'getting-started',
    'configuration',
    'framework-support',
    'detection-matrix',
  ],
  rulesSidebar: [
    'rules/no-redundant-role',
    'rules/no-destructive-role',
    'rules/no-conflicting-aria',
    'rules/no-unsupported-aria',
    'rules/no-default-aria',
    'rules/no-hidden-focusable',
  ],
};

export default sidebars;
