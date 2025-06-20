# Using Amazon Q CLI to Build the Kiwi Maze Escape Game

This guide shows how Amazon Q Developer CLI was used to create the Kiwi Maze Escape game, including setup, prompts, and practical usage.

---

## 🛠 Prerequisites

* AWS Builder ID (free)
* Amazon Q CLI installed
* Terminal access (e.g., Bash, zsh)
* Project folder (e.g., `q-kiwi-maze-game/`)

---

## 🚪 Step 1: Log in to Amazon Q CLI

```sh
q login
```

You’ll be prompted to choose a login method. Select:

```sh
❯ Use for Free with Builder ID
```

You’ll receive a one-time code and browser URL. Paste the code and follow the instructions. Once authenticated, you’ll see:

```sh
Device authorized
Logged in successfully
```

---

## 💬 Step 2: Start a Chat Session

```sh
q chat
```

Paste your game specification (see [`kiwi-maze-spec.md`](./kiwi-maze-spec.md)).

Provide clear and structured instructions — this helps Q generate better results. You can iterate as needed.

Example prompt:

> Create a maze game in HTML, CSS, and JavaScript where a kiwi moves using arrow keys. Use canvas. Must be offline-compatible and deployable to GitHub Pages.

Q will generate:

* `index.html`
* `style.css`
* `script.js`

---

## ✅ Final Notes

Once files are generated:

* Test in browser
* Refine styling or logic as needed
* Use `q chat` again to request updates
* Commit to GitHub and enable Pages

For reference spec, see: [`docs/kiwi-maze-spec.md`](./kiwi-maze-spec.md)
