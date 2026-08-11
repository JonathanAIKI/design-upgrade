---
name: design-upgrade
description: Systematisk forbedring av visuelt design på en eksisterende nettside, dashboard, app eller komponent. Kartlegger koden, avklarer formål og stilretning, auditerer mot 8 designakser (typografi, farge, kontrast, ikoner, rom/rytme, hierarki, motion, særpreg), henter målrettet inspirasjon fra en verifisert kildeliste (Refero, Mobbin, checklist.design, daisyUI, motion.dev, color.review m.fl.) og leverer 3 varianter via prototype-skillen. Bruk ved "forbedre designet", "gjør siden penere", "redesign", "siden ser AI-generert ut", "design-audit", "løft dashboardet", "gjør UI-et mer særpreget", "/design-upgrade".
---

# Design Upgrade

Du er dirigent, ikke solist. Denne skillen eier tre ting som ingen annen skill her gjør:
**systematisk audit av eksisterende UI**, **avklaring av formål og stilretning**, og
**kuratert inspirasjonshenting**. Selve byggingen delegeres videre.

## Hardt krav: aldri gjett på design

Alt du påstår om det eksisterende designet er enten **målt** (lest fila, kjørt scriptet, sett
skjermbildet i denne sesjonen) eller merket **antatt**. «Kontrasten er dårlig» uten et tall er
ikke et funn — det er en følelse. Se `references/02-audit-rubric.md` for hvordan hver akse måles.

## Hardt krav: ikke browse bredt

Du åpner **aldri** en ekstern kilde uten at et konkret funn fra fase 3 peker på den.
Maks 4 live-oppslag per kjøring. Kjerneprinsippene ligger allerede på disk i
`references/`. Bredt browsing er sløsing og gir generisk output.

---

## Fase 1 — Kartlegg det som finnes

Ingen spørsmål til brukeren ennå. Finn ut selv:

1. **Stack**: `package.json` → framework, styling (Tailwind/CSS Modules/styled), UI-bibliotek
   (shadcn/Radix/daisyUI/MUI), animasjonsbibliotek (motion/GSAP/CSS).
2. **Tokens**: `tailwind.config.*`, `globals.css`, `theme.*`, `app.css`. Hvilke farger,
   fontstørrelser og spacing-verdier finnes faktisk?
3. **Volum**: kjør `scripts/contrast.mjs --scan <tokenfil>` for å telle distinkte farger.
   Mange farger uten system er et av de sterkeste slop-signalene.
4. **Merkevare**: finnes `DESIGN.md`, `.impeccable.md`, brand-guide eller logo i repoet?
5. **Se det faktiske UI-et.** Dette er ikke valgfritt. Kjør appen (`run`-skillen hvis den
   finnes) og ta skjermbilde via claude-in-chrome, i **både** desktop- og mobilbredde.
   Kode alene skjuler tetthet, rytme og faktisk visuell vekt.

Finnes det ingen kode ennå (helt ny flate): hopp til fase 2 og si det eksplisitt.

**Oppsummer i 5 linjer** før du går videre: stack, tokens, antall farger, hva du så på skjermen.

---

## Fase 2 — Avklar formål og retning

Bruk `AskUserQuestion`. **Maks 3 spørsmål.** Kontekst du kan hente selv, henter du selv —
ikke spør om stack eller filstruktur.

Spør alltid om disse tre, med dine egne anbefalinger basert på fase 1:

1. **Formål** — hva skal flaten få brukeren til å gjøre? Overbevise (landingsside),
   operere (dashboard/admin), eller lese (dokumentasjon/innhold)? Dette styrer alt annet.
2. **Retning** — strammere og mer konkret, eller mer kreativ og særpreget?
   Presenter 2–3 konkrete profiler fra `references/03-direction-profiles.md`, ikke abstrakte ord.
3. **Omfang** — hele flaten, én side, eller én komponentfamilie? Bundet scope gir bedre design.

Er brukeren ikke tilgjengelig: velg profil ut fra fase 1, si antagelsen eksplisitt, fortsett.

---

## Fase 3 — Systematisk audit

Les `references/02-audit-rubric.md` og gå gjennom **alle 8 aksene i rekkefølge**. Opprett en
task per akse så ingen hoppes over.

