# Retningsprofiler

Brukes i fase 2, spørsmål 2. Spør aldri «strammere eller mer kreativ?» som abstrakt valg —
presenter 2–3 av disse profilene med konkrete konsekvenser, så brukeren velger noe reelt.

Aksen går fra tilbakeholden til uttrykksfull. Velg profil **etter formål**, ikke etter smak:
en flate som skal opereres daglig og en flate som skal overbevise på 8 sekunder har motsatte
optimum.

Kobling til flate-modus (samme skille som `Skill(impeccable)` bruker):
**operate** → P1–P2 · **read** → P3 · **persuade** → P3–P5.

---

## P1 — Operativ presisjon

**Når:** dashboard, admin, intern verktøy, datatabeller, alt som brukes daglig i timevis.

| Parameter | Verdi |
|---|---|
| Typeskala | Stram: 12/13/14/16/20/24. Brødtekst 13–14px. |
| Fontvekter | 2 (400 + 500/600). Aldri fet brødtekst. |
| Farger | 1 nøytral skala (7–9 trinn) + 1 aksent + 3 semantiske. Aksent kun på primærhandling og aktiv tilstand. |
| Tetthet | Høy. Radhøyde 32–40px. Spacing-skala 4px-basert. |
| Radius | 4–6px. Konsistent overalt. |
| Motion | Minimalt. 100–150 ms, kun tilstandsendring og fokus. Ingen entré-animasjon på data. |
| Ornament | Null. Ingen gradienter, skygger kun for lag (dropdown, modal). |
| Signaturmoment | I presisjonen: perfekt tallinnretting, konsistent kolonnerytme, gjennomtenkte tomme tilstander. |

**Risiko:** blir anonym. Motvekt er kvalitet i detaljene, ikke pynt.
**Refero-stil:** `productivity-apps`, `devtools-websites`.

---

## P2 — Rolig troverdighet

**Når:** B2B SaaS-produkt, kundeportal, fagtjeneste. Skal signalisere at det er trygt å stole på.

| Parameter | Verdi |
|---|---|
| Typeskala | 14/16/18/24/32/48. Brødtekst 16px, line-height 1.5–1.6. |
| Fontvekter | 2–3. Én familie kan bære alt. |
| Farger | Nøytral skala + 1 aksent brukt sparsomt + semantiske. Rolig bakgrunn, ikke rent hvitt hvis flaten er stor. |
| Tetthet | Middels. Spacing 8px-basert. Maks-bredde 1120–1280px. |
| Radius | 8–12px. |
| Motion | 200–300 ms, ease-out. Overganger mellom tilstander, ikke dekor. |
| Ornament | Sparsomt. Hairline-borders framfor skygger. |
| Signaturmoment | Ett: en typografisk detalj, en konsekvent kantbehandling, eller en fargebruk med disiplin. |

**Risiko:** havner rett i «generisk clean SaaS». Motgift: ekte produktbevis — skjermbilder,
tall, arbeidsflyt — i stedet for tre feature-kort med ikon.
**Refero-stil:** `clean-saas`, `fintech-websites`.

---

## P3 — Redaksjonell

**Når:** innholdstungt, dokumentasjon, fagblogg, «om oss», case-sider. Lesing er hovedjobben.

| Parameter | Verdi |
|---|---|
| Typeskala | Bred: 16/18/20/28/40/64. Brødtekst 17–19px, line-height 1.6–1.7. |
| Fontvekter | 2, men gjerne to *familier*: én med karakter til overskrift, én nøytral til brødtekst. |
| Farger | Nesten monokrom. Én aksent som punktum, aldri som flate. |
| Tetthet | Lav. Linjelengde 60–72 tegn. Generøs vertikal rytme mellom seksjoner. |
| Radius | 0–4px. Kanter er ofte riktigere enn avrunding her. |
| Motion | Nesten ingen. Eventuelt rolig scroll-avsløring, 300–400 ms, én gang. |
| Ornament | Typografien *er* ornamentet. Marginalia, ingresser, sitatbehandling, ekte figurtekster. |
| Signaturmoment | Overskriftsbehandling: tracking, optisk marginjustering, blanding av grader. |

**Risiko:** kjedelig hvis typografien ikke faktisk er god. Denne profilen tåler ikke slurv.
**Refero-stil:** `editorial-websites`, `minimal-websites`.

---

## P4 — Uttrykksfull merkevare

**Når:** landingsside, produktlansering, kampanje, byrå. Skal huskes, ikke bare forstås.

| Parameter | Verdi |
|---|---|
| Typeskala | Dramatisk kontrast: 16 brødtekst mot 72–120 display. Hopp over mellomtrinn med vilje. |
| Fontvekter | 2–3, med stort sprang mellom brødtekst og display. |
| Farger | Kan gå mørkt eller mettet. Fortsatt maks 1 aksent + nøytral skala — metning erstatter ikke system. |
| Tetthet | Varierende med vilje: tette partier mot store pustepauser. Rytmen er poenget. |
| Radius | Konsekvent valg, enten skarpt (0–2px) eller markert (16–24px). Ikke midt imellom. |
| Motion | 300–500 ms på entré, choreografert i sekvens. Alltid `prefers-reduced-motion`. |
| Ornament | Tillatt, men **ett system** — ikke fem effekter. |
| Signaturmoment | Obligatorisk og skal være tydelig: en layoutregel, en typografisk gest, en materialbehandling som gjentas. |

**Risiko:** høyest slop-risiko av alle profilene. Kjør `04-anti-slop.md` ekstra hardt her.
**Refero-stil:** `agency-websites`, `ai-startup-websites`, `dark-mode-websites`.

---

## P5 — Eksperimentell

**Når:** portefølje, statement-side, noe som skal bli snakket om. Sjelden riktig for kundeprodukt.

| Parameter | Verdi |
|---|---|
| Typeskala | Fritt, men internt konsistent. Reglene brytes bevisst, ikke tilfeldig. |
| Farger | Fritt. Kontrastkravene i akse 3 gjelder **fortsatt** og forhandles ikke. |
| Tetthet | Fritt. |
| Motion | Kan bære opplevelsen. Ytelsesbudsjett gjelder: kun transform/opacity i det som løper. |
| Ornament | Kjernen i profilen. |
| Signaturmoment | Hele siden er signaturen. |

**Ufravikelig selv her:** WCAG AA på all lesbar tekst, `prefers-reduced-motion`,
tastaturnavigasjon, og en flate som faktisk fungerer på mobil.

**Risiko:** utilgjengelig eller uforståelig. Foreslå aldri P5 til et kundeprodukt uten at
brukeren eksplisitt ber om det.
**Refero-stil:** ingen direkte — bruk Mobbin for ekte eksempler i kategorien.

---

## Blanding

Profilene kan blandes på tvers av flater i samme produkt, og det er ofte riktig:
markedssiden P4, appen innenfor innlogging P1. Da må **tokens deles** — samme fargeskala, samme
familie, samme radius-logikk — mens tetthet, skala-sprang og motion-budsjett skiller seg.
Skriv eksplisitt i briefen hva som deles og hva som avviker.
