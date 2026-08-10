# Valkompassen – Wermlands Mejeri

En lekfull "valkompass" i stil med de politiska varianterna inför val, fast
här matchas besökaren istället mot en produkt ur Wermlands Mejeris sortiment,
i procent. Frågorna är på skoj (med en och annan koppling till Värmland och
politik) och resultatet har ingen koppling till svaren – matchningen slumpas
fram, precis som charmen med en riktig valkompass. Resultatet går att dela
direkt som en delningsbar bild, t.ex. till Instagram- eller Facebook-story.

Statisk sida – ingen byggprocess eller server krävs. Öppna `index.html` eller
hosta mappen på valfri statisk hosting (GitHub Pages, Netlify, Vercel, S3 …).

## Köra lokalt

```bash
python3 -m http.server 8000
# öppna http://localhost:8000
```

## Filstruktur

```
index.html            Sidstruktur (start, quiz, resultat)
css/styles.css         Styling
js/data.js             Produkter + frågor/svarsalternativ (redigera här!)
js/app.js              Quizlogik och delningsbild
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

## Hur matchningen räknas ut

`computeResults()` i `js/app.js` slumpar fram en procent 5–90 per produkt.
Om besökaren svarat på ett alternativ med `boost` (just nu bara
färgfrågan, kopplad till mjölkens klassiska färgkodning: blå = lätt,
grön = mellan, röd = standard) slumpas de produkterna istället i
intervallet 72–97 – så det svaret väger tungt utan att vara en garanti.
`MAX_PERCENT` (97) sätter också ett tak så att ingen produkt någonsin kan
landa på exakt 100%. Vill ni att fler frågor ska påverka resultatet, lägg
till `boost` på fler alternativ i `js/data.js`.

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
