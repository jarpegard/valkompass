// Platshållardata för Wermlands Mejeri Valkompass.
// Byt ut namn, beskrivningar och bildsökvägar mot riktiga produkter när ni är redo.
// Varje fråga har alternativ med "weights": poäng (0-3) per produkt-id.
// Resultatprocenten räknas automatiskt ut mot vad som var maximalt möjligt per produkt.

const PRODUCTS = [
  {
    id: "mjolk",
    name: "Standardmjölk",
    tagline: "Den pålitliga klassikern som alltid levererar.",
    image: "assets/products/mjolk.svg"
  },
  {
    id: "fil",
    name: "Filmjölk",
    tagline: "Mysig, syrlig och lite gammaldags på ett bra sätt.",
    image: "assets/products/fil.svg"
  },
  {
    id: "yoghurt",
    name: "Yoghurt Naturell",
    tagline: "Fräsch, sund och redo för vad dagen än bjuder.",
    image: "assets/products/yoghurt.svg"
  },
  {
    id: "kvarg",
    name: "Kvarg",
    tagline: "Proteinstark och målmedveten – ingen tid att förlora.",
    image: "assets/products/kvarg.svg"
  },
  {
    id: "graddfil",
    name: "Gräddfil",
    tagline: "Den sociala allroundaren som passar till det mesta.",
    image: "assets/products/graddfil.svg"
  },
  {
    id: "smor",
    name: "Smör",
    tagline: "Genuin, hantverksmässig och trogen traditionen.",
    image: "assets/products/smor.svg"
  },
  {
    id: "ost",
    name: "Prästost",
    tagline: "Karaktärsstark med en smak som sätter sig.",
    image: "assets/products/ost.svg"
  },
  {
    id: "gradde",
    name: "Vispgrädde",
    tagline: "Festlig, generös och gör allt lite bättre.",
    image: "assets/products/gradde.svg"
  }
];

const QUESTIONS = [
  {
    text: "Hur börjar din dag bäst?",
    options: [
      {
        text: "Med en stor skål flingor",
        weights: { mjolk: 3, fil: 0, yoghurt: 1, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Filmjölk med lite socker på (skäms inte)",
        weights: { mjolk: 0, fil: 3, yoghurt: 1, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "En proteinrik skål med kvarg och bär",
        weights: { mjolk: 0, fil: 0, yoghurt: 2, kvarg: 3, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Nybakad macka med rejält med smör och ost",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 2, ost: 3, gradde: 0 }
      }
    ]
  },
  {
    text: "Vilket väder trivs du bäst i?",
    options: [
      {
        text: "Kallt och kristallklart vinterväder",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 2, ost: 0, gradde: 2 }
      },
      {
        text: "Ljummen svensk sommarkväll",
        weights: { mjolk: 0, fil: 2, yoghurt: 2, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Nyfallen förstasnö",
        weights: { mjolk: 2, fil: 0, yoghurt: 0, kvarg: 1, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Regnigt, myskväll inomhus",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 1, smor: 0, ost: 3, gradde: 0 }
      }
    ]
  },
  {
    text: "Din favoritsysselsättning en ledig dag?",
    options: [
      {
        text: "Fika med nybakat bröd",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 3, ost: 0, gradde: 1 }
      },
      {
        text: "Långpromenad i skogen",
        weights: { mjolk: 1, fil: 2, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Träningspass följt av en smoothie",
        weights: { mjolk: 0, fil: 0, yoghurt: 2, kvarg: 3, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Middagsbjudning med vänner",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 3, smor: 0, ost: 2, gradde: 0 }
      }
    ]
  },
  {
    text: "Vilket tillbehör känns mest 'du'?",
    options: [
      {
        text: "Gräddfilsbaserad dressing till allt",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 3, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Riven ost på det mesta",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 3, gradde: 0 }
      },
      {
        text: "En rejäl klick vispgrädde på efterrätten",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 3 }
      },
      {
        text: "Enkelt är bäst – ett glas kall mjölk till maten",
        weights: { mjolk: 3, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      }
    ]
  },
  {
    text: "Din helgfrukost om du får välja helt fritt?",
    options: [
      {
        text: "Pannkakor med sylt och grädde",
        weights: { mjolk: 1, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 3 }
      },
      {
        text: "Ostmacka och kaffe i lugn och ro",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 2, ost: 2, gradde: 0 }
      },
      {
        text: "Yoghurtbowl med granola och frukt",
        weights: { mjolk: 0, fil: 0, yoghurt: 3, kvarg: 1, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Fil med hembakad mysli",
        weights: { mjolk: 0, fil: 3, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      }
    ]
  },
  {
    text: "Vilket ord beskriver dig bäst?",
    options: [
      {
        text: "Klassisk",
        weights: { mjolk: 2, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 1, ost: 0, gradde: 0 }
      },
      {
        text: "Hälsomedveten",
        weights: { mjolk: 0, fil: 0, yoghurt: 1, kvarg: 3, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Mysig",
        weights: { mjolk: 0, fil: 2, yoghurt: 0, kvarg: 0, graddfil: 1, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Festlig",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 2, gradde: 2 }
      }
    ]
  },
  {
    text: "Din go-to-snack framför tv:n?",
    options: [
      {
        text: "Ostbågar eller en bit lagrad ost",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 3, gradde: 0 }
      },
      {
        text: "Skål med kvarg och honung",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 3, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Macka med rejält lager smör",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 3, ost: 0, gradde: 0 }
      },
      {
        text: "Glass med vispad grädde på topp",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 3 }
      }
    ]
  },
  {
    text: "Om du var ett väder, vilket skulle du vara?",
    options: [
      {
        text: "Mjuk dimma en tidig morgon",
        weights: { mjolk: 0, fil: 2, yoghurt: 0, kvarg: 0, graddfil: 2, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Klar och frisk vinterdag",
        weights: { mjolk: 2, fil: 0, yoghurt: 0, kvarg: 2, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Varm sommarsol",
        weights: { mjolk: 0, fil: 0, yoghurt: 3, kvarg: 0, graddfil: 0, smor: 0, ost: 0, gradde: 0 }
      },
      {
        text: "Mysigt novembermörker med levande ljus",
        weights: { mjolk: 0, fil: 0, yoghurt: 0, kvarg: 0, graddfil: 0, smor: 2, ost: 2, gradde: 0 }
      }
    ]
  }
];
