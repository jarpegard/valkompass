// Data för Wermlands Mejeri Valkompass.
// Resultatet har medvetet ingen koppling till svaren – matchningen i
// slutresultatet slumpas fram i js/app.js (computeResults). Frågorna nedan
// är bara för skojs skull, precis som en riktig valkompass.
//
// "color" är hämtad från respektive förpacknings egen brytfärg (bandet vid
// korken / produktnamnets färg), justerad för att ge minst 4.5:1 kontrast
// mot både vit bakgrund och vit text ovanpå.

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
    text: "Hur bör Värmlands framtid finansieras?",
    options: [
      "Genom statliga bidrag och ökade transfereringar från Stockholm.",
      "Genom lokalt företagande och självförsörjning.",
      "Genom en rimligare fördelning av skattebördan.",
      "Genom att sluta skicka mjölkpengar söderut."
    ]
  },
  {
    text: "Vad är viktigast i en hållbar landsbygdspolitik?",
    options: [
      "Bredband och digitalisering.",
      "Fler djur på naturbete.",
      "Kortare avstånd från ko till konsument.",
      "Att politiker faktiskt besöker Nysäter någon gång."
    ]
  },
  {
    text: "Hur ställer du dig till fri rörlighet inom Värmland?",
    options: [
      "Positivt, folk ska kunna bo och arbeta var de vill.",
      "Negativt, resurserna koncentreras redan för mycket till städerna.",
      "Beror på om man menar Karlstad eller hela länet.",
      "Korna borde få bestämma det själva."
    ]
  },
  {
    text: "Vad anser du om gräddens roll i samhället?",
    options: [
      "Den är en lyxvara och bör beskattas hårdare.",
      "Den är en grundläggande rättighet för alla medborgare.",
      "Den är undervärderad och förtjänar mer respekt.",
      "Jag tar alltid lite extra."
    ]
  },
  {
    text: "Hur bör Sverige hantera inflationen?",
    options: [
      "Räntehöjningar och stram finanspolitik.",
      "Ökade löner och stärkt köpkraft.",
      "Kortare leveranskedjor och mer lokal produktion.",
      "Hålla priset på mjölk stabilt, resten löser sig."
    ]
  },
  {
    text: "Vad är din syn på klimatomställningen?",
    options: [
      "Snabb och radikal förändring krävs omgående.",
      "Gradvis omställning utan att slå ut industrin.",
      "Tekniklösningar och innovation, inte förbud.",
      "Biobränsle, solceller och kor som sköter sin del."
    ]
  },
  {
    text: "Var bör beslut om Värmlands utveckling fattas?",
    options: [
      "I riksdagen, med nationell överblick.",
      "I regionfullmäktige, nära medborgarna.",
      "Lokalt, i kommunerna.",
      "Ute i hagen, av dem som faktiskt bor där."
    ]
  },
  {
    text: "Hur ser du på arbetstider?",
    options: [
      "Vi behöver mer flexibilitet och rätt att koppla av.",
      "Kortare arbetsvecka är framtiden.",
      "Arbetslinjen måste värnas.",
      "Korna mjölkas tidigt. Alla andra kan anpassa sig."
    ]
  },
  {
    text: "Vad tycker du om kulturpolitiken i Värmland?",
    options: [
      "Mer pengar till scenkonst och kulturinstitutioner.",
      "Kulturen ska bära sig själv på marknaden.",
      "Folkbildning och föreningsliv ska prioriteras.",
      "En ko som tuggar i en mikrofon är också kultur."
    ]
  },
  {
    text: "Hur bör vi hantera urbaniseringen?",
    options: [
      "Satsa på städerna där tillväxten sker.",
      "Flytta resurser till landsbygden aktivt.",
      "Bygg ut infrastrukturen så att fler kan pendla.",
      "Sluta flytta till Stockholm, det finns mjölk här hemma."
    ]
  },
  {
    text: "Vad är din viktigaste valfråga?",
    options: [
      "Skolan och välfärden.",
      "Trygghet och rättsväsende.",
      "Klimat och miljö.",
      "Mejerihyllan."
    ]
  },
  {
    text: "Hur väljer du vad du röstar på?",
    options: [
      "Partiprogram och ideologi.",
      "Personliga kandidater jag litar på.",
      "Vad som känns rätt i magen.",
      "Jag läser på förpackningen."
    ]
  },
  {
    text: "Vad anser du om offentlig upphandling?",
    options: [
      "Den ska prioritera lägsta pris för skattebetalarna.",
      "Den ska ställa krav på hållbarhet och etik.",
      "Den ska gynna lokala aktörer.",
      "Kommunen borde handla mer mjölk från Nysäter."
    ]
  },
  {
    text: "Hur bör skolan reformeras?",
    options: [
      "Mer resurser till lärarna och mindre administration.",
      "Ordning och kunskapskrav måste återupprättas.",
      "Valfrihet och mångfald av skolformer.",
      "Mjölk i skolmålet, från en ko i närheten."
    ]
  },
  {
    text: "Vad är din syn på mediepolitiken?",
    options: [
      "Public service ska stärkas och vara oberoende.",
      "Marknaden avgör vilken journalistik som överlever.",
      "Lokala medier behöver särskilt stöd.",
      "P4 Värmland på transistorradio."
    ]
  },
  {
    text: "Vad anser du om bostadspolitiken?",
    options: [
      "Bygg mer, snabbare och med färre regler.",
      "Stärk hyresgästernas rättigheter.",
      "Satsa på ägande och en fungerande bostadsmarknad.",
      "Det finns gott om plats i Värmland. Vi frågar varför folk bor trångt."
    ]
  },
  {
    text: "Hur viktig är maten i politiken?",
    options: [
      "Livsmedelsberedskap är en säkerhetsfråga.",
      "Marknaden sköter matförsörjningen bättre än staten.",
      "Kortare kedjor och mer lokalproducerat måste premieras.",
      "Det är den viktigaste frågan. Vi är förvånade att det ens är en fråga."
    ]
  }
];

