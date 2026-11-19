# Leonida Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/rezimx-btc/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/rezimx-btc/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Turn your photo into GTA-style poster cover art. Leonida Cover Studio is a
static web app: load your own photo into each panel, crop and position it,
pick a multi-panel layout, a Vice City colour grade and a post size, edit the
bold caption, and export a PNG to share. Nothing is uploaded — photos stay on
your machine.

## Run it

```sh
npx serve app
```

Then open http://localhost:3000 in desktop Chrome. Or serve `app/` with any
static file server and open `index.html`.

## How it works

- `app/index.html` — the editor page (preview canvas + controls).
- `app/style.css` — the dark neon editor styling.
- `app/src/cover.js` — the cover renderer: multi-panel layouts, colour
  grades, procedural sample scenes and bold poster lettering, all drawn on
  canvas.
- `app/src/main.js` — editor wiring: photo loading, crop sliders, layout /
  grade / size choices, live preview and PNG export.
- `main.ts` — the make.fun entrypoint: copies `app/` and `screenshots/` to
  the output directory and writes `dossier.json` with `buildDossier`.

## Export sizes

1080 × 1080, 1080 × 1350 and 1920 × 1080. Grades: Sunset, Neon night,
Palm dusk and Ink. Layouts: Hero + 2, Triple, Grid 2×2 and Full bleed.

## Screenshots

`screenshots/` holds the cover the app exported and the editor at work.
The sample photos in them are scenes the app draws itself — no Rockstar
Games logos, artwork or fonts are used anywhere in this entry.

---

<sub>Entered on [make.fun](https://make.fun/?ref=nht78ayn&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>

## Try it in 30 seconds

1. Click **Load sample photo** — the editor fills every panel with a
   sunset scene the app drew itself.
2. Pick **Neon night** and the **1080 × 1350** size.
3. Change the bottom caption, then click **Export PNG**.
