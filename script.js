// script.js – Der unklickbare Knopf

// ===== Einstellungen pro Stufe (hier darfst du die Zahlen anpassen) =====
// abVersuchen:   ab so vielen Klick-Versuchen gilt die Stufe
// tempo:         Fluggeschwindigkeit in Pixeln pro Bild (0 = steht still)
// fluchtTempo:   so schnell weicht der Knopf dem Cursor aus (Pixel pro Bild)
// fluchtAbstand: ist der Cursor näher als so viele Pixel, weicht der Knopf aus
// groesse:       1 = normale Grösse, 0.6 = 60 %
// text:          Knopftext in dieser Stufe
// verstecken:    true = der Knopf flüchtet hinter die simulierten Fenster
const stufen = [
  { nummer: 1, abVersuchen: 0, tempo: 0, fluchtTempo: 2, fluchtAbstand: 120, groesse: 1,   text: "Klick mich",  verstecken: false },
  { nummer: 2, abVersuchen: 3, tempo: 3, fluchtTempo: 9, fluchtAbstand: 150, groesse: 1,   text: "Zu langsam!", verstecken: false },
  { nummer: 3, abVersuchen: 6, tempo: 3, fluchtTempo: 9, fluchtAbstand: 150, groesse: 0.6, text: "Wo bin ich?", verstecken: false },
  { nummer: 4, abVersuchen: 9, tempo: 3, fluchtTempo: 9, fluchtAbstand: 150, groesse: 0.6, text: "Versteckis!", verstecken: true }
];

const versteckDauer = 1500; // so lange (Millisekunden) bleibt der Knopf hinter einem Fenster

const normaleSchrift = 20;  // Schriftgrösse des Knopfs in Pixeln bei groesse 1
const kleinsteSchrift = 12; // kleiner wird die Schrift nie (Text bleibt lesbar)

// ===== Zustand: alles, was sich während des Spiels ändert =====
const zustand = {
  stufe: 1,
  versuche: 0,
  laeuft: true,
  x: 0,       // Position des Knopfs (linke obere Ecke)
  y: 0,
  tempoX: 0,  // Bewegung pro Bild nach rechts (+) oder links (-)
  tempoY: 0,  // Bewegung pro Bild nach unten (+) oder oben (-)
  versteckt: false
};

// Mausposition – am Anfang weit weg, damit der Knopf ruhig bleibt
const maus = { x: -1000, y: -1000 };

let erwischtTimer = null;
let versteckTimer = null;

// ===== Elemente aus index.html holen =====
const knopf = document.getElementById("knopf");
const statuszeile = document.getElementById("statuszeile");
const erwischt = document.getElementById("erwischt");
const endmeldung = document.getElementById("endmeldung");
const endtext = document.getElementById("endtext");
const nochmalsKnopf = document.getElementById("nochmals");
const fensterBereich = document.getElementById("fensterBereich");
const alleFenster = document.querySelectorAll(".fenster");

// ===== Hilfsfunktionen =====

// Die aktuelle Stufe als Objekt aus dem Array holen
function aktuelleStufe() {
  return stufen[zustand.stufe - 1];
}

// Abstand zwischen zwei Punkten (Satz des Pythagoras: a² + b² = c²)
function berechneAbstand(x1, y1, x2, y2) {
  const a = x2 - x1;
  const b = y2 - y1;
  return Math.sqrt(a * a + b * b);
}

// Mittelpunkt des Knopfs
function knopfMitte() {
  return {
    x: zustand.x + knopf.offsetWidth / 2,
    y: zustand.y + knopf.offsetHeight / 2
  };
}

// ===== Anzeige =====

function zeichneKnopf() {
  knopf.style.left = zustand.x + "px";
  knopf.style.top = zustand.y + "px";
}

function zeigeStatus() {
  statuszeile.textContent = "Stufe " + zustand.stufe + " · Versuche " + zustand.versuche + " · Esc = beenden";
}

// «Erwischt!» für 1 Sekunde anzeigen
function zeigeErwischt() {
  erwischt.hidden = false;
  clearTimeout(erwischtTimer);
  erwischtTimer = setTimeout(function () {
    erwischt.hidden = true;
  }, 1000);
}

