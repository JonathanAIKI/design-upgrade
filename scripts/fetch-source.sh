#!/usr/bin/env bash
# Hent en designkilde som markdown. Prøver verktøyene i den rekkefølgen som faktisk virker.
#
#   ./fetch-source.sh <url> [--raw]
#
# Rekkefølge:
#   1. crawl4ai (crwl) med networkidle — takler SPA-er og Cloudflare. Fungerer headless/cron.
#   2. curl med User-Agent — for statiske sider når crawl4ai ikke er installert.
#
# Sider som krever innlogging (Refero-eksport, Interface Craft, Mobbin web) kan ingen av
# disse nå. Bruk claude-in-chrome der — den har brukerens egne sesjoner.
#
# Installer crawl4ai:  uv tool install crawl4ai --python 3.12 && crawl4ai-setup

set -uo pipefail

URL="${1:-}"
RAW="${2:-}"

if [ -z "$URL" ]; then
  echo "Bruk: fetch-source.sh <url> [--raw]" >&2
  exit 2
fi

CRWL="${CRWL_BIN:-$HOME/.local/bin/crwl}"

if [ -x "$CRWL" ]; then
  out=$("$CRWL" crawl "$URL" -o markdown \
        -c "wait_until=networkidle,page_timeout=45000" 2>/dev/null)
  words=$(printf '%s' "$out" | wc -w | tr -d ' ')

  # "Loading..." og tomme skall betyr at renderingen ikke rakk å fullføre.
  if [ "$words" -gt 30 ]; then
    if [ "$RAW" = "--raw" ]; then
      printf '%s\n' "$out"
    else
      # Dropp bilde-only-linjer og blanke linjer — de spiser kontekst uten å gi innhold.
      printf '%s\n' "$out" | grep -vE '^\s*!\[' | grep -vE '^\s*$'
    fi
    exit 0
  fi
  echo "crawl4ai ga bare $words ord for $URL — prøver curl." >&2
fi

echo "Faller tilbake til curl (ingen JS-rendering)." >&2
body=$(curl -sL --max-time 30 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" "$URL")
code=$?
if [ $code -ne 0 ] || [ -z "$body" ]; then
  echo "Klarte ikke hente $URL. Er siden innloggingsbeskyttet? Bruk claude-in-chrome." >&2
  exit 1
fi

printf '%s' "$body" \
  | sed -e 's/<script[^>]*>.*<\/script>//g' -e 's/<style[^>]*>.*<\/style>//g' -e 's/<[^>]*>/ /g' \
  | tr -s '[:space:]' ' '
echo
