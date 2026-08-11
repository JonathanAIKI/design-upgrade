# Kilderegister

Alle statuser er verifisert 10. august 2026 ved faktisk oppslag. Står det **uverifisert**,
har kilden ikke latt seg åpne — påstå ingenting om innholdet før du har sett det.

## Verktøy — bruk i denne rekkefølgen

| Verktøy | Når | Status |
|---|---|---|
| `scripts/fetch-source.sh <url>` | Standard for alt hentbart innhold | Virker. Wrapper rundt crawl4ai. |
| Mobbin MCP | Ekte produkt-skjermbilder | Virker. |
| shadcn MCP | Komponenter fra registries (React Bits, Watermelon, shadcn) | Virker. Koblet 10. aug 2026. |
| claude-in-chrome | Innloggingsbeskyttede sider, og for å se brukerens egen app | Virker. Krever site-permission per domene. |
| WebFetch | Enkle statiske sider | Virker, men 403 på Cloudflare-sider. |
| Firecrawl MCP | — | **Tom for kreditt.** Ikke bruk. Erstattet av crawl4ai. |

`fetch-source.sh` kjører crawl4ai med `wait_until=networkidle`, som takler både SPA-er og
Cloudflare-beskyttelse, og faller tilbake til curl. Den fungerer headless — altså også i cron,
der claude-in-chrome ikke er tilgjengelig.

Installasjon hvis den mangler: `uv tool install crawl4ai --python 3.12 && crawl4ai-setup`

---

## Rutingtabell: funn → kilde

Den eneste lovlige grunnen til å åpne en ekstern kilde. Ett funn, én kilde. Maks 4 per kjøring.

| Funn fra audit | Gå til | Hva du henter |
|---|---|---|
| Farger uten system / for mange farger | Refero `/style/<uuid>` | Ekte fargeskala med rolle per token |
| Palett mangler retning | Color Hunt | Ferdig komponert 4-fargers palett |
| Kontrast feiler AA | `scripts/contrast.mjs`, så Color Review | Målt ratio, så justert par |
| Typografi uten skala | Refero `/style/<uuid>` | Størrelser, vekter, tracking, OpenType |
| Vet ikke hvilken stilretning | Refero `/design-styles/<stil>` | 10 navngitte stilretninger |
| Layout/mønster mangler forbilde | Mobbin MCP | Ekte produkt-skjermbilder |
| Skjerm mangler tilstander (tom, feil, laster) | Checklist Design | Sjekkliste for den skjermtypen |
| AI-produkt mangler mønstre for agent-tilstander | Beautiful UI | 19 AI-native primitiver |
| Trenger en komponent | shadcn MCP | shadcn, React Bits eller Watermelon |
| Semantiske temafarger ønskes | daisyUI docs | Token-navngivning og tema-struktur |
| Animasjon mangler eller er feil | motion.dev docs | Easing, spring, layout, exit |
| Trenger ferdig animert komponent | Watermelon eller Motion-Primitives via shadcn MCP | Kopierbar komponent |
| UI-et ser AI-generert ut | `04-anti-slop.md`, så `Skill(impeccable)` | 58-regels detektor lokalt |
| Grafer og dataviz involvert | `Skill(dataviz)` | Palett- og form-regler for charts |
| Trenger en kilde registeret ikke dekker | designengineer.tools | Katalog over 20 kategorier verktøy |

Treffer du taket på 4 oppslag: prioriter kritiske funn, og skriv i rapporten hvilke funn du
ikke rakk å hente forbilde til. Aldri skjul at noe ble kuttet.

---

## Kildene

### Refero Styles — `styles.refero.design`
**Status: verifisert.** Den mest presise kilden i registeret. Tre nivåer:

1. **`/style/<uuid>`** — 1290 ekte nettsteder, hver revers-dokumentert. Fire faner per side:
   **DESIGN.md** (Compact/Extended), **Tailwind v4**, **CSS Variables**, **Design Tokens**.
   Extended DESIGN.md gir fargetabeller med `Name | Value | Token | Role`, og typografi med
   vekter, størrelsesliste, line-height, letter-spacing og OpenType-features.
   Kilden når briefen trenger eksakte tall i stedet for adjektiver.
   Full liste: `curl -s https://styles.refero.design/sitemaps/styles.xml`

