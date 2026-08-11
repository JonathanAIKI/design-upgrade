# Audit-rubrikk — 8 akser

Gå gjennom alle åtte i rekkefølge. Opprett én task per akse. Hver akse har en **måling** som
kan kjøres, ikke bare vurderes. Funn uten måling er ikke funn.

Format per funn:

```
[akse] alvorlighet · påstand · måling som beviser den · fil:linje
```

Alvorlighet: **kritisk** (utilgjengelig eller ødelagt) · **høy** (skader tydelig inntrykk eller
bruk) · **medium** (inkonsistens) · **lav** (finish).

---

## 1. Typografi

**Ser du etter:** en skala, eller tilfeldige tall?

**Mål:**
```bash
rg -o 'font-size:\s*[0-9.]+(px|rem)|text-\[[0-9.]+(px|rem)\]' -r '$0' --no-filename | sort -u
rg -o 'font-(bold|semibold|medium|light|black|thin)|font-weight:\s*[0-9]+' --no-filename | sort | uniq -c
```
Tell distinkte størrelser og vekter.

**Rødt flagg:**
- Mer enn 7 distinkte fontstørrelser på én flate — det er ingen skala, det er tilfeldigheter.
- Mer enn 3 vekter i bruk uten at hver har en tydelig jobb.
- Brødtekst under 14px, eller line-height under 1.4 på løpende tekst.
- Overskrifter uten strammere tracking enn brødteksten. Store grader trenger negativ tracking
  (typisk −0.01em til −0.03em); små grader trenger nøytral eller lett positiv.
- Systemfont-stack eller Inter som ubevisst standard. Inter er ikke feil — Inter *uten et valg
  bak* er feil.

**Bra ser slik ut:** en modulær skala (f.eks. 12/14/16/20/24/32/48), én familie som bærer
hierarkiet gjennom størrelse og tracking, maks to vekter i UI-tekst.

**Ved funn:** Refero `/style/<uuid>` → fanen DESIGN.md Extended gir ekte størrelseslister,
vekter, tracking og OpenType-features fra et nettsted som allerede løser dette.

---

## 2. Farge og tema

**Ser du etter:** er fargene et system med roller, eller en samling som har vokst?

**Mål:**
```bash
node ~/.claude/skills/design-upgrade/scripts/contrast.mjs --scan <tokenfil eller mappe>
```
Scriptet teller distinkte farger og viser dem gruppert.

**Rødt flagg:**
- Over 20 distinkte hex-verdier uten navngitte roller.
- Samme visuelle farge definert flere steder med litt ulik verdi (`#3b82f6` og `#3B82F5`).
- Farger navngitt etter utseende (`blue-500`) i stedet for rolle (`--color-accent`) i
  applikasjonskoden. Skala-navn hører hjemme i token-laget, rollenavn i bruk.
- Ingen mørk modus-strategi i et produkt som åpenbart trenger det.
- Aksentfargen brukt på store flater. Aksent som fyller halve skjermen er ikke lenger aksent.

**Bra ser slik ut:** 1 nøytral skala (5–9 trinn) + 1 aksent + 2–3 semantiske (success, warning,
error). Hver farge har en rolle skrevet ned. Aksenten brukes sjelden nok til å bety noe.

**Ved funn:** daisyUI `/docs/colors/` for rollenavngivning; Refero `/style/<uuid>` for en ekte
skala med `Role`-kolonne; Color Hunt kun hvis paletten skal bygges fra null.

---

## 3. Kontrast og synlighet

**Ser du etter:** målt WCAG 2.1-ratio. Dette er den eneste aksen med et objektivt fasitsvar.

**Mål:**
```bash
node ~/.claude/skills/design-upgrade/scripts/contrast.mjs "#6b7280" "#ffffff" "#111827" "#f9fafb"
```
Kjør på hvert reelt tekst/bakgrunn-par, inkludert: brødtekst, dempet tekst, placeholder,
knappetekst på fylt knapp, tekst på bilde/overlay, deaktiverte tilstander, og fokusring mot
bakgrunn.