// Einstellungen der aktuellen Stufe auf den Knopf übertragen
function wendeStufeAn() {
  const stufe = aktuelleStufe();
  knopf.textContent = stufe.text;
  // Grösse: nur die Schrift ändern – der Innenabstand (em) schrumpft automatisch mit
  const schrift = Math.max(kleinsteSchrift, normaleSchrift * stufe.groesse);
  knopf.style.fontSize = schrift + "px";
  starteFlug(stufe.tempo);
  fensterBereich.hidden = !stufe.verstecken; // Fenster nur in Stufe 4 zeigen
}

// ===== Bewegung =====

function setzeKnopfInDieMitte() {
  zustand.x = (window.innerWidth - knopf.offsetWidth) / 2;
  zustand.y = (window.innerHeight - knopf.offsetHeight) / 2;
}

// Knopf fliegt in eine zufällige Richtung los (tempo 0 = steht still)
function starteFlug(tempo) {
  const winkel = Math.random() * 2 * Math.PI; // zufälliger Winkel im Kreis
  zustand.tempoX = Math.cos(winkel) * tempo;
  zustand.tempoY = Math.sin(winkel) * tempo;
}

// Knopf bleibt vollständig im Browserfenster (unterhalb der Statuszeile).
// Stösst er an einen Rand, prallt er ab: die Richtung dreht um.
function halteImBild() {
  const oben = statuszeile.offsetHeight;
  const rechts = window.innerWidth - knopf.offsetWidth;
  const unten = window.innerHeight - knopf.offsetHeight;

  if (zustand.x < 0) {
    zustand.x = 0;
    zustand.tempoX = Math.abs(zustand.tempoX);  // jetzt nach rechts
  }
  if (zustand.x > rechts) {
    zustand.x = rechts;
    zustand.tempoX = -Math.abs(zustand.tempoX); // jetzt nach links
  }
  if (zustand.y < oben) {
    zustand.y = oben;
    zustand.tempoY = Math.abs(zustand.tempoY);  // jetzt nach unten
  }
  if (zustand.y > unten) {
    zustand.y = unten;
    zustand.tempoY = -Math.abs(zustand.tempoY); // jetzt nach oben
  }
}

// Knopf bewegt sich ein Stück vom Cursor weg
function weicheAus(stufe) {
  const mitte = knopfMitte();
  const abstand = berechneAbstand(maus.x, maus.y, mitte.x, mitte.y) || 1; // nie durch 0 teilen
  // Richtung vom Cursor zum Knopf, auf Länge 1 gebracht
  const richtungX = (mitte.x - maus.x) / abstand;
  const richtungY = (mitte.y - maus.y) / abstand;

  zustand.x = zustand.x + richtungX * stufe.fluchtTempo;
  zustand.y = zustand.y + richtungY * stufe.fluchtTempo;

  // Danach fliegt er in dieselbe Richtung weiter (in Stufe 1 ist tempo 0)
  zustand.tempoX = richtungX * stufe.tempo;
  zustand.tempoY = richtungY * stufe.tempo;
}

// Liegt der Punkt (x, y) innerhalb des Rahmens?
function liegtInRahmen(x, y, rahmen) {
  return x >= rahmen.left && x <= rahmen.right && y >= rahmen.top && y <= rahmen.bottom;
}

// Knopf flüchtet hinter das nächste Fenster, das nicht unter dem Cursor liegt.
// Gibt true zurück, wenn das geklappt hat.
function versteckeHinterFenster() {
  const mitte = knopfMitte();
  let bestesVersteck = null;
  let kleinsterAbstand = Infinity;

  for (const fenster of alleFenster) {
    const rahmen = fenster.getBoundingClientRect();
    const fensterMitteX = rahmen.left + rahmen.width / 2;
    const fensterMitteY = rahmen.top + rahmen.height / 2;
    const abstand = berechneAbstand(mitte.x, mitte.y, fensterMitteX, fensterMitteY);

    if (!liegtInRahmen(maus.x, maus.y, rahmen) && abstand < kleinsterAbstand) {
      kleinsterAbstand = abstand;
      bestesVersteck = { x: fensterMitteX, y: fensterMitteY };
    }
  }

  if (bestesVersteck === null) {
    return false; // kein freies Fenster gefunden
  }

  // Knopf unter das Fenster legen (tieferer z-index, siehe style.css)
  knopf.classList.add("versteckt");
  zustand.versteckt = true;
  zustand.x = bestesVersteck.x - knopf.offsetWidth / 2;
  zustand.y = bestesVersteck.y - knopf.offsetHeight / 2;
  zeichneKnopf();
  versteckTimer = setTimeout(kommeHervor, versteckDauer);
  return true;
}

