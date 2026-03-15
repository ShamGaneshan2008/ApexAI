# APEX.AI — Resume Builder

An AI-powered resume builder with login, onboarding, chat, live preview, and Word/PDF export. Built with vanilla HTML, CSS, and JavaScript — **no build tools, no npm, no framework**.

> 💡 **Quick start:** `python serve.py` — opens the app at http://localhost:8080 automatically.

## Project Structure

```
apex-resume/
├── index.html          ← Entry point — links all CSS and JS
├── css/
│   ├── theme.css       ← CSS variables (colours, fonts, shadows)
│   ├── layout.css      ← Shell, topbar, sidebar, chat, preview panels
│   ├── components.css  ← Buttons, inputs, messages, chips, toast
│   └── login.css       ← Login page styles
├── js/
│   ├── config.js       ← Users, AI system prompt, onboarding steps, quick actions
│   ├── helpers.js      ← Utility functions (esc, buildCtx, parseResume, formatMsg)
│   ├── docx.js         ← Word (.docx) and HTML-to-PDF export
│   ├── render.js       ← HTML-string render functions (login, onboarding, app)
│   └── app.js          ← State, event handlers, API call, boot
└── README.md
```

## How to Run

Just open `index.html` in any browser — no server needed.

```bash
# Option 1: double-click index.html
# Option 2: serve locally
npx serve .
# or
python -m http.server 8080
```

## How to Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to **Settings → Pages → Source → main branch / root**
3. Your app will be live at `https://<username>.github.io/<repo>/`

## Accounts

Edit the `USERS` array in `js/config.js`:

| Username | Password     | Role          |
|----------|--------------|---------------|
| admin    | apex2024     | Administrator |
| wrench   | resume123    | Pro User      |
| demo     | demo         | Free Plan     |

> **Note:** Passwords are stored in plain text in `config.js`. This is fine for a demo/portfolio project. For production, use a backend with proper auth (bcrypt, JWT, etc.).

## Features

- 🔐 **Login page** — username/password auth with shake animation and error messages
- 📋 **5-step onboarding form** — collects all career details before building
- 💬 **AI Chat** — powered by Claude (Anthropic API), full conversation history
- 📄 **Resume Preview** — live formatted resume that updates after each build
- 📥 **Word Export** — downloads a real `.docx` file (proper XML, Calibri font, blue headings)
- 🖨️ **PDF Export** — downloads a print-ready `.html` file → open → Ctrl+P → Save as PDF
- 📊 **Resume Score** — AI scores your resume out of 100
- 🔄 **Sign Out** — clears all state and returns to login

## Changing the Theme

All colours live in `css/theme.css` inside `:root { }`. Change the values there to retheme the entire app.

## API Key

The app calls the Anthropic API via `fetch` directly from the browser. Claude.ai's built-in API proxy handles auth automatically when used inside Claude artifacts. For standalone deployment, you'll need to add your API key:

In `js/app.js`, find the `fetch` call and add the header:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY_HERE',
  'anthropic-version': '2023-06-01',
},
```

## How to Run

**Option 1 — Python server (recommended, auto-opens browser):**
```bash
python serve.py
```

**Option 2 — Just open the file:**
Double-click `index.html` in any browser (no server needed).

**Option 3 — Any static server:**
```bash
npx serve .
# or
python -m http.server 8080
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. **Settings → Pages → Source → main branch / root**
3. Live at `https://<username>.github.io/<repo>/`

## Accounts

Edit the `USERS` array in `js/config.js`:

| Username | Password     | Role          |
|----------|--------------|---------------|
| admin    | apex2024     | Administrator |
| wrench   | resume123    | Pro User      |
| demo     | demo         | Free Plan     |

> Passwords are plain text — fine for demo/portfolio. Use a proper auth backend for production.

## Customisation

| File | What to edit |
|------|-------------|
| `css/theme.css` | Colours, fonts, shadows |
| `js/config.js` | Users, AI system prompt, onboarding fields, quick actions |
| `js/app.js` | Add your Anthropic API key for standalone deployment |

## API Key (standalone deployment)

Add your key in `js/app.js` inside the `fetch` call:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY_HERE',
  'anthropic-version': '2023-06-01',
},
```
