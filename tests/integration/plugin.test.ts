import { describe, it, expect } from "vitest";
import plugin from "../../src/index.js";

const EXPECTED_RULES = [
  "no-redundant-role",
  "no-destructive-role",
  "no-conflicting-aria",
  "no-unsupported-aria",
  "no-default-aria",
  "no-hidden-focusable",
] as const;

describe("plugin entry point", () => {
  // Req 2.1: default export has rules property
  it("exports an object with meta, rules, and configs properties", () => {
    expect(plugin).toBeDefined();
    expect(plugin).toHaveProperty("meta");
    expect(plugin).toHaveProperty("rules");
    expect(plugin).toHaveProperty("configs");
  });

  // Req 2.1: meta contains name and version
  it("meta contains name and version", () => {
    expect(plugin.meta).toBeDefined();
    expect(plugin.meta!.name).toBe("eslint-plugin-prefer-implicit");
    expect(plugin.meta!.version).toBe("0.1.0");
  });

  // Req 2.4: namespace is prefer-implicit
  it("uses the prefer-implicit namespace in meta name", () => {
    expect(plugin.meta!.name).toContain("prefer-implicit");
  });

  // Req 2.1: rules object contains all six rule names
  it("rules object contains all six rules", () => {
    expect(plugin.rules).toBeDefined();
    const ruleNames = Object.keys(plugin.rules!);
    for (const name of EXPECTED_RULES) {
      expect(ruleNames).toContain(name);
    }
    expect(ruleNames).toHaveLength(EXPECTED_RULES.length);
  });

  // Req 2.4: each rule is accessible under the prefer-implicit namespace
  it("each rule is a valid ESLint rule module with meta and create", () => {
    for (const name of EXPECTED_RULES) {
      const rule = plugin.rules![name];
      expect(rule, `rule ${name} should exist`).toBeDefined();
      expect(rule).toHaveProperty("meta");
      expect(rule).toHaveProperty("create");
      expect(typeof (rule as any).create).toBe("function");
    }
  });
});

describe("configs.recommended", () => {
  const recommended = plugin.configs!.recommended as any;

  it("exists on the plugin", () => {
    expect(recommended).toBeDefined();
  });

  // Req 2.2: recommended preset enables all six rules at warn severity
  it("enables all six rules at warn severity under prefer-implicit namespace", () => {
    expect(recommended.rules).toBeDefined();

    for (const name of EXPECTED_RULES) {
      const fullName = `prefer-implicit/${name}`;
      expect(recommended.rules).toHaveProperty(fullName);
      expect(recommended.rules[fullName]).toBe("warn");
    }

    // No extra rules beyond the six
    const ruleKeys = Object.keys(recommended.rules);
    expect(ruleKeys).toHaveLength(EXPECTED_RULES.length);
  });

  // Req 2.3: plugin is self-referenced in the recommended config
  it("self-references the plugin in the plugins property", () => {
    expect(recommended.plugins).toBeDefined();
    expect(recommended.plugins).toHaveProperty("prefer-implicit");
    expect(recommended.plugins["prefer-implicit"]).toBe(plugin);
  });
});
