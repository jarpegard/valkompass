// Data för Wermlands Mejeri Valkompass.
//
// "color" är hämtad från respektive förpacknings egen brytfärg (bandet vid
// korken / produktnamnets färg), justerad för att ge minst 4.5:1 kontrast
// mot både vit bakgrund och vit text ovanpå.
//
// Resultatet är till största delen slumpmässigt (js/app.js, computeResults),
// men färgfrågan ("Väljer du rött, grönt eller blått?") väger tungt: varje
// svarsalternativ kan ha ett "boost"-fält med produkt-id:n som då får ett
// högt slumptal istället för ett lågt/mellan, kopplat till mjölkens klassiska
// färgkodning (blå = lätt, grön = mellan, röd = standard). Övriga frågor har
// bara vanlig text och påverkar inte resultatet. Ingen produkt kan någonsin
// landa på 100% (se MAX_PERCENT i app.js).

const PRODUCTS = [
  {
    id: "lattmjolk",
    name: "Lättmjölk",
    tagline: "Lätt, luftig och redo för vad som helst.",
    image: "assets/products/lattmjolk.jpg",
    color: "#0f7e98"
  },
  {
    id: "mellanmjolk",
    name: "Mellanmjölk",
    tagline: "Perfekt balans – varken för mycket eller för lite.",
    image: "assets/products/mellanmjolk.jpg",
    color: "#4e7e1d"
  },
  {
    id: "standardmjolk",
    name: "Standardmjölk",
    tagline: "Den pålitliga klassikern som alltid levererar.",
    image: "assets/products/standardmjolk.jpg",
    color: "#c80a44"
  },
  {
    id: "gradde",
    name: "Grädde",
    tagline: "Festlig, generös och gör allt lite bättre.",
    image: "assets/products/gradde.jpg",
    color: "#d91356"
  },
  {
    id: "filmjolk",
    name: "Filmjölk",
    tagline: "Mysig, syrlig och lite gammaldags på ett bra sätt.",
    image: "assets/products/filmjolk.jpg",
    color: "#a32892"
  },
  {
    id: "yoghurtnaturell",
    name: "Yoghurt Naturell",
    tagline: "Fräsch, sund och redo för vad dagen än bjuder.",
    image: "assets/products/yoghurtnaturell.jpg",
    color: "#162b7d"
  },
  {
    id: "yoghurtvanilj",
    name: "Yoghurt Vanilj",
    tagline: "Mjuk, söt och lite extra omtänksam.",
    image: "assets/products/yoghurtvanilj.jpg",
    color: "#936e23"
  }
];

const QUESTIONS = [
  {
    text: "Vilket val intresserar dig mest?",
    options: ["Riksdagsvalet.", "Regionsvalet.", "Ko-mu-nalvalet."]
  },
  {
    text: "Väljer du rött, grönt eller blått?",
    options: [
      { text: "Rött.", boost: ["standardmjolk"] },
      { text: "Grönt.", boost: ["mellanmjolk"] },
      { text: "Blått.", boost: ["lattmjolk"] },
      {
        text: "Det beror på om det är till kaffet, till maten eller i glaset – såklart!",
        boost: ["gradde", "filmjolk", "standardmjolk"]
      }
    ]
  },
  {
    text: "Vilken värmländsk ko-alition skulle du vilja se?",
    options: [
      "Värmländsk mjölk i kaffet från Löfbergs.",
      "Jordgubbar från Ängebäck eller Höglunda i värmländsk grädde.",
      "Ett glas mjölk passar till det mesta som är närproducerat.",
      "Allt samarbete är alltid muuucket bra!"
    ]
  },
  {
    text: "Hur ser du på ko-handel?",
    options: [
      "Det beror helt på vad korna har att erbjuda?",
      "Det hör demokratin till – utan ko-mpromisser händer ingenting.",
      "Skamligt. Håll vad du lovar!",
      "Bara det inte sker bakom stängda dörrar."
    ]
  },
  {
    text: "Vilken ko-mpromiss är okej?",
    options: [
      "Att vi delar med oss av den värmländska mjölken utanför länsgränsen, bara det räcker till oss.",
      "Jordgubbar med mjölk i stället för grädde.",
      "Ett glas saft till nybakta bullar – om mjölken är slut.",
      "Så länge kossorna är okej, är jag okej."
    ]
  }
];
