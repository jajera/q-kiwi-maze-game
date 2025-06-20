# Kiwi Maze Escape – Game Specification

Create a simple HTML5 browser game where a kiwi bird navigates a maze using arrow keys. This game must run fully in-browser with no backend and be compatible with GitHub Pages.

---

## 🎮 Game Description

Design a maze game where the player controls a kiwi bird using the keyboard to reach a goal tile. The game should render using the HTML5 canvas API and work in all modern browsers without requiring any dependencies.

---

## 🧠 Game Logic

* Grid-based maze (e.g., 10x10 or 12x12 cells)
* One controllable player (kiwi icon)
* Static maze walls and one goal location
* Player can move using arrow keys (up, down, left, right)
* Cannot pass through walls
* Detect when kiwi reaches goal → display win message
* Optional: track number of moves
* Game restarts with a new maze (predefined or randomized)

---

## 🎨 Visual Style (Kiwi / NZ Theme)

* Use emoji or sprite for the kiwi (e.g., 🥝 or small kiwi PNG)
* Maze walls in flax brown or stone gray
* Path tiles in soft green
* Goal tile: glowing koru symbol or NZ flag
* Background: light sky blue or forest tone
* Font: Poppins or Comic Neue
* Keep overall style playful and inviting

---

## 🔊 Optional Audio Feedback (No external files)

* Web Audio API:

  * Move: short tone (e.g., 300Hz)
  * Wall collision: low error buzz (e.g., 150Hz)
  * Goal reached: success chime (e.g., 900Hz)

---

## ♿ Accessibility Requirements

* Game must support keyboard-only navigation
* Clear color contrast between walls and paths
* Canvas should be labeled with ARIA (`role="application"`, `aria-label="Maze game"`)
* Instructions shown before start (e.g., "Use arrow keys to move the kiwi")

---

## 🔐 Security & Compatibility

* Pure HTML, CSS, and JavaScript only
* No external libraries or CDNs
* No inline JavaScript in HTML
* Loads entirely from `index.html`
* Works when opened from file system or GitHub Pages

---

## ✅ Output Requirements

* Files:

  * `index.html`
  * `style.css`
  * `script.js`
* Self-contained, single-level directory
* No build tools or external packages required
* Works on first load, offline-compatible
* Well-commented code for game logic and rendering