| # | Akse | Kjernespørsmål |
|---|------|----------------|
| 1 | Typografi | Er det en skala, eller tilfeldige størrelser? |
| 2 | Farge og tema | Er fargene et system med roller, eller en samling? |
| 3 | Kontrast og synlighet | Målt WCAG-ratio per tekst/bakgrunn-par |
| 4 | Ikoner og symboler | Ett sett, én vekt, én metafor-logikk? |
| 5 | Rom, rytme og layout | Følger spacing en skala? Er noe optisk skjevt? |
| 6 | Hierarki | Ser du det viktigste først når du myser? |
| 7 | Motion | Tjener hver animasjon et formål? |
| 8 | Særpreg | Hva skiller dette fra en templated AI-side? |

Hvert funn skrives som: **akse · alvorlighet (kritisk/høy/medium/lav) · målt bevis · fil:linje**.

Funn uten bevis strykes. Ingen funn på en akse er et gyldig resultat — skriv «ingen funn».

---

## Fase 4 — Målrettet inspirasjon

Nå, og først nå, åpner du eksterne kilder. Les `references/01-sources.md`, som inneholder den
verifiserte kildelista og en **gap → kilde**-rutingtabell.

Regelen: for hvert funn med alvorlighet kritisk eller høy, slå opp den **ene** kilden tabellen
peker på. Maks 4 oppslag totalt. Prioriter kritiske funn hvis du treffer taket.

Verktøyvalg (verifisert 10. august 2026):
- **`scripts/fetch-source.sh <url>`** — standard for alt hentbart. Kjører crawl4ai med
  JS-rendering, takler SPA-er og Cloudflare, virker headless. Førstevalg for alle nettsider.
- **Mobbin MCP** — ekte produkt-skjermbilder. Førstevalg for layout, tetthet og mønster.
- **shadcn MCP** — komponenter fra shadcn, React Bits og Watermelon. Krever at registries er
  satt opp i prosjektets `components.json` — snippet i `01-sources.md`.
- **claude-in-chrome** — kun for innloggingsbeskyttede sider, og for å se brukerens egen app.
- **Firecrawl MCP** — tom for kreditt. Ikke bruk. Erstattet av crawl4ai.

Destiller hvert oppslag til det som faktisk er anvendelig her. Lim aldri inn rå sidetekst.

---

## Fase 5 — Design-brief

Skriv en brief etter malen i `references/05-handoff.md`. Den skal inneholde:

- **Retning** i én setning, i produktets språk — ikke «moderne og rent».
- **Konkrete tokens**: fargeskala med roller og hex, typeskala med px/rem, spacing-skala,
  radius, motion-budsjett. Eksakte verdier, ikke adjektiver.
- **De 5 viktigste grepene**, hvert knyttet til et funn fra fase 3.
- **Hva som bevisst ikke endres**, og hvorfor.
- **Anti-slop-kontrakt** fra `references/04-anti-slop.md`.

Sjekk briefen mot `references/04-anti-slop.md` før du går videre. Bryter din egen brief en
regel der, fiks den nå.

---

## Fase 6 — Tre varianter

Kall `Skill(prototype)` og følg dens UI-gren. Krav som gjelder her:

- **3 varianter**, strukturelt forskjellige — ikke tre fargevarianter av samme layout.
  Én skal ligge nær briefens midtpunkt, én strammere, én mer uttrykksfull.
- Hver variant får **navn og én setning** om hva den satser på, i variant-velgeren.
- Bygg i prosjektets faktiske stack når det finnes en app. Uten app: tre frittstående
  HTML-filer med inline CSS, åpnet i browseren.
- Trenger variantene tyngre design- eller motion-håndverk, kall `Skill(frontend-orchestrator)`
  og gi den svarene fra fase 2 slik at den **ikke spør om modus på nytt**.

Kjør `scripts/contrast.mjs` på hver variants tekst/bakgrunn-par før du leverer. En variant som
feiler AA på brødtekst er ikke ferdig.

---

## Levering

Rapporter i denne rekkefølgen, kort:

1. Hva du målte i fase 1 (stack, antall farger, skjermbilder tatt).
2. Funn per akse med alvorlighet — inkludert aksene uten funn.
3. Kildene du faktisk åpnet, og hvilket funn hver enkelt svarte på.
4. Briefen.
5. URL og `?variant=`-nøkler til de 3 variantene, med kontrastmåling per variant.

Aldri meld ferdig uten målt bevis. Feilende kontrastsjekk rapporteres som feil, med tallene.
