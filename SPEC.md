# Der unklickbare Knopf

> **SPEC.md – Ihr Projektsteckbrief.** Diese Datei beschreibt, *was* Ihre App können soll.
> Sie wächst über alle vier Kurstage und ist Ihr wichtigster Kontext für die KI.

## Idee
Ein Knopf «Klick mich» flieht vor der Maus und wird mit jedem Klick-Versuch frecher: zuerst
huscht er langsam weg, dann fliegt er herum, dann wird er kleiner und am Schluss versteckt
er sich hinter (simulierten) Programmfenstern – mit Esc beendet man das Spiel.

Wichtig: Eine Webseite kann echte Fenster anderer Programme weder sehen noch sich dahinter
verstecken, und sie kann sich nicht ausserhalb des Browserfensters bewegen. Deshalb gilt:
- «Bildschirm» = sichtbarer Bereich des Browserfensters (Viewport).
- «Andere Programmfenster» = simulierte Fenster auf der Seite (HTML-Elemente mit Titelleiste,
  Titel, drei farbigen Punkten und etwas Inhalt). Der Knopf versteckt sich hinter diesen.

## Für wen
Besucher:innen meiner GitHub-Pages-Seite (Mitstudierende, Dozent), die eine kurze
Spasspause am Computer mit Maus oder Trackpad machen.

## User Stories
- Als Spieler:in möchte ich, dass der Knopf in der Mitte steht und langsam vor meinem
  Cursor davonhuscht (Stufe 1), damit ich merke, dass er nicht geklickt werden will.
- Als Spieler:in möchte ich, dass der Knopf nach 3 Klick-Versuchen ständig mit mittlerer
  Geschwindigkeit herumfliegt und mir schnell ausweicht (Stufe 2), damit es schwieriger wird.
- Als Spieler:in möchte ich, dass der Knopf nach 6 Klick-Versuchen kleiner wird, aber
  lesbar bleibt (Stufe 3), damit er schwerer zu treffen ist.
- Als Spieler:in möchte ich, dass der Knopf sich nach 9 Klick-Versuchen hinter
  simulierten Programmfenstern versteckt und danach wieder hervorkommt (Stufe 4),
  damit er noch frecher wirkt.
- Als Spieler:in möchte ich mit der Taste Esc das Spiel sofort beenden und eine
  Meldung mit Stufe und Anzahl Versuche sehen, damit ich jederzeit aufhören kann.
- Als Spieler:in möchte ich mit dem Knopf «Nochmals spielen» alles auf Anfang setzen,
  damit ich eine neue Runde starten kann.
- Als Spieler:in möchte ich oben eine Statuszeile mit Stufe und Anzahl Versuchen sehen,
  damit ich weiss, wo ich stehe und wie ich das Spiel beende.
- Als Spieler:in möchte ich «Erwischt!» sehen, wenn ich den Knopf doch treffe, damit
  ich ein Erfolgserlebnis habe.

## Datenmodell

```
// Objekt: Spielzustand · Zweck: alles, was sich während des Spiels ändert
{
  stufe: 1,            // aktuelle Stufe (1 bis 4)
  versuche: 0,         // Anzahl Klick-Versuche (jeder Mausklick zählt)
  laeuft: true,        // false, sobald Esc gedrückt wurde
  x: 400,              // Position des Knopfs (linke obere Ecke) in Pixeln
  y: 300,
  tempoX: 0,           // Bewegung pro Bild in x-Richtung
  tempoY: 0,           // Bewegung pro Bild in y-Richtung
  versteckt: false     // true, solange der Knopf hinter einem Fenster steckt
}

// Objekt: Stufe · Zweck: Einstellungen pro Schwierigkeitsstufe (Array «stufen» in script.js)
{
  nummer: 2,
  abVersuchen: 3,      // ab so vielen Versuchen gilt diese Stufe
  tempo: 3,            // Fluggeschwindigkeit (0 = steht still)
  fluchtTempo: 9,      // Geschwindigkeit beim Ausweichen
  fluchtAbstand: 150,  // ab diesem Abstand zum Cursor weicht der Knopf aus
  groesse: 1,          // 1 = volle Grösse, 0.6 = 60 %
  text: "Zu langsam!", // Knopftext dieser Stufe
  verstecken: false    // darf sich der Knopf hinter Fenstern verstecken?
}

// Objekt: Fenster · Zweck: simuliertes Programmfenster (Versteck in Stufe 4)
// Steht als HTML in index.html, Position und Grösse in style.css.
// script.js misst die Fenster mit getBoundingClientRect().
{
  titel: "Notizen",
  x: 6,                // Abstand von links in Prozent des Browserfensters
  y: 14,               // Abstand von oben in Prozent
  breite: 240,         // Grösse in Pixeln
  hoehe: 160
}
```

