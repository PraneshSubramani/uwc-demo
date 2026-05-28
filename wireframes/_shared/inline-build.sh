#!/usr/bin/env bash
# ========================================================================
# Inline-build — concatenate _shared/*.css and _shared/*.js into each
# scenario HTML file at the marker comments. Zero-tool build step.
#
# Usage: ./inline-build.sh                  # process all 9 files
#        ./inline-build.sh 03_scenario_C    # process one file
#
# Markers in each HTML file:
#   <!-- INLINE:uwc-tokens.css -->...<!-- /INLINE -->
#   <!-- INLINE:zoho-tokens.css -->...<!-- /INLINE -->
#   <!-- INLINE:components.css -->...<!-- /INLINE -->
#   <!-- INLINE:role-switcher.js -->...<!-- /INLINE -->
#   <!-- INLINE:sample-data.js -->...<!-- /INLINE -->
# ========================================================================
set -euo pipefail
cd "$(dirname "$0")/.."  # = wireframes/

SHARED_DIR="_shared"
TARGET_GLOB="${1:-*.html}"

inline_file() {
  local html_file="$1"
  echo "→ Processing $html_file"
  local tmp; tmp=$(mktemp)
  cp "$html_file" "$tmp"

  for shared_file in uwc-tokens.css zoho-tokens.css components.css role-switcher.js sample-data.js; do
    local content_file="$SHARED_DIR/$shared_file"
    [[ -f "$content_file" ]] || continue

    python3 -c "
import sys, re
with open('$tmp', 'r') as f: html = f.read()
with open('$content_file', 'r') as f: content = f.read()
pattern = r'(<!-- INLINE:$shared_file -->)(.*?)(<!-- /INLINE -->)'
new = '\\\\1\\n' + content + '\\n\\\\3'
html = re.sub(pattern, new, html, flags=re.DOTALL)
with open('$tmp', 'w') as f: f.write(html)
"
  done

  mv "$tmp" "$html_file"
  echo "✓ $html_file done"
}

for f in $TARGET_GLOB; do
  [[ -f "$f" && "$f" != *"PLAN"* ]] || continue
  case "$f" in 00_*|01_*|02_*|03_*|04_*|05_*|06_*|07_*|99_*) inline_file "$f" ;; esac
done

echo "All files inlined."