**Krav:**
- Brødtekst og all tekst under 18px (eller under 14px fet): **≥ 4.5:1** (AA).
- Stor tekst, 18px+ normal eller 14px+ fet: **≥ 3:1**.
- UI-komponentgrenser, ikoner som bærer mening, fokusindikator: **≥ 3:1**.
- Alt under kravet er **kritisk**, uansett hvor pent det ser ut.

**Rødt flagg utover ratio:**
- Fokusring fjernet med `outline: none` uten erstatning. Alltid kritisk.
- Informasjon formidlet med farge alene (rød tekst = feil, uten ikon eller ord).
- Tekst lagt rett på bilde uten overlay eller skygge.
- Deaktiverte elementer så svake at de ser ut som de mangler.

**Ved funn:** `color.review/check/<FG>-<BG>` for å finne nærmeste par som består uten å miste
fargeintensjonen.

---

## 4. Ikoner og symboler

**Ser du etter:** ett sett, én vekt, én metafor-logikk.

**Mål:**
```bash
rg -o 'from "(lucide-react|react-icons/[a-z]+|@heroicons[^"]*|@phosphor-icons[^"]*)"' --no-filename | sort | uniq -c
rg -o 'strokeWidth=\{?[0-9.]+' --no-filename | sort | uniq -c
```

**Rødt flagg:**
- To eller flere ikonbiblioteker i samme flate. Blandet stroke og fill leser som rot.
- Ulik `strokeWidth` mellom ikoner ved siden av hverandre.
- Ikoner i ulik optisk størrelse fordi viewBox varierer mellom sett.
- Ikon uten tekstetikett på en handling som ikke er universelt kjent. Hamburger og forstørrelsesglass
  er kjent; nesten ingenting annet er det.
- Dekorative ikoner uten `aria-hidden`, eller meningsbærende ikoner uten tilgjengelig navn.
- **Sparkle-ikoner og «AI-»-prefiks i UI.** Beskriv verdien, ikke teknologien:
  «AI-anbefaling» → «Anbefaling». Dette er en fast regel, ikke en preferanse.
- Emoji brukt som ikon i produktgrensesnitt.

**Bra ser slik ut:** ett sett, én vekt, konsistent optisk størrelse, ikon + ord der handlingen
har konsekvens.

---

## 5. Rom, rytme og layout

**Ser du etter:** følger avstand en skala, eller er tallene plukket per komponent?

**Mål:**
```bash
rg -o '(padding|margin|gap)(-[a-z]+)?:\s*[0-9.]+(px|rem)|\b(p|m|gap|space-[xy])-\[[^]]+\]' --no-filename | sort | uniq -c | sort -rn
```

**Rødt flagg:**
- Vilkårlige verdier (`p-[13px]`, `mt-[27px]`) spredt utover. Én bevisst optisk justering er
  greit; tjue er fravær av system.
- Avstand som ikke skiller: elementer som hører sammen står like langt fra hverandre som
  elementer som ikke gjør det. Nærhet er den billigste formen for hierarki.
- Lik padding på alle sider i et element der optisk balanse krever ulik (typisk knapper med
  ikon, og tekst over/under store grader).
- Linjelengde over ~75 tegn på løpende brødtekst.
- Ingen tydelig grid eller maks-bredde — innhold som flyter helt ut på store skjermer.
- Ikke sjekket i mobilbredde. Hvis du ikke har sett den, er den ikke auditert.

**Bra ser slik ut:** én skala (4/8-basert er vanlig), gruppering som speiler mening, bevisst
maks-bredde, og en tetthet som passer formålet — dashboard tåler tett, landingsside gjør ikke.

---

## 6. Hierarki og informasjonsarkitektur

**Ser du etter:** ser du det viktigste først?

**Mål:** myse-testen, kjørt på et faktisk skjermbilde. Ta screenshot, se på det uskarpt
(zoom ut, eller vurder kun form og vekt). Skriv ned de tre tingene som trekker blikket først,
i rekkefølge. Stemmer de med de tre viktigste tingene på siden?

Suppler med Checklist Design for skjermtypen — den fanger **utelatelser**:
tom tilstand, lastetilstand, feiltilstand, første gang-tilstand, for-mye-data-tilstand.