// Nach der Versteckdauer: Knopf schaut wieder hervor und fliegt weiter
function kommeHervor() {
  zustand.versteckt = false;
  knopf.classList.remove("versteckt");
  starteFlug(aktuelleStufe().tempo);
}

// Ein Bild weiter: ausweichen (oder verstecken), falls der Cursor zu nahe ist, sonst weiterfliegen
function bewegeKnopf() {
  const stufe = aktuelleStufe();
  const mitte = knopfMitte();

  if (berechneAbstand(maus.x, maus.y, mitte.x, mitte.y) < stufe.fluchtAbstand) {
    if (stufe.verstecken && versteckeHinterFenster()) {
      return; // Knopf ist jetzt versteckt – in diesem Bild nichts mehr bewegen
    }
    weicheAus(stufe);
  }

  zustand.x = zustand.x + zustand.tempoX;
  zustand.y = zustand.y + zustand.tempoY;
  halteImBild();
  zeichneKnopf();
}

// Die Bewegungsschleife: läuft ca. 60-mal pro Sekunde
function spielSchleife() {
  if (zustand.laeuft && !zustand.versteckt) {
    bewegeKnopf();
  }
  requestAnimationFrame(spielSchleife);
}

// ===== Spielablauf =====

// Jeder Mausklick auf der Seite ist ein Versuch
function zaehleVersuch() {
  if (!zustand.laeuft) {
    return;
  }
  zustand.versuche = zustand.versuche + 1;
  pruefeStufenwechsel();
  zeigeStatus();
}

// Passt die Stufe noch zur Anzahl Versuche? Sonst eine Stufe höher.
function pruefeStufenwechsel() {
  let neueStufe = 1;
  for (const stufe of stufen) {
    if (zustand.versuche >= stufe.abVersuchen) {
      neueStufe = stufe.nummer;
    }
  }
  if (neueStufe !== zustand.stufe) {
    zustand.stufe = neueStufe;
    wendeStufeAn();
  }
}

// Esc: Bewegung stoppt sofort, Endmeldung erscheint
function beendeSpiel() {
  if (!zustand.laeuft) {
    return; // Spiel ist schon beendet – nichts tun
  }
  zustand.laeuft = false;
  clearTimeout(versteckTimer); // ein versteckter Knopf kommt nicht mehr hervor
  endtext.textContent = "Spiel beendet – Stufe " + zustand.stufe + ", " + zustand.versuche + " Versuche";
  endmeldung.hidden = false;
}

// Alles auf Anfang setzen
function starteNeu() {
  endmeldung.hidden = true;
  clearTimeout(versteckTimer);
  zustand.versteckt = false;
  knopf.classList.remove("versteckt");
  zustand.stufe = 1;
  zustand.versuche = 0;
  zustand.laeuft = true;
  wendeStufeAn();
  setzeKnopfInDieMitte();
  zeichneKnopf();
  zeigeStatus();
}

// ===== Ereignisse (Events) =====

// Mausposition merken
document.addEventListener("mousemove", function (ereignis) {
  maus.x = ereignis.clientX;
  maus.y = ereignis.clientY;
});

document.addEventListener("mousedown", zaehleVersuch);

// Treffer: der Klick hat den Knopf erwischt
knopf.addEventListener("mousedown", function () {
  if (zustand.laeuft) {
    zeigeErwischt();
  }
});

// Taste Esc beendet das Spiel
document.addEventListener("keydown", function (ereignis) {
  if (ereignis.key === "Escape") {
    beendeSpiel();
  }
});

nochmalsKnopf.addEventListener("click", starteNeu);

// Ändert sich die Fenstergrösse, bleibt der Knopf trotzdem sichtbar
window.addEventListener("resize", function () {
  halteImBild();
  zeichneKnopf();
});

// Spiel startet direkt beim Laden der Seite
starteNeu();
spielSchleife();
