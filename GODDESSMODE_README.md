# GODDESSMODE+ und 18+ Features

## 🔞 Altersverifikation (18+)

### Funktionsweise
Beim ersten Besuch der YONI-App erscheint ein Altersverifikations-Modal:
- **"Ja, ich bin 18+"** - Gewährt Zugang zur App und speichert die Bestätigung
- **"Nein"** - Zeigt eine Warnung, dass die App nur für Erwachsene ist

### Technische Details
- Die Bestätigung wird in `localStorage` unter dem Schlüssel `yoni-age-verified` gespeichert
- Bei erneutem Besuch wird die gespeicherte Bestätigung geladen
- Zum Zurücksetzen: `localStorage.removeItem('yoni-age-verified')` in der Browser-Konsole

---

## ✨ GODDESSMODE+

### Was ist GODDESSMODE+?
GODDESSMODE+ ist ein erweiterter visueller Modus, der die "Überhochglitzer"-Ästhetik der YONI-App intensiviert. Er aktiviert zusätzliche Animationen, Farbverläufe und kosmische Effekte für ein immersiveres Erlebnis.

### Aktivierung
1. Bestätige die Altersverifikation
2. Klicke auf den **"🌙 GODDESSMODE+"** Button in der oberen rechten Ecke
3. Der Button ändert sich zu **"✨ GODDESSMODE+"** und die Effekte werden aktiviert
4. Erneutes Klicken deaktiviert den Modus

### Visuelle Effekte

#### Im Normalmodus (🌙)
- Dunkler kosmischer Hintergrund
- Dezente Panelhintergründe
- Standard-Button-Farben (Violett)
- Minimale Schatten und Glows

#### Im GODDESSMODE+ (✨)
- **Hintergrund**: Intensivierte kosmische Gradienten mit Farbanimation
- **Karten/Cards**: Animierte Amethyst-zu-Gold-Verläufe
- **Überschriften**: Schimmernde Text-Effekte mit Farbverlauf
- **Buttons**: Pulsierender goldener Glow mit Shine-Effekt
- **Eingabefelder**: Amethyst-Rahmen mit goldenem Focus-Glow
- **Feed-Items**: Sanfte Glow-Animation

### Persistenz
Der GODDESSMODE-Status wird in `localStorage` unter `yoni-goddessmode` gespeichert und bleibt über Browser-Sitzungen hinweg aktiv.

### Deaktivierung
- Klicke erneut auf den Button
- Oder in der Konsole: `localStorage.removeItem('yoni-goddessmode')`

---

## 🎨 CSS-Klassen

GODDESSMODE+ funktioniert über die Body-Klasse `goddessmode-active`:

```css
body.goddessmode-active {
  /* Intensivierte Effekte */
}
```

Alle speziellen Animationen und Styles sind in `app/globals.css` definiert.

---

## 🔧 Für Entwickler:innen

### Neue Komponenten
- `app/components/AgeVerification.tsx` - Altersverifikation
- `app/components/GoddessMode.tsx` - GODDESSMODE+ Toggle

### Integration in eigene Seiten
```tsx
import AgeVerification from './components/AgeVerification'
import GoddessMode from './components/GoddessMode'

function MyPage() {
  const [ageVerified, setAgeVerified] = useState(false)

  return (
    <>
      {!ageVerified && <AgeVerification onVerified={() => setAgeVerified(true)} />}
      {ageVerified && <GoddessMode />}
      {/* Dein Content */}
    </>
  )
}
```

### CSS-Anpassungen
Eigene Elemente können GODDESSMODE+-Styles nutzen:

```css
/* Dein Element im Normalmodus */
.my-element {
  background: rgba(255, 255, 255, 0.1);
}

/* Dein Element im GODDESSMODE+ */
body.goddessmode-active .my-element {
  background: linear-gradient(135deg, var(--brand-amethyst), var(--hl-gold));
  animation: cosmic-pulse 2s infinite;
}
```

---

## 🌟 Design-Token

Relevante CSS-Variablen:
- `--brand-amethyst`: #9966CC (Hauptfarbe)
- `--hl-gold`: #FFD700 (Akzentfarbe)
- `--ok-emerald`: #2ECC71 (Positiv-Farbe)
- `--text-starwhite`: #F5F5F5 (Textfarbe)

Animationsdauern:
- `--anim-sparkle-duration`: 2.5s
- `--anim-shimmer-duration`: 3s
- `--anim-glow-duration`: 2s
- `--anim-pulse-duration`: 1.5s

---

## ♿ Barrierefreiheit

- Beide Features sind vollständig mit Tastatur bedienbar
- GODDESSMODE+ ist optional und kann deaktiviert werden
- Alle Animationen respektieren `prefers-reduced-motion` (in zukünftigen Versionen)
- Kontrastverhältnisse bleiben in beiden Modi WCAG-konform

---

## 🐛 Bekannte Einschränkungen

1. **Hydration Warning**: In Next.js Dev-Modus kann eine Hydration-Warnung auftreten, wenn localStorage-Daten beim initialen Rendering nicht verfügbar sind. Dies ist im Production-Build nicht vorhanden.

2. **Browser-Support**: LocalStorage wird vorausgesetzt. In Privacy-Modi einiger Browser können Einstellungen nicht persistiert werden.

---

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues: https://github.com/pappensex/YONI-app/issues
- E-Mail: yoni@pihoch2.me