**Rødt flagg:**
- Flere konkurrerende primærhandlinger på samme skjerm. Én primær per skjerm.
- Alt like viktig: samme kortstørrelse, samme vekt, samme farge over hele flaten.
- Ingen tom tilstand designet — brukeren møter en blank skjerm ved første besøk.
- Ingen feil- eller lastetilstand.
- Navigasjon som viser alt på ett nivå i stedet for å gruppere.
- Overskrifter som beskriver systemet («Datavisning») i stedet for brukerens jobb.

**Er flaten et AI-produkt** — chat, agent, assistent, kopilot — gjelder et eget sett tilstander
som ikke finnes i tradisjonell UI. Mangler noen av disse, er det et funn:

- **Venting med ukjent varighet.** En vanlig spinner lyver når svaret tar 40 sekunder.
  Vis framdrift eller medgått tid.
- **Resonnement.** Er stegene skjult, alltid synlige, eller sammenleggbare? Sammenleggbart er
  nesten alltid riktig — synlig nok til å gi tillit, lukket nok til ikke å drukne svaret.
- **Strømmende svar.** Hva skjer med layouten mens teksten vokser? Hopper siden?
- **Handling som krever godkjenning.** Gjør agenten noe irreversibelt uten å spørre?
- **Konfidens.** Presenteres et usikkert forslag likt et sikkert? Grad slår binært.
- **Kilder.** Kan brukeren se hva svaret bygger på?
- **Feil midt i en oppgave.** Hva skjer når steg 3 av 5 feiler — mister brukeren alt?

**Ved funn:** Beautiful UI (`beautiful-ui-five.vercel.app`) — eneste kilde i registeret som
dekker disse mønstrene. 19 primitiver med ankerlenke per komponent.

---

## 7. Motion og mikrointeraksjon

**Ser du etter:** tjener hver animasjon et formål — orientering, tilbakemelding, kontinuitet?

**Mål:**
```bash
rg -o 'transition[^;]*|animate-[a-z-]+|duration-[0-9]+|ease-[a-z-]+' --no-filename | sort | uniq -c
rg -c 'prefers-reduced-motion'
```

**Krav:**
- `prefers-reduced-motion: reduce` **må** være håndtert. Mangler den: kritisk.
- Animer kun `transform` og `opacity`. Animert `width`, `height`, `top` eller `left` gir
  layout-thrash — høy alvorlighet.
- Varighet: 100–200 ms for direkte tilbakemelding, 200–350 ms for overganger mellom tilstander,
  over 500 ms kun for noe brukeren bevisst venter på.
- Exit-animasjon der noe forsvinner. Elementer som bare popper vekk føles ødelagt.

**Frekvensregelen:** jo oftere brukeren utløser interaksjonen, desto kortere og mer usynlig skal
animasjonen være. En animasjon du legger merke til på 10. gjentakelse er for mye.
Tastatur-initierte handlinger animeres ikke — brukeren er allerede raskere enn animasjonen.

**Ved funn:** motion.dev for easing, spring, layout og AnimatePresence. Trenger du ferdig
komponent: Watermelon UI eller Motion-Primitives. React Bits kun med skepsis — se anti-slop.

---

## 8. Særpreg

**Ser du etter:** hva skiller denne flaten fra en generisk AI-generert side?

**Mål:** dekk til logo og produktnavn på skjermbildet. Kan dette være hvilken som helst
SaaS-side? Hvis ja, er funnet **høyt**, ikke lavt. Kjør deretter hele
`references/04-anti-slop.md` som sjekkliste.

**Rødt flagg:** se anti-slop-fila. De tyngste:
- Hero med sentrert overskrift, undertekst, to knapper — og ingenting eget.
- Tre feature-kort med ikon på rad.
- Gradient-tekst på overskrift.
- Glassmorfisme uten grunn.
- Emoji som visuelt system.
- Copy som beskriver kategorien i stedet for produktet.

**Bra ser slik ut:** minst **ett** bevisst, konsistent gjennomført signaturmoment — en
typografisk beslutning, en fargebruk, en layoutregel, en detalj i interaksjonen — som gjentas
og som ingen annen side i samme kategori har. Ett, gjennomført. Ikke fem, halvveis.

**Ved funn:** `Skill(impeccable)` lokalt for 58-regels detektor; Mobbin for hvordan ekte
produkter i samme kategori faktisk skiller seg; Refero `/design-styles/<stil>` for retning.
