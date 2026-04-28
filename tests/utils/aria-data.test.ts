import { describe, it, expect } from "vitest";
import {
  IMPLICIT_ROLE_MAP,
  ROLE_ARIA_LIVE_MAP,
  SUPPORTED_ARIA_BY_ROLE,
  DEFAULT_ARIA_VALUES,
  INTERACTIVE_ELEMENTS,
  STRUCTURAL_ELEMENTS,
  DESTRUCTIVE_ROLES,
  VALID_ARIA_ROLES,
  ABSTRACT_ROLES,
  IMPLICIT_ARIA_VALUES,
} from "../../src/utils/aria-data.js";
import type { ImplicitRoleEntry } from "../../src/utils/aria-data.js";

// ---------------------------------------------------------------------------
// IMPLICIT_ROLE_MAP
// ---------------------------------------------------------------------------

describe("IMPLICIT_ROLE_MAP", () => {
  it("is non-empty", () => {
    expect(Object.keys(IMPLICIT_ROLE_MAP).length).toBeGreaterThan(0);
  });

  it("contains expected element-to-role mappings", () => {
    const expectedEntries: [string, string][] = [
      ["button", "button"],
      ["nav", "navigation"],
      ["ul", "list"],
      ["ol", "list"],
      ["li", "listitem"],
      ["table", "table"],
      ["a", "link"],
      ["img", "img"],
      ["form", "form"],
      ["main", "main"],
      ["header", "banner"],
      ["footer", "contentinfo"],
      ["aside", "complementary"],
      ["article", "article"],
      ["dialog", "dialog"],
      ["textarea", "textbox"],
      ["input", "textbox"],
      ["select", "combobox"],
      ["progress", "progressbar"],
      ["h1", "heading"],
      ["h2", "heading"],
      ["h3", "heading"],
      ["h4", "heading"],
      ["h5", "heading"],
      ["h6", "heading"],
      ["hr", "separator"],
      ["td", "cell"],
      ["th", "columnheader"],
      ["tr", "row"],
      ["tbody", "rowgroup"],
      ["thead", "rowgroup"],
      ["tfoot", "rowgroup"],
      ["summary", "button"],
      ["option", "option"],
      ["output", "status"],
      ["menu", "list"],
      ["datalist", "listbox"],
      ["details", "group"],
      ["fieldset", "group"],
      ["optgroup", "group"],
    ];

    for (const [element, role] of expectedEntries) {
      expect(IMPLICIT_ROLE_MAP[element]).toBeDefined();
      expect(IMPLICIT_ROLE_MAP[element].role).toBe(role);
    }
  });

  it("has a conditional entry for <a> requiring href", () => {
    const entry = IMPLICIT_ROLE_MAP["a"];
    expect(entry.condition).toBeDefined();
    expect(entry.condition!.attribute).toBe("href");
  });

  it("does not have conditions on unconditional elements", () => {
    const unconditional = ["button", "nav", "ul", "table", "img", "main"];
    for (const element of unconditional) {
      expect(IMPLICIT_ROLE_MAP[element].condition).toBeUndefined();
    }
  });

  it("every entry has a non-empty role string", () => {
    for (const [element, entry] of Object.entries(IMPLICIT_ROLE_MAP)) {
      expect(entry.role).toBeTruthy();
      expect(typeof entry.role).toBe("string");
    }
  });
});

// ---------------------------------------------------------------------------
// ROLE_ARIA_LIVE_MAP
// ---------------------------------------------------------------------------

describe("ROLE_ARIA_LIVE_MAP", () => {
  it("is non-empty", () => {
    expect(Object.keys(ROLE_ARIA_LIVE_MAP).length).toBeGreaterThan(0);
  });

  it("contains expected role-to-live mappings", () => {
    expect(ROLE_ARIA_LIVE_MAP["alert"]).toBe("assertive");
    expect(ROLE_ARIA_LIVE_MAP["status"]).toBe("polite");
    expect(ROLE_ARIA_LIVE_MAP["log"]).toBe("polite");
    expect(ROLE_ARIA_LIVE_MAP["marquee"]).toBe("off");
    expect(ROLE_ARIA_LIVE_MAP["timer"]).toBe("off");
  });

  it("contains exactly 5 entries", () => {
    expect(Object.keys(ROLE_ARIA_LIVE_MAP)).toHaveLength(5);
  });
});

// ---------------------------------------------------------------------------
// SUPPORTED_ARIA_BY_ROLE
// ---------------------------------------------------------------------------

