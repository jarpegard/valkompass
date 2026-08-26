# Valkompassen – Wermlands Mejeri

En lekfull "valkompass" i stil med de politiska varianterna inför val, fast
här matchas besökaren istället mot en produkt ur Wermlands Mejeris sortiment,
i procent. Frågorna är på skoj (med en och annan koppling till Värmland och
politik) och resultatet har ingen koppling till svaren – matchningen slumpas
fram, precis som charmen med en riktig valkompass. Resultatet går att dela
direkt som en delningsbar bild, t.ex. till Instagram- eller Facebook-story.

Statisk sida – ingen byggprocess krävs. Öppna `index.html` eller hosta mappen
på valfri statisk hosting. Ett litet PHP-skript (`count.php`) används för att
räkna genomförda test (se "Statistik" nedan) – webbhotellet behöver därför
stödja PHP, vilket Beebytes delade webbhotell gör.

## Köra lokalt

```bash
python3 -m http.server 8000
# öppna http://localhost:8000
```

## Deploy (Beebyte, FTP)

Domän och webbhotell ligger hos Beebyte. Sajten är statisk (inget
byggsteg), så en deploy är bara: ladda upp filerna via FTP/SFTP till
webbrotens katalog (`public_html`, `www` eller motsvarande i Beebytes
filstruktur), och skriva över de gamla.

Vid varje kodändring paketeras en zip med `index.html`, `css/`, `js/`,
`assets/`, `count.php` och `stats.php` (allt utom källfiler som inte
används av sajten, t.ex. den oberedda originalloggan) – packa upp den och
ladda upp innehållet. **OBS:** ladda inte upp/skriv över `counter-data.json`
om den redan finns på servern – då nollställs statistiken.

**Viktigt – cache:** `index.html` laddar `css/styles.css`, `js/data.js`
och `js/app.js` med en `?v=ÅÅÅÅMMDDx`-querysträng (cache busting). Vid
varje ny zip ändras det datumet, så att webbläsare/ev. cache hos Beebyte
hämtar de nya filerna direkt istället för att visa en gammal cachad
version efter uppladdning – annars kan en vanlig omladdning (F5) visa
gammalt innehåll trots att filerna är uppdaterade på servern.

## Statistik (genomförda test)

För att kunna se hur många som genomför valkompassen finns en egen liten
räknare – helt utan tredjepartstjänster och utan att spara några
personuppgifter:

