#!/usr/bin/env bash
# Regresjonstester for contrast.mjs. Kjør etter enhver endring i scriptet.
#   ./scripts/test.sh
# Exit 0 = alt grønt. Exit 1 = minst én test feilet.

set -uo pipefail
cd "$(dirname "$0")/.."

C="node scripts/contrast.mjs"
fail=0
pass=0

chk() {
  if [ "$2" = "$3" ]; then
    echo "  ok   $1"
    pass=$((pass + 1))
  else
    echo "  FEIL $1 — forventet '$3', fikk '$2'"
    fail=$((fail + 1))
  fi
}

# --- Fasitverdier. Svart mot hvitt er per definisjon 21:1 i WCAG 2.1.
chk "hex svart/hvit"       "$($C '#000' '#fff' --no-fail | grep -o '21.00:1')" "21.00:1"
chk "rgb()"                "$($C 'rgb(0,0,0)' 'rgb(255,255,255)' --no-fail | grep -o '21.00:1')" "21.00:1"
chk "hsl()"                "$($C 'hsl(0 0% 0%)' 'hsl(0 0% 100%)' --no-fail | grep -o '21.00:1')" "21.00:1"
chk "bar HSL-triplett"     "$($C '0 0% 0%' '0 0% 100%' --no-fail | grep -o '21.00:1')" "21.00:1"
chk "oklch svart/hvit"     "$($C 'oklch(0 0 0)' 'oklch(1 0 0)' --no-fail | grep -o '21.00:1')" "21.00:1"

# --- Kjente Tailwind-verdier, uavhengig kontrollerbare.
chk "oklch → TW red-500"   "$($C 'oklch(0.637 0.237 25.331)' '#fff' --no-fail | grep -oE '^#fb2c36')" "#fb2c36"
chk "TW gray-500 på hvit"  "$($C '#6b7280' '#ffffff' --no-fail | grep -o '4.83:1')" "4.83:1"
chk "TW gray-400 feiler"   "$($C '#9ca3af' '#ffffff' --no-fail | grep -o '2.54:1')" "2.54:1"

# --- Exit-koder. Scriptet brukes som gate, så disse er kontrakten.
chk "exit 1 ved AA-brudd"  "$($C '#9ca3af' '#fff' >/dev/null 2>&1; echo $?)" "1"
chk "exit 0 ved pass"      "$($C '#000' '#fff' >/dev/null 2>&1; echo $?)" "0"
chk "exit 0 med --no-fail" "$($C '#9ca3af' '#fff' --no-fail >/dev/null 2>&1; echo $?)" "0"
chk "exit 2 ugyldig farge" "$($C 'xyz' '#fff' >/dev/null 2>&1; echo $?)" "2"
chk "exit 2 oddetall"      "$($C '#fff' >/dev/null 2>&1; echo $?)" "2"

# --- Scan må se alle fire notasjonene, ikke bare hex.
FIX=$(mktemp -d)
trap 'rm -rf "$FIX"' EXIT
cat > "$FIX/theme.css" <<'EOF'
:root {
  --background: 36 33% 97%;      /* bar HSL-triplett, shadcn */
  --foreground: 15 22% 16%;
  --accent: oklch(0.637 0.237 25.331);  /* oklch, Tailwind v4 */
  --border: #e5e7eb;             /* hex */
  --ring: rgb(37, 99, 235);      /* rgb() */
  --muted: hsl(220 14% 96%);     /* hsl() */
  --border-drift: #e5e7ec;       /* naer-duplikat av --border */
}
EOF
chk "scan finner alle 4 notasjoner" \
  "$($C --scan "$FIX/theme.css" | grep -oE 'Distinct colours: [0-9]+')" "Distinct colours: 7"
chk "scan finner naer-duplikat" \
  "$($C --scan "$FIX/theme.css" | grep -cE '#e5e7eb\s+≈\s+#e5e7ec')" "1"

echo
if [ $fail -eq 0 ]; then
  echo "$pass/$pass tester passerte."
  exit 0
else
  echo "$fail av $((pass + fail)) tester FEILET."
  exit 1
fi
