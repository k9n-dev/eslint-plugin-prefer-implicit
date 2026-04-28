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
    'rules/no-invalid-role',
    'rules/no-redundant-aria',
    'rules/no-abstract-role',
    'rules/no-aria-on-non-semantic',
    'rules/no-positive-tabindex',
  ],
};

export default sidebars;
