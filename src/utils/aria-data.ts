/**
 * Declarative lookup tables for ARIA/HTML semantics.
 *
 * Derived from the ARIA in HTML W3C Recommendation and WAI-ARIA 1.2 spec.
 * These tables power all six rules in the plugin.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * An entry in the implicit role map. When `condition` is present, the implicit
 * role only applies if the element has the specified attribute.
 */
export interface ImplicitRoleEntry {
  role: string;
  condition?: { attribute: string };
}

// ---------------------------------------------------------------------------
// 1. IMPLICIT_ROLE_MAP
// ---------------------------------------------------------------------------

/**
 * Maps HTML element names to their implicit ARIA role.
 * Conditional entries indicate the element must have a specific attribute
 * for the implicit role to apply (e.g. `<a>` requires `href`).
 */
export const IMPLICIT_ROLE_MAP: Record<string, ImplicitRoleEntry> = {
  a:        { role: "link",          condition: { attribute: "href" } },
  article:  { role: "article" },
  aside:    { role: "complementary" },
  button:   { role: "button" },
  datalist: { role: "listbox" },
  details:  { role: "group" },
  dialog:   { role: "dialog" },
  fieldset: { role: "group" },
  footer:   { role: "contentinfo" },
  form:     { role: "form" },
  h1:       { role: "heading" },
  h2:       { role: "heading" },
  h3:       { role: "heading" },
  h4:       { role: "heading" },
  h5:       { role: "heading" },
  h6:       { role: "heading" },
  header:   { role: "banner" },
  hr:       { role: "separator" },
  img:      { role: "img" },
  input:    { role: "textbox" },
  li:       { role: "listitem" },
  main:     { role: "main" },
  menu:     { role: "list" },
  nav:      { role: "navigation" },
  ol:       { role: "list" },
  optgroup: { role: "group" },
  option:   { role: "option" },
  output:   { role: "status" },
  progress: { role: "progressbar" },
  select:   { role: "combobox" },
  summary:  { role: "button" },
  table:    { role: "table" },
  tbody:    { role: "rowgroup" },
  td:       { role: "cell" },
  textarea: { role: "textbox" },
  tfoot:    { role: "rowgroup" },
  th:       { role: "columnheader" },
  thead:    { role: "rowgroup" },
  tr:       { role: "row" },
  ul:       { role: "list" },
};

// ---------------------------------------------------------------------------
// 2. ROLE_ARIA_LIVE_MAP
// ---------------------------------------------------------------------------

/**
 * Maps ARIA roles to their implied `aria-live` value.
 * Used by the no-conflicting-aria rule.
 */
export const ROLE_ARIA_LIVE_MAP: Record<string, string> = {
  alert:   "assertive",
  log:     "polite",
  marquee: "off",
  status:  "polite",
  timer:   "off",
};

// ---------------------------------------------------------------------------
// 3. SUPPORTED_ARIA_BY_ROLE
// ---------------------------------------------------------------------------

/** Global ARIA attributes supported by all roles. */
const GLOBAL_ARIA = new Set<string>([
  "aria-atomic",
  "aria-busy",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-live",
  "aria-owns",
  "aria-relevant",
  "aria-roledescription",
]);

/** Helper to create a role's supported set from global + extras. */
function withGlobal(...extras: string[]): Set<string> {
  return new Set([...GLOBAL_ARIA, ...extras]);
}

/**
 * Maps ARIA roles to the set of `aria-*` attributes they support.
 * Used by the no-unsupported-aria rule.
 */
