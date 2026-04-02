/**
 * API may store workspace labels in Thai (e.g. "โปรเจค 1") while the app UI is EN/MY.
 * Map known default patterns to the current locale via i18n "workspace.project".
 */
const THAI_PROJECT_RE = /^โปรเจค\s*(\d+)$/u;
const ENG_PROJECT_RE = /^Project\s+(\d+)$/i;

export function getWorkspaceDisplayName(rawName, t) {
  if (rawName == null) return rawName;
  const s = String(rawName).trim();
  if (!s) return s;

  let m = s.match(THAI_PROJECT_RE);
  if (m) {
    return `${t("workspace.project")} ${m[1]}`;
  }

  m = s.match(ENG_PROJECT_RE);
  if (m) {
    return `${t("workspace.project")} ${m[1]}`;
  }

  return s;
}