- `count.php` tar emot ett anrop (POST) när någon når resultatskärmen
  (anropas från `finishQuiz()` i `js/app.js` via `fetch(...)`, "fire and
  forget" – misslyckas anropet påverkar det inte upplevelsen). Skriptet
  räknar bara upp en siffra i filen `counter-data.json` (skapas
  automatiskt på servern, låses vid skrivning för att undvika krockar).
  **Ingen IP-adress, inga cookies, ingen user-agent eller annan
  identifierande data sparas** – bara ett heltal.
- `stats.php` är en enkel sida som visar antalet, för den som vill kika på
  siffran. Den är inte länkad någonstans i sajten, bara nåbar direkt via
  `valjvarmland.se/stats.php`.

Vill ni nollställa räknaren: radera `counter-data.json` på servern (den
skapas på nytt automatiskt vid nästa genomförda test).

## Filstruktur

```
index.html            Sidstruktur (start, quiz, resultat)
css/styles.css         Styling
js/data.js             Produkter + frågor/svarsalternativ (redigera här!)
js/app.js              Quizlogik och delningsbild
count.php              Tar emot räkning av genomförda test (ingen persondata)
stats.php              Visar antalet genomförda test
assets/products/*.jpg  Riktiga produktfoton
assets/products/kospot-pattern.jpg  Kofläcksmönster, används som bakgrundstextur
```

## Redigera produkter och frågor

All data ligger i `js/data.js`.

1. **Produkter** – redigera `PRODUCTS`-listan. Varje produkt har:
   - `id` – kort unikt id
   - `name` – produktnamn som visas i resultatet
   - `tagline` – kort beskrivande text
   - `image` – sökväg till bild i `assets/products/`, t.ex.
     `assets/products/standardmjolk.jpg`. Bilderna är beskurna produktfoton
     (porträttformat, vit bakgrund, förpackningen fyller nästan hela bilden)
     – behåll samma stil vid byte/tillägg av produkter så att croppen i
     resultatlistan och delningsbilden ser bra ut.
   - `color` – produktens egen brytfärg (hämtad från förpackningens band/
     produktnamn), används som accentfärg för just den produktens rad,
     progressbar, badge och delningsbild. Välj en nyans med minst 4.5:1
     kontrast mot vitt om du byter/lägger till en färg.

2. **Frågor** – redigera `QUESTIONS`-listan. Varje fråga har `text` och en
   lista `options`. Ett alternativ kan antingen vara:
   - bara en textsträng (påverkar inte resultatet, helt slumpmässigt), eller
   - ett objekt `{ text, boost: [produkt-id, ...] }` – de angivna
     produkterna får då ett högt slumptal istället för ett lågt/mellan när
     resultatet räknas ut (se nedan). Just nu används det bara i
     färgfrågan ("Väljer du rött, grönt eller blått?").

3. Koden är datadriven – lägg till eller ta bort hur många produkter eller
   frågor som helst utan att röra `app.js`.

## Navigering i quizet

Besökaren kan gå fram och tillbaka mellan frågorna med knapparna
"← Tillbaka" och "Framåt →" under svarsalternativen. Alla svar sparas i
`state.answers` (ett index per fråga), så tidigare val visas markerade när
man går tillbaka, och ändrar man ett svar (t.ex. färgfrågan) räknas
boostade produkter om från grunden vid varje resultat (`getBoostedIds()`)
– det gamla svaret påverkar då inte längre resultatet.

## Hur matchningen räknas ut

`computeResults()` i `js/app.js` avgör resultatet i två separata steg:

**1. Vilken produkt hamnar var** – styrs av en intern "preferens" (inte det
som visas): boostade produkter (färgfrågan, kopplad till mjölkens
klassiska färgkodning blå/grön/röd = lätt/mellan/standard, samt
jordgubbsalternativet under ko-alitionsfrågan) får ett högt slumptal
(`PREFERENCE_BOOSTED_RANGE`, 72–97) istället för lågt/mellan
(`PREFERENCE_NORMAL_RANGE`, 5–90), så det svaret väger tungt utan att vara
en garanti. Utöver det formas listan alltid enligt fasta regler:

1. **Grädde eller en mjölk toppar alltid** – Filmjölk eller en yoghurt kan
   aldrig hamna på förstaplatsen (`topCandidates` i `computeResults()`).
2. **En mjölk hamnar alltid i mitten** (plats 4 av 7) **och en mjölk hamnar
   alltid sist** (plats 7).
3. **Om grädde inte toppar** hamnar grädde ändå garanterat **topp 3**
   (plats 2 eller 3).
4. **Om Standardmjölk toppar** blir Lättmjölk specifikt den som hamnar
   sist (och Mellanmjölk blir då automatiskt den som hamnar i mitten).

**2. Vilket procenttal som visas** – styrs helt av `RANK_PERCENT_BANDS`,
oberoende av boost/preferens:

| Placering | Intervall |
| --- | --- |
| 1–2 | 73–92% |
| 3–5 | 32–64% |
| 6–7 | 6–14% |

Värdena slumpas inom respektive band och sorteras fallande sinsemellan
(topp-2, mitten-3, botten-2), så listan alltid känns konsekvent. Eftersom
toppbandet slutar på 92 kan ingen produkt någonsin landa på 100%. Vill ni
ändra banden eller strukturreglerna, gör det i `computeResults()` i
`js/app.js`.

## Delningsfunktionen

Vid resultatet genereras en delningsbar bild i stories-format (1080×1920)
med canvas i `app.js` (`drawShareCard`). Knappen **"Dela resultat"** använder
Web Share API (`navigator.share`) när det stöds (de flesta mobila browsers),
vilket öppnar enhetens delningsmeny där man kan välja Instagram- eller
Facebook-story direkt. På skrivbord (eller om Web Share saknas) faller det
tillbaka på nedladdning av bilden, som knappen **"Ladda ner bild"** också gör
direkt.

## Design

Produktbilderna i `assets/products/` är riktiga produktfoton, beskurna och
komprimerade från originalen (5000×3750px) till max 1000px och JPEG för
snabb inläsning. Kofläcksmönstret (`kospot-pattern.jpg`) används som en
subtil bakgrundstextur på hela sidan (se `body::before` i `css/styles.css`).

Produktminiatyrerna i resultatlistan är rundade rektanglar (inte cirklar) i
porträttformat, för att efterlikna förpackningarnas faktiska form istället
för att beskära bort merparten av en hög mjölkförpackning i en cirkel. Varje
produkts egna brytfärg (`color` i `js/data.js`) används genomgående för den
radens ram, progressbar, procentsiffra och "Bästa match"-badge, samt för
ramen och rubriken i den nedladdningsbara delningsbilden – så att resultatet
känns kopplat till just den produkten istället för en generisk apphmall.

### Typsnitt

- **Rubriker** (`h1`/`h2`, samt motsvarande text i delningsbildens canvas)
  använder **League Gothic** i versaler – samma typsnitt som
  "WERMLANDS"-loggan (`assets/brand/Wermlands-Mejeri-PayOff.png`).
  Fontfilen ligger i `assets/fonts/LeagueGothic-Regular.otf` och laddas via
  `@font-face` i `css/styles.css`.
- **Brödtext** (all annan text: knappar, frågor/svar, taglines, etc.)
  använder **Courier New**, satt som sidans grundtypsnitt (`--font-body` i
  `css/styles.css`).

Vill ni byta typsnitt: lägg en ny fontfil i `assets/fonts/`, uppdatera
`@font-face`-blocket och `--font-heading`/`--font-body` i `css/styles.css`.
Canvas-texten i `drawShareCard` (`js/app.js`) sätter samma typsnitt manuellt
per rad (t.ex. `ctx.font = "400 56px 'League Gothic', ..."`) eftersom canvas
inte ärver CSS – uppdatera dem parallellt vid typsnittsbyte.