2. **`/design-styles/<stil>`** — 10 navngitte stilretninger, brukes som vokabular i fase 2:
   `clean-saas`, `editorial-websites`, `dark-mode-websites`, `fintech-websites`,
   `devtools-websites`, `ai-startup-websites`, `ecommerce-websites`, `minimal-websites`,
   `agency-websites`, `productivity-apps`.
   Prosa-guider, ikke tokens — bruk til å velge retning, ikke til å hente verdier.

3. **`/ai-agents/<tema>`** — 23 sider skrevet for kodeagenter, bl.a. `design-md-examples`,
   `claude-code-design-prompts`, `dashboard-design-prompts`, `tailwind-design-tokens`,
   `css-variables-design-tokens`, `agentic-ui-quality-checklist`.

Kjernepoenget derfra, parafrasert: agenter tolker «clean SaaS» som generisk hero, tre
feature-kort og gradient-bakgrunn. Ekte SaaS-sider trenger skarpere hierarki og troverdig
produktbevis. Det er selve problemet denne skillen skal løse.

Selve stil-sidene leses fint med `fetch-source.sh`. Eksport-knappene (Copy / .md) kan kreve
konto — bruk claude-in-chrome hvis nedlasting trengs.

### Mobbin — MCP
**Status: verifisert. Returnerer ekte skjermbilder.**

`search_screens` (ios/web), `search_sections` (nettsider — pricing, hero, footer),
`search_flows` (flerstegs-flyter — onboarding, checkout).

Beskriv **én** skjerm per søk, med elementene og forholdet mellom dem. Ikke kombiner flere
skjermer, ikke bruk negasjoner, ikke bruk vage stilord som «moderne». `limit: 3–5` holder
kontekstbruken nede. Siter alltid `mobbin_url` som markdown-lenke.

Eneste kilde med **ekte, kuraterte produktskjermer**. Førstevalg for layout og tetthet.

### shadcn MCP — komponenter fra tre registries
**Status: verifisert. Koblet på user-scope 10. aug 2026 (`npx shadcn@latest mcp`).**

Én MCP-server dekker tre av kildene dine. Registries settes opp **per prosjekt** i
`components.json`:

```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json",
    "@watermelon": "https://registry.watermelon.sh/r/{name}.json"
  }
}
```

Deretter fungerer naturlig språk: «Vis alle backgrounds fra React Bits-registeret»,
«Legg til Dither-bakgrunnen, gjør den lilla».

Enkeltkomponent uten registry-oppsett:
`npx shadcn@latest add https://registry.watermelon.sh/r/card-split-accordian.json`

Krever Tailwind v4 og shadcn initialisert i prosjektet.

- **shadcn/ui** — basisregisteret. Bruk `Skill(vercel:shadcn)` for CLI, komposisjon og theming.
- **React Bits** — `backgrounds` (53), `components` (44), `animations` (36),
  `text-animations` (32). **Mest slop-farlige kilde i registeret.** Partikkeltekst, glitch og
  warp løser sjelden et hierarkiproblem. Bruk kun når akse 8 sier at flaten mangler ett bevisst
  signaturmoment — og bruk da **ett**.
- **Watermelon UI** — beta. Animerte komponenter, blocks, dashboards, templates.
  Kategorier: accordian, action, buttons, cards, carousel, choice-chips, dialog, disclosure,
  dropdown, filters, inputs, interaction, lists, map, marketing, media, micro-interaction,
  navigation, pagination, popover, scheduler, sliders, tabs, toggle, tooltip, widgets.

### Beautiful UI — `beautiful-ui-five.vercel.app`
**Status: verifisert via crawl4ai.** Av designstudioet Turbo. Kopier-lim-klare primitiver.

