# Valkompassen – Wermlands Mejeri

En lekfull "valkompass" där besökaren svarar på ett antal snabba frågor och får
fram vilken produkt ur Wermlands Mejeris sortiment de matchar bäst med, i
procent. Resultatet går att dela direkt som en delningsbar bild (t.ex. till
Instagram- eller Facebook-story).

Statisk sida – ingen byggprocess eller server krävs. Öppna `index.html` eller
hosta mappen på valfri statisk hosting (GitHub Pages, Netlify, Vercel, S3 …).

## Köra lokalt

```bash
python3 -m http.server 8000
# öppna http://localhost:8000
```

## Filstruktur

```
index.html          Sidstruktur (start, quiz, resultat)
css/styles.css       Styling
js/data.js           Produkter + frågor/svarsalternativ (redigera här!)
js/app.js            Quizlogik, poängberäkning, delningsbild
assets/products/*.svg  Platshållarbilder per produkt
```

## Byta ut platshållardata mot riktiga produkter

All produkt- och frågedata ligger i `js/data.js`.

1. **Produkter** – redigera `PRODUCTS`-listan. Varje produkt har:
   - `id` – kort unikt id (används i frågornas `weights`)
   - `name` – produktnamn som visas i resultatet
   - `tagline` – kort beskrivande text
   - `image` – sökväg till bild. Lägg riktiga produktbilder i
     `assets/products/` (helst kvadratiska, minst 600×600px) och peka `image`
     dit, t.ex. `assets/products/mjolk.jpg`.

2. **Frågor** – redigera `QUESTIONS`-listan. Varje fråga har `text` och en
   lista `options`. Varje svarsalternativ har `weights`: ett objekt som ger
   0–3 poäng till valfria produkt-id:n. Ju fler poäng ett svar ger en
   produkt, desto mer bidrar det svaret till matchningen mot just den
   produkten.

   Du behöver inte ge poäng till alla åtta produkter i varje alternativ –
   matchningsprocenten räknas automatiskt ut i förhållande till vad som
   maximalt går att få för respektive produkt över hela quizet, så det är
   fritt fram att lägga till/ta bort frågor eller produkter.

3. **Antal produkter/frågor** går att ändra fritt – koden är datadriven och
   kräver inga ändringar i `app.js` för att lägga till eller ta bort
   produkter/frågor.

## Delningsfunktionen

Vid resultatet genereras en delningsbar bild i stories-format (1080×1920)
med canvas i `app.js` (`drawShareCard`). Knappen **"Dela resultat"** använder
Web Share API (`navigator.share`) när det stöds (de flesta mobila browsers),
vilket öppnar enhetens delningsmeny där man kan välja Instagram- eller
Facebook-story direkt. På skrivbord (eller om Web Share saknas) faller det
tillbaka på nedladdning av bilden, som knappen **"Ladda ner bild"** också gör
direkt.

## Notera

Produkterna och frågorna som ligger i just nu är platshållare och speglar
inte Wermlands Mejeris faktiska sortiment eller varumärke – byt ut enligt
ovan innan sidan publiceras skarpt.