## Datenkarte
| Frage | Meine App |
| --- | --- |
| Welche Daten gibt es? | Spielzustand (Stufe, Versuche, Position, Tempo, läuft/versteckt), die Liste `stufen` mit den Einstellungen und 3 simulierte Fenster. |
| Welche Eingaben braucht es? | Mausbewegung (Cursor-Position), Mausklicks (mousedown), Taste Esc, Klick auf «Nochmals spielen», Grössenänderung des Browserfensters. |
| Welche Entscheidungen werden getroffen? | Ist der Cursor nahe genug, dass der Knopf ausweicht? Welche Stufe gilt bei dieser Anzahl Versuche? Prallt der Knopf an einen Rand? Welches Fenster ist das nächste Versteck? Läuft das Spiel noch? |
| Was wird wiederholt? | Die Bewegungsschleife (requestAnimationFrame, ca. 60× pro Sekunde): Abstand messen, ausweichen oder weiterfliegen, Knopf neu zeichnen. |
| Was ist der Zustand? | Das Objekt `zustand` mit stufe, versuche, laeuft, x, y, tempoX, tempoY, versteckt. |
| Welche Ausgabe entsteht? | Knopf an neuer Position mit Text der Stufe, Statuszeile «Stufe X · Versuche Y · Esc = beenden», «Erwischt!» bei Treffer, Endmeldung «Spiel beendet – Stufe X, Y Versuche». |

## Offene Fragen
Diese Punkte waren in der Idee nicht festgelegt. Ich habe mich (vorerst) so entschieden:

- **Browser-Einschränkung:** Echte Programmfenster sind für eine Webseite unsichtbar, und der
  Knopf kann das Browserfenster nicht verlassen → «Bildschirm» = Browserfenster,
  «Programmfenster» = simulierte Fenster auf der Seite.
- **Was ist ein Klick-Versuch?** Jeder Mausklick (mousedown) auf der Seite zählt, solange das
  Spiel läuft – egal, ob er den Knopf trifft.
- **Was passiert bei einem Treffer?** Ca. 1 Sekunde «Erwischt!»; der Klick zählt als Versuch,
  das Spiel läuft weiter.
- **Zahlen pro Stufe:** Stufe 1 (0–2 Versuche) weicht ab ca. 120 px langsam aus; Stufe 2 (3–5)
  fliegt ständig, prallt an den Rändern ab, weicht ab ca. 150 px schnell aus; Stufe 3 (6–8) wie
  Stufe 2, Knopf ca. 60 % gross (Schrift mind. 12 px); Stufe 4 (ab 9) zusätzlich 3 Fenster.
- **Verstecken:** Der Knopf flüchtet hinter das nächstgelegene Fenster, das nicht unter dem
  Cursor liegt, und schaut nach ca. 1,5 Sekunden wieder hervor.
- **Gibt es ein Ende?** Keine Stufe 5 – Stufe 4 läuft, bis Esc gedrückt wird.
- **«Frecher werden»:** nur der Knopftext wechselt pro Stufe: «Klick mich» → «Zu langsam!» →
  «Wo bin ich?» → «Versteckis!».
- **Statuszeile:** schlicht oben: «Stufe X · Versuche Y · Esc = beenden».
- **Esc / Neustart:** Bewegung stoppt sofort, Endmeldung mit Knopf «Nochmals spielen». Esc bei
  bereits beendetem Spiel macht nichts.
- **Start:** Das Spiel startet direkt beim Laden der Seite.
- **Fenstergrösse:** Der Knopf bleibt immer vollständig im sichtbaren Bereich, auch nach resize.
  Er fliegt nie über die Statuszeile (der Bereich beginnt unterhalb der Statuszeile).
- **Stufe 4 ist sehr schwer:** Bleibt der Cursor nahe, versteckt sich der Knopf nach dem
  Hervorkommen sofort wieder. Das ist so gewollt («frech») – evtl. später eine kurze Pause
  nach dem Hervorkommen einbauen?
- **Speichern:** kein localStorage nötig – nichts muss gespeichert bleiben.

## Nicht im Umfang
*Was die App bewusst NICHT kann – hilft gegen ausufernde KI-Vorschläge.*

- Mehrspieler
- Online-Ranglisten
- Bibliotheken / Frameworks
- Echte Betriebssystem-Fenster (der Knopf versteckt sich nur hinter simulierten Fenstern)
- Bewegung ausserhalb des Browserfensters
- Touch-Bedienung (Handy/Tablet) – nur Maus/Trackpad am Computer