Den eneste kilden i registeret som dekker **AI-native grensesnitt**. Bruk den når flaten er et
AI-produkt — chat, agent, assistent, kopilot — og mangler mønstre for tilstander som ikke
finnes i tradisjonell UI. Alle 19 har egen ankerlenke (`/#<slug>`):

- **Agent-tilstander**: `loading-state` (pixel-grid-loader med medgått tid), `thinking-state`
  (utvidbare traces: steps, reasoning, search, coding), `streaming-text` (strømmet svar med
  inline kilder, handlinger og oppfølgingsspørsmål), `task-rows` (live status —
  kjører, feilet, fullført, med understeg).
- **Menneske-i-loopen**: `approval-card` (spørsmål agenten stiller før den handler),
  `recommendation-card` (forslag med konfidensmåler, alternativer og «Needs review»/«No signal»
  på de svake), `selection-actions` (marker tekst og send den til agenten).
- **Verktøy og kontekst**: `tool-chips` (kodeendringer og tool-calls som kompakte chips),
  `context-cards` (hentede kunnskapsbiter med kilde, filtype og tegntelling),
  `code-block` (agent-skrevet kode som strømmer inn linje for linje).
- **Data**: `diff-table` (AI-foreslåtte endringer i tabelldata), `records-table`
  (CRM-grid med tags, sortering, relasjonsstyrke), `filter-table` (status-chips som
  omorganiserer live data), `insight-cards` (sidevis innsikt med scrub-bare grafer).
- **Skall og inndata**: `chat-composer`, `prompt-bar` (@ kilder, / kommandoer, modellvelger,
  diktering), `sidebar-nav`, `search` (kommandosøk med live filtrering og tom tilstand),
  `fine-tune-card` (inspektør der agenten justerer designegenskaper).

Merk hvordan komponentene er navngitt: **Recommendation Card**, ikke «AI-anbefaling».
Funksjon, ikke teknologi — samme regel som `04-anti-slop.md` punkt 3.

To ting å hente her utover komponentene: **konfidens vises som grad**, ikke som binært
ja/nei (`recommendation-card` merker svake alternativer «Needs review» og «No signal»), og
**agentens resonnement er sammenleggbart** framfor skjult eller alltid synlig.

Ingen registry eller npm-pakke — mønstrene leses og bygges i prosjektets egen stack.

### Checklist Design — `checklist.design`
**Status: verifisert.** 112 sjekklister i fem kategorier:

- **Mobile app**: Action Sheet, Paywall, Onboarding, Account, Login, Cart, Search, Splash Screen
- **Web app**: Admin Panel, Billing, Onboarding, Pricing, Settings, Empty State, Notifications
- **Website**: Features, Blog Post, Contact Us, Pricing, 404, Team, Careers, FAQ
- **Design system**: Typography, Tokens, Accordion, Banner, Radio, Tooltip, Modal, Input Field,
  Button, Toggle, Checkbox, Color System
- **Flows**: Adding to cart, Uploading media, Canceling subscription, Filtering items,
  Resetting password, Submitting a form, Entering promo code

Bruk når akse 6 avdekker at en skjerm **mangler noe** — tom, feil, laster, første gang,
for-mye-data. Sjekklistene fanger utelatelser, ikke estetikk.

### Color Review — `color.review`
**Status: verifisert. WCAG 2.1, AA og AAA.**
Deep-link: `https://color.review/check/<FG>-<BG>` uten `#`, f.eks. `/check/293845-FFFFFF`.
Bruk **etter** `scripts/contrast.mjs` har målt at et par feiler.

### Color Hunt — `colorhunt.co`
**Status: verifisert via crawl4ai.** Blokkerer WebFetch med 403 — bruk `fetch-source.sh`.

Kuraterte 4-fargers paletter med tags. Kun når paletten bygges fra bunnen og merkevaren ikke
gir farger. En palett er et **utgangspunkt**: du må selv tildele roller (bakgrunn, flate,
tekst, aksent) og utvide til en skala.

