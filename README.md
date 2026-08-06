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
assets/products/*.svg  Produktbilder (platshållare)
```

## Redigera produkter och frågor

All data ligger i `js/data.js`.

1. **Produkter** – redigera `PRODUCTS`-listan. Varje produkt har:
   - `id` – kort unikt id
   - `name` – produktnamn som visas i resultatet
   - `tagline` – kort beskrivande text
   - `image` – sökväg till bild. Lägg riktiga produktbilder i
     `assets/products/` (helst kvadratiska, minst 600×600px) och peka `image`
     dit, t.ex. `assets/products/standardmjolk.jpg`.

2. **Frågor** – redigera `QUESTIONS`-listan. Varje fråga har `text` och en
   lista `options` (bara text, inga poäng/vikter).

3. Koden är datadriven – lägg till eller ta bort hur många produkter eller
   frågor som helst utan att röra `app.js`.

## Hur matchningen räknas ut

Resultatprocenten är medvetet helt slumpmässig och räknas ut i
`computeResults()` i `js/app.js` när quizet är klart – svaren under vägen
påverkar inte vilken produkt man "matchar" med. Vill ni istället koppla
svaren till resultatet går det bra att bygga om `computeResults()` att räkna
poäng per svar, men nuvarande upplägg är ett medvetet val.

## Delningsfunktionen

Vid resultatet genereras en delningsbar bild i stories-format (1080×1920)
med canvas i `app.js` (`drawShareCard`). Knappen **"Dela resultat"** använder
Web Share API (`navigator.share`) när det stöds (de flesta mobila browsers),
vilket öppnar enhetens delningsmeny där man kan välja Instagram- eller
Facebook-story direkt. På skrivbord (eller om Web Share saknas) faller det
tillbaka på nedladdning av bilden, som knappen **"Ladda ner bild"** också gör
direkt.

## Notera

Produktbilderna som ligger i `assets/products/` just nu är enkla
platshållarbilder – byt ut dem mot riktiga produktfoton enligt ovan innan
sidan publiceras skarpt.