describe("SUPPORTED_ARIA_BY_ROLE", () => {
  it("is non-empty", () => {
    expect(Object.keys(SUPPORTED_ARIA_BY_ROLE).length).toBeGreaterThan(0);
  });

  it("contains expected roles", () => {
    const expectedRoles = [
      "button", "link", "img", "generic", "list", "listitem",
      "table", "row", "cell", "columnheader", "heading",
      "navigation", "complementary", "banner", "contentinfo",
      "main", "form", "article", "dialog", "group",
      "none", "presentation", "textbox", "combobox", "checkbox",
    ];
    for (const role of expectedRoles) {
      expect(SUPPORTED_ARIA_BY_ROLE[role]).toBeDefined();
    }
  });

  it("includes global ARIA attributes for standard roles", () => {
    const globalAttrs = [
      "aria-label", "aria-labelledby", "aria-describedby",
      "aria-hidden", "aria-disabled", "aria-live",
    ];
    // button role should include all global attrs
    for (const attr of globalAttrs) {
      expect(SUPPORTED_ARIA_BY_ROLE["button"].has(attr)).toBe(true);
    }
  });

  it("includes role-specific attributes for button", () => {
    expect(SUPPORTED_ARIA_BY_ROLE["button"].has("aria-expanded")).toBe(true);
    expect(SUPPORTED_ARIA_BY_ROLE["button"].has("aria-pressed")).toBe(true);
  });

  it("does not include widget attributes for img role", () => {
    expect(SUPPORTED_ARIA_BY_ROLE["img"].has("aria-checked")).toBe(false);
    expect(SUPPORTED_ARIA_BY_ROLE["img"].has("aria-expanded")).toBe(false);
    expect(SUPPORTED_ARIA_BY_ROLE["img"].has("aria-pressed")).toBe(false);
  });

  it("none and presentation roles have empty supported sets", () => {
    expect(SUPPORTED_ARIA_BY_ROLE["none"].size).toBe(0);
    expect(SUPPORTED_ARIA_BY_ROLE["presentation"].size).toBe(0);
  });

  it("every role maps to a Set instance", () => {
    for (const [role, attrs] of Object.entries(SUPPORTED_ARIA_BY_ROLE)) {
      expect(attrs).toBeInstanceOf(Set);
    }
  });
});

// ---------------------------------------------------------------------------
// DEFAULT_ARIA_VALUES
// ---------------------------------------------------------------------------

describe("DEFAULT_ARIA_VALUES", () => {
  it("is non-empty", () => {
    expect(Object.keys(DEFAULT_ARIA_VALUES).length).toBeGreaterThan(0);
  });

  it("contains expected default values", () => {
    expect(DEFAULT_ARIA_VALUES["aria-hidden"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-required"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-expanded"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-pressed"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-disabled"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-checked"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-selected"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-grabbed"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-atomic"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-busy"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-modal"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-multiline"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-multiselectable"]).toBe("false");
    expect(DEFAULT_ARIA_VALUES["aria-readonly"]).toBe("false");
  });

  it("all keys start with aria-", () => {
    for (const key of Object.keys(DEFAULT_ARIA_VALUES)) {
      expect(key.startsWith("aria-")).toBe(true);
    }
  });

  it("all default values are the string 'false'", () => {
    for (const value of Object.values(DEFAULT_ARIA_VALUES)) {
      expect(value).toBe("false");
    }
  });
});

// ---------------------------------------------------------------------------
// INTERACTIVE_ELEMENTS
// ---------------------------------------------------------------------------

