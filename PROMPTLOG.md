# Prompt-Log

> **Ihr KI-Journal.** Halten Sie hier **jeden** KI-Einsatz fest – kurz, aber ehrlich.
> Das Prompt-Log ist Teil der Bewertung. Am wichtigsten ist die letzte Zeile:
> **Was habe ich selbst geprüft, geändert oder verworfen?**
>
> **Modus:** Browser-Chat · Ask · Inline-Chat · Agent · Cloud-Agent
>
> Diese Datei schreiben Sie selbst – nicht die KI.

## Vorlage (kopieren für jeden neuen Eintrag)

```
### #N · Tag X
Ziel:      Was wollte ich erreichen?
Modus:     Welcher KI-Modus / welches Werkzeug?
Prompt:    (kurz, oder die wichtigste Zeile)
Ergebnis:  Was kam heraus – brauchbar?
Korrektur: Was habe ich geprüft, geändert, verworfen?
```

---

## Einträge

### #1 · Tag 1
Ziel:      Aus meiner Projektidee «Der unklickbare Knopf» einen ausführlichen Prompt für
           Claude Code machen, der zuerst SPEC.md ausfüllt und dann alles selbstständig umsetzt.
Modus:     Browser-Chat (Claude)
Prompt:    «Sieh dir die Daten aus diesem Ordner an. Meine Projektidee: Der unklickbare Knopf …
           Erstelle mir einen umfassenden Prompt, welchen ich Claude Code (in VS Code) geben
           kann. … Zuerst soll Claude Code die SPEC.md ausfüllen.»
Ergebnis:  Brauchbar. Ich habe einen Prompt mit 7 Phasen (je ein Commit) und 10
           Standardentscheidungen bekommen. Claude hat mich auf vier Punkte hingewiesen:
           - Eine Webseite kann sich nicht hinter echten Programmfenstern verstecken. Darum
             gibt es nachgebaute Fenster im Browser.
           - «Alles selbstständig» widerspricht meiner AGENTS.md. Der Prompt hebt das nur für
             diesen Auftrag auf.
           - Meine Idee liess einiges offen: Was zählt als Versuch? Was passiert bei einem
             Treffer? Was kommt nach Stufe 4? Was zeigt Esc an? Touch ja oder nein?
           - «Frecher werden» ist als wechselnder Knopftext ausgelegt. Das ist Claudes Idee,
             nicht meine.
Korrektur: Ich habe die Hinweise gelesen und die Browser-Einschränkung akzeptiert.
           Den Prompt habe ich so übernommen.
           [selbst ergänzen: Standardwerte geprüft oder geändert?]

### #2 · Tag 1
Ziel:      Das ganze Spiel in Phasen umsetzen lassen: SPEC.md, Stufe 1–4, Esc und Neustart.
Modus:     Agent (Claude Code in VS Code)
Prompt:    Der Prompt aus #1: «Auftrag: «Der unklickbare Knopf» – komplett umsetzen …»
Ergebnis:  Das Spiel läuft. Es gibt 7 lokale Commits (nicht gepusht), von «SPEC.md ausgefüllt»
           bis «Aufgeräumt und geprüft». Claude Code hat `node --check` laufen lassen, im
           Browser getestet und die User Stories in einer Tabelle gegen den Code geprüft.
           Abweichungen, die es selbst gemeldet hat:
           - script.js hat 316 statt ca. 250 Zeilen (davon ca. 110 Kommentare und Leerzeilen).
           - Stufe 4 ist praktisch nicht zu gewinnen (als offene Frage in SPEC.md notiert).
           - Die Fenster stehen fest in index.html.
           - Der Knopf fliegt nicht über die Statuszeile.
Korrektur: [selbst ergänzen: Was habe ich in der Live Preview getestet? Hat jede Stufe
           funktioniert? Habe ich Werte im Array `stufen` angepasst? Was habe ich in SPEC.md
           geändert?]
           Die 3 Konzepte für das Erklär-Gespräch muss ich mir noch selbst anschauen:
           requestAnimationFrame, Abstand mit Pythagoras und z-index beim Verstecken.

### #3 · Tag 1
Ziel:      Mein Prompt-Log aus meiner Prompt-Dokumentation (Prompt-Dokumentation.txt) erstellen.
Modus:     Agent (Claude Code in VS Code)
Prompt:    «Im Prompt-Dokument.txt habe ich alle Prompts dokumentiert. Schreibe mir die Datei
           PROMPTLOG.md, als ob ich es gewesen wäre.»
Ergebnis:  Claude Code hat die Einträge #1–#3 aus meiner Dokumentation geschrieben.
Korrektur: [selbst ergänzen: Einträge gelesen und auf Richtigkeit geprüft? Was angepasst?]
