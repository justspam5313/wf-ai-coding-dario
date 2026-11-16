// script.js – Der unklickbare Knopf

// ===== Einstellungen pro Stufe (hier darfst du die Zahlen anpassen) =====
// abVersuchen:   ab so vielen Klick-Versuchen gilt die Stufe
// tempo:         Fluggeschwindigkeit in Pixeln pro Bild (0 = steht still)
// fluchtTempo:   so schnell weicht der Knopf dem Cursor aus (Pixel pro Bild)
// fluchtAbstand: ist der Cursor näher als so viele Pixel, weicht der Knopf aus
// groesse:       1 = normale Grösse, 0.6 = 60 %
// text:          Knopftext in dieser Stufe
const stufen = [
  { nummer: 1, abVersuchen: 0, tempo: 0, fluchtTempo: 2, fluchtAbstand: 120, groesse: 1, text: "Klick mich" }
];

// ===== Zustand: alles, was sich während des Spiels ändert =====
const zustand = {
  stufe: 1,
  versuche: 0,
  laeuft: true,
  x: 0,       // Position des Knopfs (linke obere Ecke)
  y: 0,
  tempoX: 0,  // Bewegung pro Bild nach rechts (+) oder links (-)
  tempoY: 0   // Bewegung pro Bild nach unten (+) oder oben (-)
};

// Mausposition – am Anfang weit weg, damit der Knopf ruhig bleibt
const maus = { x: -1000, y: -1000 };

let erwischtTimer = null;

// ===== Elemente aus index.html holen =====
const knopf = document.getElementById("knopf");
const statuszeile = document.getElementById("statuszeile");
const erwischt = document.getElementById("erwischt");
const endmeldung = document.getElementById("endmeldung");
const endtext = document.getElementById("endtext");
const nochmalsKnopf = document.getElementById("nochmals");

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

// Text (und später Grösse) der aktuellen Stufe auf den Knopf übertragen
function wendeStufeAn() {
  const stufe = aktuelleStufe();
  knopf.textContent = stufe.text;
}

// ===== Bewegung =====

function setzeKnopfInDieMitte() {
  zustand.x = (window.innerWidth - knopf.offsetWidth) / 2;
  zustand.y = (window.innerHeight - knopf.offsetHeight) / 2;
}

// Knopf bleibt vollständig im Browserfenster (unterhalb der Statuszeile)
function halteImBild() {
  const oben = statuszeile.offsetHeight;
  const rechts = window.innerWidth - knopf.offsetWidth;
  const unten = window.innerHeight - knopf.offsetHeight;

  if (zustand.x < 0) {
    zustand.x = 0;
  }
  if (zustand.x > rechts) {
    zustand.x = rechts;
  }
  if (zustand.y < oben) {
    zustand.y = oben;
  }
  if (zustand.y > unten) {
    zustand.y = unten;
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
}

// Ein Bild weiter: ausweichen, falls der Cursor zu nahe ist
function bewegeKnopf() {
  const stufe = aktuelleStufe();
  const mitte = knopfMitte();

  if (berechneAbstand(maus.x, maus.y, mitte.x, mitte.y) < stufe.fluchtAbstand) {
    weicheAus(stufe);
  }

  halteImBild();
  zeichneKnopf();
}

// Die Bewegungsschleife: läuft ca. 60-mal pro Sekunde
function spielSchleife() {
  if (zustand.laeuft) {
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
  zeigeStatus();
}

// Esc: Bewegung stoppt sofort, Endmeldung erscheint
function beendeSpiel() {
  if (!zustand.laeuft) {
    return; // Spiel ist schon beendet – nichts tun
  }
  zustand.laeuft = false;
  endtext.textContent = "Spiel beendet – Stufe " + zustand.stufe + ", " + zustand.versuche + " Versuche";
  endmeldung.hidden = false;
}

// Alles auf Anfang setzen
function starteNeu() {
  endmeldung.hidden = true;
  zustand.stufe = 1;
  zustand.versuche = 0;
  zustand.laeuft = true;
  zustand.tempoX = 0;
  zustand.tempoY = 0;
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
