# Copilot Instructions for Xmoll

Xmoll is a musical interval ear-training web app. Users select which intervals to practice, then identify randomly played intervals by ear. The UI is in German (Swiss German locale `de-CH`).

## Commands

- `bun install` — install dependencies
- `bun run build` — production build (esbuild + SCSS → `build/`)
- `bun run build --serve` — dev server with live reload
- `bun test` — run all tests (Bun's built-in test runner)
- `bun test src/scripts/Note.test.ts` — run a single test file
- `bun run lint` — lint with Biome
- `bun run lint:fix` — auto-fix lint issues
- `bun run format` — format with Biome
- `bun run typecheck` — TypeScript type checking (`tsc --noEmit`)

## Architecture

**Build pipeline**: `build.mjs` uses esbuild to bundle three entry points (`src/index.ts`, `src/router.ts`, `src/styles/index.scss`). SCSS is processed through PostCSS with autoprefixer. HTML and audio files are copied to `build/`.

**UI framework**: [Hotwired Stimulus](https://stimulus.hotwired.dev/) controllers bound via `data-controller`, `data-action`, and `data-{controller}-target` HTML attributes. Controllers are registered in `src/scripts/stimulus.ts`. UI state is communicated through CSS class toggling (e.g., `"success"`, `"failure"`, `"pending"`), not DOM manipulation.

**Domain model** (`src/scripts/`):
- `Note` — a musical note identified by sequential index (C0=0, C#0=1, ..., 12 per octave). Uses German notation where B = H.
- `AbsoluteInterval` — an immutable pair of Notes. Distance measured in cents (100 cents = 1 semitone).
- `GameState` — holds selected intervals, round count, exam mode flag, and append-only history of played/answered intervals. All domain objects implement `toJson()`/`fromJson()` for localStorage persistence.
- `Game` — orchestrator that owns the AudioContext, loads Grand Piano samples via Web Audio API, manages game flow, and persists state to localStorage. Singleton accessed via `window.currentGame`.

**Controllers** (`src/scripts/controllers/`):
- `MainMenuController` — game setup form, extracts config from checkboxes/radios, starts game
- `GameController` — game loop UI, handles answer selection, progress bar, audio replay
- `SwitchButtonController` — reusable custom toggle

**Styles** (`src/styles/`): SCSS with Bootstrap 5 as base. Component styles split into partials (`_button.scss`, `_panel.scss`, etc.).

## Conventions

- **`SemitoneDistance` type**: Intervals are represented as cent values (`0 | 100 | 200 | ... | 1200`). Checkbox values in HTML use hyphens for ranges (e.g., `"100-200"` means minor+major second).
- **`[Symbol.toPrimitive]`**: `Note` and `AbsoluteInterval` implement this for numeric comparison and string display.
- **Serialization pattern**: Domain objects use `toJson()`/`fromJson()` pairs. `Infinity` is serialized as the string `"Infinity"`.
- **Audio playback**: Lower note plays first, 1-second pause, then upper note. Uses promise-based flow coordinated with CSS animations.
- **Tests**: Only domain model classes (`Note`, `GameState`) have unit tests using `bun:test`. No controller or integration tests.
