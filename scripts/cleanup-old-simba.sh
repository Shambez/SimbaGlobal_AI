#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/Desktop/SimbaGlobal_AI"
trash="$HOME/Desktop/Simba_Cleanup_Trash_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$trash"


cat > scripts/cleanup-old-simba.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/Desktop/SimbaGlobal_AI"
trash="$HOME/Desktop/Simba_Cleanup_Trash_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$trash"

find "$HOME" -maxdepth 4 -type d \( -iname "*simba*ai*" -o -iname "simbaglobal_ai" -o -iname "simbaglobalai" -o -iname "simba_ai" \) 2>/dev/null | while read -r d; do
  if [ "$d" != "$ROOT" ] && [[ "$d" != "$HOME/.Trash"* ]]; then
    mv "$d" "$trash/" 2>/dev/null || true
  fi
done

cd "$ROOT"
for d in .git_bad_* ../node_modules_trash_*; do
  [ -e "$d" ] && mv "$d" "$trash/" 2>/dev/null || true
done

pkill -f "node|metro|expo|react-native|gradle|watchman" 2>/dev/null || true
watchman watch-del-all 2>/dev/null || true

rm -rf "$HOME/.expo"
rm -rf "$HOME/Library/Developer/Xcode/DerivedData/"*

echo "Moved duplicates and old temp folders to: $trash"
echo "Kept project: $ROOT"
