# design-upgrade

En Claude Code-skill for systematisk å forbedre det visuelle designet på en eksisterende
nettside, dashboard eller app.

Skillen er en **dirigent**, ikke en byggeskill. Den eier tre ting: systematisk audit av
eksisterende UI, avklaring av formål og stilretning, og kuratert inspirasjonshenting.
Selve byggingen delegeres til `prototype` og `frontend-orchestrator`.

## Hvorfor

«Gjør designet penere» gir generisk output fordi modellen ikke vet hva som er galt, hva
flaten er til for, eller hva som skiller den fra alle andre sider. Denne skillen tvinger
fram svarene i rekkefølge — og måler i stedet for å synse.

To harde regler er innebygd:

- **Aldri gjett.** Hvert funn må ha målt bevis og `fil:linje`, ellers strykes det.
- **Aldri browse bredt.** En ekstern kilde åpnes kun når et konkret funn peker på den via
  rutingtabellen. Maks 4 oppslag per kjøring.

## Flyt

| Fase | Hva som skjer |
|---|---|
| 1. Kartlegg | Stack, design tokens, fargetelling, og et faktisk skjermbilde i desktop- og mobilbredde |
| 2. Avklar | Maks 3 spørsmål: formål (persuade/operate/read), retningsprofil, omfang |
| 3. Auditer | 8 akser, én task per akse, målt bevis per funn |
| 4. Hent inspirasjon | Kun kilder et konkret funn peker på |
| 5. Brief | `DESIGN.md` med eksakte tokens, ikke adjektiver |
| 6. Bygg | 3 strukturelt ulike varianter via `prototype` |

### De 8 aksene

Typografi · Farge og tema · Kontrast og synlighet · Ikoner og symboler ·
Rom, rytme og layout · Hierarki · Motion · Særpreg

### De 5 retningsprofilene

`P1 Operativ presisjon` · `P2 Rolig troverdighet` · `P3 Redaksjonell` ·
`P4 Uttrykksfull merkevare` · `P5 Eksperimentell`

Hver profil har konkrete konsekvenser — typeskala, antall farger, tetthet, radius,
motion-budsjett — ikke adjektiver.

## Installasjon

```bash
git clone git@github.com:JonathanAIKI/design-upgrade.git ~/.claude/skills/design-upgrade
```

Kjør deretter `/design-upgrade` i Claude Code.

## Avhengigheter

Ingen er påkrevd — skillen degraderer pent. Men den blir bedre med:

| Verktøy | Gir | Installasjon |
|---|---|---|
| crawl4ai | Henting av SPA-er og Cloudflare-beskyttede sider, virker headless | `uv tool install crawl4ai --python 3.12 && crawl4ai-setup` |
| Mobbin MCP | Ekte produkt-skjermbilder | MCP-server |
| shadcn MCP | Komponenter fra shadcn, React Bits og Watermelon | `claude mcp add --scope user shadcn -- npx shadcn@latest mcp` |
| claude-in-chrome | Se din egen app, og innloggingsbeskyttede kilder | Chrome-utvidelse |

Node kreves for `scripts/contrast.mjs` (ingen npm-avhengigheter).

## Scripts

```bash
# WCAG 2.1-kontrast. Exit 1 hvis et par er under AA — kan brukes som gate.
node scripts/contrast.mjs "#6b7280" "#ffffff"

# Fargeinventar med deteksjon av nær-duplikater
node scripts/contrast.mjs --scan src/styles/globals.css

# Hent en designkilde som markdown (crawl4ai, med curl-fallback)
./scripts/fetch-source.sh https://www.checklist.design/
```

## Struktur

```
SKILL.md                          6-fase-loopen
references/01-sources.md          Kilderegister + rutingtabell funn → kilde
references/02-audit-rubric.md     8 akser med målemetode per akse
references/03-direction-profiles.md   P1–P5 med konkrete parametre
references/04-anti-slop.md        Anti-AI-slop, regler og mønstre
references/05-handoff.md          Brief-mal + overlevering til prototype
scripts/contrast.mjs              WCAG 2.1-måling og fargeinventar
scripts/fetch-source.sh           Kildehenting med fallback
```
