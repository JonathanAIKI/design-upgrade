# Anti-slop

Slop er ikke stygt design. Slop er design **uten et valg bak seg** — statistisk gjennomsnitt av
alt modellen har sett. Det ser ofte helt greit ut, og det er nettopp problemet: greit og
utskiftbart.

Testen: dekk til logo og produktnavn. Kan dette være hvilken som helst side i samme kategori?
Da er det slop, uansett hvor pent det er.

Kjøres to ganger: som audit-akse 8, og på din egen brief før fase 6.

---

## Ufravikelige regler

Disse er faste. De diskuteres ikke, og de gjelder i alle fem retningsprofilene.

1. **Ingen emoji i produktgrensesnitt.** Bruk ord, tall, punkter eller et ekte ikonsett.
2. **Ingen sparkle-ikoner.** ✨ som «AI»-signal er den tydeligste enkeltmarkøren for
   AI-generert UI som finnes.
3. **Ingen «AI-»-prefiks i etiketter.** «AI-anbefaling» → «Anbefaling». «AI-drevet søk» → «Søk».
   Beskriv verdien for brukeren, ikke teknologien bak.
4. **Ingen gradient på tekst.** Særlig ikke lilla-til-cyan på overskrift.
5. **Ingen glassmorfisme uten grunn.** Frosset glass er riktig når noe faktisk ligger *over*
   noe annet. Ellers er det kostyme.
6. **Ingen neon-glød** som standard-aksent på mørk bakgrunn.
7. **Kontrastkravene i akse 3 forhandles aldri** — heller ikke når det ser bedre ut uten.

---

## Mønstre som avslører generert design

Hvert punkt: hva du ser, hvorfor det er dødt, hva du gjør i stedet.

### Layout

**Sentrert hero: overskrift, undertekst, to knapper, alt midtstilt.**
Det er standardoppsettet fordi det er trygt, ikke fordi det er riktig.
→ Bruk asymmetri, en ekte produktskjerm i førstevisning, eller la typografien bære alene.
Spør hva denne siden har som ingen annen har, og la det stå øverst.

**Tre feature-kort på rad, hvert med ikon over overskrift over to setninger.**
Det tydeligste enkeltmønsteret i generert design.
→ Ulik vekt på ulike funksjoner, fordi funksjonene *har* ulik vekt. Vis den viktigste i
bruk — skjermbilde, tall, kort arbeidsflyt — og la resten være en liste.

**Alt i kort.** Når hvert element ligger i sin egen boks med kant og skygge, er ingenting
gruppert, fordi alt er gruppert likt.
→ Bruk nærhet og mellomrom som gruppering. Kort brukes når noe faktisk er en enhet du kan
handle på.

**Bento-grid uten hierarki.** Ulike ruteformater som ikke svarer til ulik viktighet er bare
uro med ekstra steg.
→ Størrelse skal bety noe. Stor rute = viktigst.

### Farge

**Lilla-til-blå gradient som merkevare.** Standardvalget når ingen har valgt.
→ Én farge med disiplin slår to farger i overgang. Har du gradient, la den ha en grunn
(dybde, materiale, tilstand) og ett sted den hører hjemme.

**Aksentfarge på alle flater.** Aksent som dekker halve skjermen er ikke lenger aksent.
→ Aksent er tegnsetting: primærhandling, aktiv tilstand, ett øyeblikk per skjerm.

**Ren `#ffffff` bakgrunn med ren `#000000` tekst.** Teknisk maksimal kontrast, visuelt hardt og
uten karakter.
→ Varm eller kjølig nær-hvit og nær-svart. Fortsatt godt over AA, men med et standpunkt.

### Typografi

**Inter, Geist eller systemfont uten at valget er tatt.** Ingen av dem er dårlige. Alle tre er
standardsvaret.
→ Ta valget bevisst og skriv begrunnelsen i briefen. Én familie med karakter på overskrift +
nøytral brødtekst er nesten alltid et løft.

**Alle overskrifter fete, ingen tracking-justering.** Store grader trenger strammere tracking.
→ Bygg hierarki med størrelse og tracking før du når etter vekt.

**Copy som beskriver kategorien.** «Effektiviser arbeidsflyten din med kraftige verktøy.»
Det er ikke tekst, det er utfyllingsmasse.
→ Skriv hva produktet faktisk gjør, for hvem, med hvilket resultat. Konkret slår adjektiv.

### Motion

**Alt fader inn på scroll.** Når alt animeres, betyr ingen animasjon noe, og siden føles treg.
→ Maks ett bevisst avsløringsmoment. Resten er der med en gang.

**Hover-effekt som løfter kortet 8px med skygge.** Standardsvaret på «gjør det interaktivt».
→ Én subtil endring — kant, bakgrunn, 1–2px bevegelse. Under 150 ms.

**Animasjon på hyppige handlinger.** Se frekvensregelen i akse 7.

### Innhold

**Placeholder-innhold som overlever inn i vurderingen.** «Lorem ipsum», «John Doe»,
`example.com`, tomme grafer. Design vurdert på falskt innhold er ikke vurdert.
→ Bruk realistiske norske navn, realistiske tall, realistisk lange strenger. Test spesielt
det lengste tenkelige innholdet — der brekker layouten.

**Ingen tomme tilstander.** Første gang en bruker ser produktet er ofte når det er tomt.
→ Design den tilstanden først. Hva ser man, og hva er neste steg?

---

## Den positive testen

Slop-fritt er ikke bare fravær av mønstrene over. Det krever noe eget.

Før du leverer, skal du kunne svare på dette i én setning:

> **Hva er det ene, gjennomførte valget som gjør at denne flaten ikke kunne vært hvem som helst?**

Gyldige svar er konkrete: en typografisk beslutning som gjentas, en kantbehandling, en
fargebruk med regel, en layoutregel som brytes med vilje ett bestemt sted, en detalj i
interaksjonen som ingen andre gidder.

Ugyldige svar: «rent og moderne», «profesjonelt», «brukervennlig». Det er fravær av valg
beskrevet som valg.

**Ett moment, gjennomført overalt.** Fem halvferdige er verre enn null.