### daisyUI — `daisyui.com`
**Status: verifisert.** 68 komponenter på Tailwind, ren CSS uten JS. Semantiske tokens:
`primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`.
Docs: `/components/`, `/docs/themes/`, `/docs/colors/`, `/docs/customize/`.

Bruk primært som **navngivnings- og temastruktur-referanse**, også i prosjekter uten daisyUI.
Semantiske roller slår hex-verdier spredt utover kodebasen.

### motion.dev
**Status: verifisert.** Animasjonsbibliotek for React, JS og Vue (MIT). Dokumenterte områder:
React Animation, Scroll Animations, Gestures, Layout Animations, Transitions med spring-fysikk,
AnimatePresence for exit-animasjon, Motion Values.
Bruk ved akse 7 når animasjon mangler eller easing er feil for interaksjonstypen.

### Motion-Primitives — `motion-primitives.com`
**Status: verifisert via crawl4ai.** Blokkerer WebFetch (403) og curl (429).
UI-kit av ibelick: animerte, kopier-lim-bare komponenter, åpen kildekode. Har `/docs`, en
betalt Pro-variant, og et søsterprosjekt prompt-kit. Alternativ til Watermelon for motion.

### impeccable.style
**Status: verifisert — men du har skillen lokalt. Bruk den.**
Nettsiden beskriver produktet: 58-regels slop-detektor, 23 kommandoer, `DESIGN.md`-brief,
flate-modusene persuade/operate/read, «worlds», live-modus.
Lokalt: `Skill(impeccable)`. Kall den når akse 8 gir kritiske funn.
Modusinndelingen persuade/operate/read er samme skille som fase 2 spørsmål 1 — hold dem konsistente.

### Interface Craft — `interfacecraft.dev`
**Status: verifisert. Innloggingsbeskyttet læringsbibliotek — ikke hentbart i dybden.**

Av Josh, anbefalt av Emil Kowalski (Design Engineer, Linear). Fem seksjoner: Working Knowledge
(rammeverk og prinsipper), Practical Demonstration (gjennomganger av interface-design),
Collaborating with AI (videoleksjoner, bl.a. Claude Code), Means & Methods, Interface Kit.

Premisset — «most of what gets made will probably be fine, functional but forgettable; this is
for people who want to make something else» — er samme premiss som akse 8.
Har Jonathan konto: åpne via claude-in-chrome. Ellers: bruk den ikke, og ikke gjett innholdet.

### Design Engineer Tools — `designengineer.tools`
**Status: verifisert via crawl4ai. Meta-katalog, ikke en designkilde i seg selv.**

Kuratert lenkeliste for design engineers, 20 kategorier: Inspiration, AI Code, Components,
Web Utility, Desktop Utility, Video & Capture, Whiteboard, Organization, Fonts, Visual,
Interface, Motion, Audio, Volumetric, 3D, glTF, Digital Fashion, Research, Browser, Emoji.

Inspiration-seksjonen lenker bl.a. til 60fps.design, Awwwards, Cosmos, Curated Design,
Design Spells, Game UI Database, Godly, HUDS+GUIS, Layers, Minimal Gallery, Mobbin, Rebrand,
Saaspo, SearchSystem.

Bruk **kun** når rutingtabellen ikke dekker behovet — altså for å finne en ny kilde, ikke for
å hente design. Nye kilder som viser seg nyttige føres inn i dette registeret.

---

## Tilganger som mangler

Meld disse når de blokkerer et oppslag — ikke jobb rundt dem i stillhet:

1. **Firecrawl MCP er tom for kreditt.** Erstattet av crawl4ai via `fetch-source.sh`.
   Fylles den på, er den fortsatt et gyldig alternativ, men den er ikke nødvendig lenger.
2. **claude-in-chrome mangler site-permission for `interfacecraft.dev`.** Kun nødvendig hvis
   Jonathan har konto der og vil bruke innholdet.
3. **Registries må settes opp per prosjekt** i `components.json` før shadcn MCP kan hente
   React Bits- og Watermelon-komponenter. Snippet står under shadcn MCP over.
