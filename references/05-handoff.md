# Brief og overlevering

## Design-brief — mal

Skriv til `DESIGN.md` i prosjektroten hvis den ikke finnes, ellers oppdater den.
Fila er kontrakten både `Skill(impeccable)`, `Skill(frontend-orchestrator)` og senere sesjoner
leser. Adjektiver hører ikke hjemme her — tall gjør.

```markdown
# Design-brief — <flate>

## Retning
<Én setning i produktets språk. Ikke "moderne og rent".>
Profil: <P1–P5 fra 03-direction-profiles.md> · Flate-modus: <persuade|operate|read>

## Signaturmoment
<Det ene valget som gjør flaten gjenkjennelig. Én setning. Hvor det gjentas.>

## Tokens

### Farge
| Token | Verdi | Rolle |
|---|---|---|
| --color-bg | #… | Sidebakgrunn |
| --color-surface | #… | Kort, paneler |
| --color-text | #… | Brødtekst |
| --color-text-muted | #… | Sekundær tekst, metadata |
| --color-border | #… | Hairline, skiller |
| --color-accent | #… | Primærhandling, aktiv tilstand — kun her |
| --color-success/-warning/-error | #… | Semantisk |

### Typografi
Familie: <navn> (<hvorfor akkurat denne>)
Skala: <12/14/16/20/24/32/48 — eksakte verdier>
Vekter: <400, 600 — og hva hver gjør>
Tracking: <per grad, f.eks. display −0.02em, body 0>
Line-height: <body 1.5, display 1.1>

### Rom
Skala: <4/8/12/16/24/32/48/64>
Maks-bredde: <px> · Linjelengde brødtekst: <ca. 65 tegn>
Radius: <verdi, konsistent>

### Motion
Varigheter: <tilbakemelding 120ms, overgang 250ms>
Easing: <navn/kurve>
Budsjett: <hva som animeres, hva som ikke gjør det>
prefers-reduced-motion: <hva som skjer da>

## De 5 grepene
1. <Grep> — løser funn <akse/id> — <målt før → mål etter>
2. …

## Bevisst uendret
- <Ting> — <hvorfor>

## Anti-slop-kontrakt
Ingen emoji · ingen sparkle · ingen "AI-"-prefiks · ingen gradient-tekst ·
ingen glassmorfisme uten lag · aksent kun som tegnsetting · AA på all tekst.
```

Sjekk briefen mot `04-anti-slop.md` før den sendes videre. Bryter briefen sin egen kontrakt,
fiks det nå — ikke i fase 6.

---

## Overlevering til `Skill(prototype)`

Prototype-skillen har to grener. Du skal alltid inn på **UI-grenen** (`UI.md`).

Gi den dette, eksplisitt:

- Spørsmålet den skal svare på: «Hvilken retning skal <flate> ha?»
- Antall varianter: **3**.
- Sub-shape: **A** (varianter på eksisterende rute, `?variant=`) når ruten finnes. Bruk B kun
  når flaten ikke har noe sted å bo.
- Briefen over, som felles grunnlag.
- Hvor variantene skal avvike fra hverandre — se under.

### Hvordan de 3 variantene skal skille seg

Ikke tre fargevarianter av samme layout. Strukturelt forskjellige, plassert rundt briefen:

| Variant | Forhold til briefen | Skal svare på |
|---|---|---|
| **A — Midtpunkt** | Briefen som den står | Er retningen riktig? |
| **B — Strammere** | Ett trinn mot P1/P2: tettere, færre farger, mindre motion, mer informasjon per skjerm | Blir den bedre av mindre? |
| **C — Mer uttrykksfull** | Ett trinn mot P4: større typografisk sprang, tydeligere signaturmoment, mer luft eller mer materiale | Tåler den mer karakter? |

Hver variant får navn og én setning i variant-velgeren, f.eks.
`B — Strammere: samme innhold, halv høyde`.

Det nyttige svaret fra Jonathan er ofte «header fra B med innholdsområdet fra C». Legg til
rette for det ved å holde variantene lesbare hver for seg.

---

## Overlevering til `Skill(impeccable)` — standardmotoren

Kall den på **hver** variant, ikke bare når noe ser galt ut. Den er grunnen til at output
fra denne skillen skal se ut som håndverk og ikke som en generert side.

Den leser `DESIGN.md`, som du allerede skrev i fase 5 — så den arbeider innenfor de samme
tokenene i stedet for å finne på nye. Gi den i tillegg:

```
Flate: <hvilken side/komponent>
Flate-modus: <persuade|operate|read>     ← samme skille impeccable selv bruker
Profil: <P1–P5>
Brief: <sti til DESIGN.md>
Variant: <A midtpunkt | B strammere | C mer uttrykksfull>
Signaturmoment som skal gjentas: <fra briefen>
Ikke rør: <det som er bevisst uendret>
```

Bruk dens slop-detektor på resultatet. Den fanger mønstre `04-anti-slop.md` beskriver, men
mekanisk — 58 regler mot din egen lesing.

## Overlevering til `Skill(frontend-orchestrator)`

Kall den når variantene krever motion-håndverk, eller når du vil ha modus-ruting
(taste / pro-max) i stedet for impeccable alene.

Den skillen har en egen STOPP-og-vent-gate der den spør om modus (impeccable / taste /
pro-max / motion). **Du har allerede stilt de spørsmålene i fase 2.** Gi den svarene med én
gang, slik at den ikke spør Jonathan på nytt:

```
Kontekstanalyse er allerede gjort av design-upgrade.
Stack: <fra fase 1>
Formål: <persuade|operate|read> · Profil: <P1–P5>
Anbefalt modus: <modus> (+ <sekundær>)
Brief: <sti til DESIGN.md>
Ikke spør om modus på nytt — bygg.
```

Modus-mapping fra profil:
- P1, P2 → `taste` (React/Tailwind, tetthet, komponentarkitektur)
- P3 → `impeccable` (typografi og redaksjonell kontroll)
- P4 → `pro-max` (+ `motion` hvis animasjon er en del av grepet)
- P5 → `impeccable` + `motion`

---

## Før du melder ferdig

- [ ] Alle 8 akser gjennomgått, også de uten funn
- [ ] Hvert funn har målt bevis og fil:linje
- [ ] Maks 4 eksterne oppslag, hvert knyttet til et konkret funn
- [ ] Briefen har eksakte tokens, ikke adjektiver
- [ ] `Skill(impeccable)` kjørt på **alle tre** variantene, ikke bare den du liker best
- [ ] `contrast.mjs` kjørt på hver variants tekst/bakgrunn-par, tallene i rapporten
- [ ] Hver variant sett i browser, i både desktop- og mobilbredde
- [ ] Anti-slop-kontrakten holder i alle tre variantene
- [ ] Kilder du ikke rakk, og funn uten forbilde, er nevnt eksplisitt

Feilende kontrastsjekk rapporteres som feil, med tallene. Aldri pynt på resultatet.
