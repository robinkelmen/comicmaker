#!/bin/bash

# Pre-tool-use hook to check TypeScript errors before git commits
# This runs before any tool use that involves git commit

TOOL_NAME="$1"
TOOL_INPUT="$2"

# Only run for git commits via Bash tool
if [[ "$TOOL_NAME" == "Bash" ]] && echo "$TOOL_INPUT" | grep -q "git commit"; then
  echo "🔍 Running TypeScript check before commit..."
  
  cd web 2>/dev/null || {
    echo "⚠️  Not in comicmaker directory, skipping TS check"
    exit 0
  }
  
  # Run TypeScript check
  if ! npx tsc --noEmit 2>&1; then
    echo "❌ TypeScript errors found! Commit blocked."
    echo "Run 'cd web && npx tsc --noEmit' to see errors."
    exit 1
  fi
  
  echo "✅ TypeScript check passed!"
fi

exit 0