export const SUPPORTED_ARIA_BY_ROLE: Record<string, Set<string>> = {
  // Widget roles
  button:        withGlobal("aria-expanded", "aria-pressed"),
  link:          withGlobal("aria-expanded"),
  checkbox:      withGlobal("aria-checked", "aria-expanded", "aria-readonly", "aria-required"),
  combobox:      withGlobal(
    "aria-activedescendant", "aria-autocomplete", "aria-expanded",
    "aria-required", "aria-readonly",
  ),
  textbox:       withGlobal(
    "aria-activedescendant", "aria-autocomplete", "aria-multiline",
    "aria-placeholder", "aria-readonly", "aria-required",
  ),
  listbox:       withGlobal(
    "aria-activedescendant", "aria-expanded", "aria-multiselectable",
    "aria-orientation", "aria-readonly", "aria-required",
  ),
  option:        withGlobal("aria-checked", "aria-posinset", "aria-selected", "aria-setsize"),

  // Structure roles
  img:           withGlobal(),
  generic:       withGlobal(),
  list:          withGlobal(),
  listitem:      withGlobal("aria-level", "aria-posinset", "aria-setsize"),
  table:         withGlobal("aria-colcount", "aria-rowcount"),
  row:           withGlobal(
    "aria-colindex", "aria-expanded", "aria-level", "aria-posinset",
    "aria-rowindex", "aria-selected", "aria-setsize",
  ),
  cell:          withGlobal("aria-colindex", "aria-colspan", "aria-rowindex", "aria-rowspan"),
  columnheader:  withGlobal(
    "aria-colindex", "aria-colspan", "aria-expanded", "aria-readonly",
    "aria-required", "aria-rowindex", "aria-rowspan", "aria-selected", "aria-sort",
  ),
  rowgroup:      withGlobal(),
  heading:       withGlobal("aria-expanded", "aria-level"),

  // Landmark roles
  navigation:    withGlobal(),
  complementary: withGlobal(),
  banner:        withGlobal(),
  contentinfo:   withGlobal(),
  main:          withGlobal(),
  form:          withGlobal(),

  // Sectioning roles
  article:       withGlobal("aria-expanded"),
  dialog:        withGlobal("aria-modal"),
  group:         withGlobal("aria-activedescendant", "aria-expanded"),

  // Separator (focusable variant adds widget attrs, but we use the non-focusable set)
  separator:     withGlobal("aria-orientation", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"),

  // Live region roles
  progressbar:   withGlobal("aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"),
  status:        withGlobal(),
  alert:         withGlobal(),
  log:           withGlobal(),
  timer:         withGlobal(),
  marquee:       withGlobal(),

  // Roles that strip semantics
  none:          new Set<string>(),
  presentation:  new Set<string>(),
};

// ---------------------------------------------------------------------------
// 4. DEFAULT_ARIA_VALUES
// ---------------------------------------------------------------------------

/**
 * Maps `aria-*` attributes to their specification-defined default values.
 * Used by the no-default-aria rule.
 */
export const DEFAULT_ARIA_VALUES: Record<string, string> = {
  "aria-hidden":          "false",
  "aria-required":        "false",
  "aria-expanded":        "false",
  "aria-pressed":         "false",
  "aria-disabled":        "false",
  "aria-checked":         "false",
  "aria-selected":        "false",
  "aria-grabbed":         "false",
  "aria-atomic":          "false",
  "aria-busy":            "false",
  "aria-modal":           "false",
  "aria-multiline":       "false",
  "aria-multiselectable": "false",
  "aria-readonly":        "false",
};

// ---------------------------------------------------------------------------
// 5. INTERACTIVE_ELEMENTS
// ---------------------------------------------------------------------------

/**
 * Set of HTML elements that are natively focusable without `tabindex`.
 * For `<a>`, focusability requires an `href` attribute — checked at the call site.
 */
export const INTERACTIVE_ELEMENTS: Set<string> = new Set([
  "a",
  "button",
  "details",
  "embed",
  "iframe",
  "input",
  "select",
  "summary",
  "textarea",
]);

// ---------------------------------------------------------------------------
// 6. STRUCTURAL_ELEMENTS
// ---------------------------------------------------------------------------

/**
 * Set of HTML elements that are structural (lists, tables, definition lists)
 * and should not have their semantics removed.
 */
export const STRUCTURAL_ELEMENTS: Set<string> = new Set([
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "td",
  "th",
  "dl",
  "dt",
  "dd",
  "menu",
]);

// ---------------------------------------------------------------------------
// 7. DESTRUCTIVE_ROLES
// ---------------------------------------------------------------------------

/**
 * Set of role values that strip native semantics from elements.
 */
export const DESTRUCTIVE_ROLES: Set<string> = new Set([
  "none",
  "presentation",
]);