describe("INTERACTIVE_ELEMENTS", () => {
  it("is non-empty", () => {
    expect(INTERACTIVE_ELEMENTS.size).toBeGreaterThan(0);
  });

  it("contains expected interactive elements", () => {
    const expected = ["a", "button", "input", "select", "textarea", "details", "summary", "embed", "iframe"];
    for (const el of expected) {
      expect(INTERACTIVE_ELEMENTS.has(el)).toBe(true);
    }
  });

  it("does not contain non-interactive elements", () => {
    const nonInteractive = ["div", "span", "p", "ul", "table", "h1"];
    for (const el of nonInteractive) {
      expect(INTERACTIVE_ELEMENTS.has(el)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// STRUCTURAL_ELEMENTS
// ---------------------------------------------------------------------------

describe("STRUCTURAL_ELEMENTS", () => {
  it("is non-empty", () => {
    expect(STRUCTURAL_ELEMENTS.size).toBeGreaterThan(0);
  });

  it("contains expected structural elements", () => {
    const expected = [
      "ul", "ol", "li", "table", "thead", "tbody", "tfoot",
      "tr", "td", "th", "dl", "dt", "dd", "menu",
    ];
    for (const el of expected) {
      expect(STRUCTURAL_ELEMENTS.has(el)).toBe(true);
    }
  });

  it("does not contain interactive or generic elements", () => {
    const nonStructural = ["button", "input", "div", "span", "a"];
    for (const el of nonStructural) {
      expect(STRUCTURAL_ELEMENTS.has(el)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// DESTRUCTIVE_ROLES
// ---------------------------------------------------------------------------

describe("DESTRUCTIVE_ROLES", () => {
  it("is non-empty", () => {
    expect(DESTRUCTIVE_ROLES.size).toBeGreaterThan(0);
  });

  it("contains 'none' and 'presentation'", () => {
    expect(DESTRUCTIVE_ROLES.has("none")).toBe(true);
    expect(DESTRUCTIVE_ROLES.has("presentation")).toBe(true);
  });

  it("contains exactly 2 entries", () => {
    expect(DESTRUCTIVE_ROLES.size).toBe(2);
  });

  it("does not contain non-destructive roles", () => {
    expect(DESTRUCTIVE_ROLES.has("button")).toBe(false);
    expect(DESTRUCTIVE_ROLES.has("link")).toBe(false);
    expect(DESTRUCTIVE_ROLES.has("generic")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// VALID_ARIA_ROLES
// ---------------------------------------------------------------------------

describe("VALID_ARIA_ROLES", () => {
  it("is non-empty", () => {
    expect(VALID_ARIA_ROLES.size).toBeGreaterThan(0);
  });

  it("contains expected concrete roles", () => {
    for (const role of ["button", "link", "alert", "dialog", "navigation", "heading", "list", "table", "form", "region"]) {
      expect(VALID_ARIA_ROLES.has(role)).toBe(true);
    }
  });

  it("contains all abstract roles", () => {
    for (const role of ABSTRACT_ROLES) {
      expect(VALID_ARIA_ROLES.has(role)).toBe(true);
    }
  });

  it("does not contain gibberish strings", () => {
    expect(VALID_ARIA_ROLES.has("superwidget")).toBe(false);
    expect(VALID_ARIA_ROLES.has("foo")).toBe(false);
    expect(VALID_ARIA_ROLES.has("")).toBe(false);
  });

  it("all entries are lowercase strings", () => {
    for (const role of VALID_ARIA_ROLES) {
      expect(role).toBe(role.toLowerCase());
      expect(typeof role).toBe("string");
    }
  });
});

// ---------------------------------------------------------------------------
// ABSTRACT_ROLES
// ---------------------------------------------------------------------------

describe("ABSTRACT_ROLES", () => {
  it("contains exactly 12 entries", () => {
    expect(ABSTRACT_ROLES.size).toBe(12);
  });

  it("contains all expected abstract roles", () => {
    const expected = ["command", "composite", "input", "landmark", "range", "roletype", "section", "sectionhead", "select", "structure", "widget", "window"];
    for (const role of expected) {
      expect(ABSTRACT_ROLES.has(role)).toBe(true);
    }
  });

  it("every entry is also present in VALID_ARIA_ROLES", () => {
    for (const role of ABSTRACT_ROLES) {
      expect(VALID_ARIA_ROLES.has(role)).toBe(true);
    }
  });

  it("does not contain concrete roles", () => {
    expect(ABSTRACT_ROLES.has("button")).toBe(false);
    expect(ABSTRACT_ROLES.has("link")).toBe(false);
    expect(ABSTRACT_ROLES.has("alert")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// IMPLICIT_ARIA_VALUES
// ---------------------------------------------------------------------------

describe("IMPLICIT_ARIA_VALUES", () => {
  it("is non-empty", () => {
    expect(Object.keys(IMPLICIT_ARIA_VALUES).length).toBeGreaterThan(0);
  });

  it("h1 maps to aria-level 1", () => {
    expect(IMPLICIT_ARIA_VALUES["h1"]).toEqual({ "aria-level": "1" });
  });

  it("h6 maps to aria-level 6", () => {
    expect(IMPLICIT_ARIA_VALUES["h6"]).toEqual({ "aria-level": "6" });
  });

  it("progress maps to aria-valuemin 0 and aria-valuemax 100", () => {
    expect(IMPLICIT_ARIA_VALUES["progress"]).toEqual({ "aria-valuemin": "0", "aria-valuemax": "100" });
  });

  it("hr maps to aria-orientation horizontal", () => {
    expect(IMPLICIT_ARIA_VALUES["hr"]).toEqual({ "aria-orientation": "horizontal" });
  });

  it("all attribute names start with aria-", () => {
    for (const element of Object.keys(IMPLICIT_ARIA_VALUES)) {
      for (const attr of Object.keys(IMPLICIT_ARIA_VALUES[element])) {
        expect(attr.startsWith("aria-")).toBe(true);
      }
    }
  });
});
