#!/usr/bin/env bash
# Links every folder in skills/ into a Claude Code skills directory.
# Safe to run more than once.
#
#   ./install.sh            link into ~/.claude/skills (all projects)
#   ./install.sh --project  link into ./.claude/skills (current directory only)
#   ./install.sh --remove   remove links that point back into this kit

set -eu

kit_dir="$(cd "$(dirname "$0")" && pwd -P)"
source_dir="$kit_dir/skills"
target_dir="$HOME/.claude/skills"
mode="link"

for arg in "$@"; do
  case "$arg" in
    --project) target_dir="$(pwd -P)/.claude/skills" ;;
    --remove) mode="remove" ;;
    -h|--help) sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

# Git Bash on Windows copies instead of linking unless told otherwise.
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) export MSYS=winsymlinks:nativestrict ;;
esac

if [ ! -d "$source_dir" ]; then
  echo "No skills folder at $source_dir" >&2
  exit 1
fi

mkdir -p "$target_dir"
echo "Kit:    $kit_dir"
echo "Target: $target_dir"

linked=0; kept=0; skipped=0; removed=0

for skill in "$source_dir"/*/; do
  skill="${skill%/}"
  name="$(basename "$skill")"
  dest="$target_dir/$name"

  if [ "$mode" = "remove" ]; then
    if [ -L "$dest" ] && [ "$(readlink "$dest")" = "$skill" ]; then
      rm "$dest"
      echo "  removed  $name"
      removed=$((removed + 1))
    else
      echo "  left     $name (not a link to this kit)"
    fi
    continue
  fi

  if [ -L "$dest" ]; then
    if [ "$(readlink "$dest")" = "$skill" ]; then
      echo "  ok       $name (already linked)"
      kept=$((kept + 1))
    else
      echo "  skipped  $name (links to $(readlink "$dest"))"
      skipped=$((skipped + 1))
    fi
  elif [ -e "$dest" ]; then
    echo "  skipped  $name (something else is already there)"
    skipped=$((skipped + 1))
  elif ln -s "$skill" "$dest" 2>/dev/null; then
    echo "  linked   $name"
    linked=$((linked + 1))
  else
    echo "  failed   $name (could not create a link)"
    skipped=$((skipped + 1))
  fi
done

if [ "$mode" = "remove" ]; then
  echo "Done: $removed removed."
else
  echo "Done: $linked linked, $kept already in place, $skipped skipped."
  if [ "$skipped" -gt 0 ]; then
    echo "Nothing was overwritten. Move or rename the skipped entries and run this again."
    case "$(uname -s)" in
      MINGW*|MSYS*|CYGWIN*) echo "On Windows, links need Developer Mode or an administrator shell." ;;
    esac
  fi
fi
