# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript compile + Vite production build
npm run lint      # ESLint (TypeScript strict rules)
npm run preview   # Preview production build locally
```

There are no tests.

## Architecture

This is Andy McDowall's interactive portfolio — a React 19 + TypeScript SPA (Vite, Tailwind CSS v4, Framer Motion).

**Core concept:** On load, `ComponentRoulette` runs a slot-machine animation cycling through resume themes, then settles on one of the "still" (high-quality) components. Clicking the `EverythingEverywhereButton` resets the roulette by remounting it via a `key` increment.

**Data flow:**
- All resume content lives in `src/components/personalInfo.ts` as `andyPersonalInfo`, typed by `src/types.ts` (`PersonalInfo`, `WorkExperience`, `Project`, etc.)
- Every resume theme receives `personalInfo: PersonalInfo` as its sole prop
- Themes are free to use or ignore any fields

**Component organization:**
- `src/components/Resume/` — standalone themed resumes (each is self-contained with inline Tailwind styles)
- `src/components/TronTheme/` — the Tron resume is split into sub-components (`SidebarLayout`, `TronBackground`, `SkillBar`, `Chip`, cards per section), composed in `TronResume.tsx`
- `src/components/ComponentRoulette.tsx` — slot-machine orchestrator; `spinningComponents` cycles during spin, `stillComponents` are candidates after it stops
- `src/components/EverythingEverywhereButton.tsx` — the spin trigger button with particle/explosion effects
- `src/useWindowSize.tsx` — custom hook for responsive breakpoints

**Adding a new resume theme:**
1. Create `src/components/Resume/MyThemeResume.tsx` accepting `{ personalInfo: PersonalInfo }`
2. Import and add it to the `componentsToSpin` or `stillComponents` array in `App.tsx`

**TypeScript notes:** `strict`, `noUnusedLocals`, and `noUnusedParameters` are all enabled. The `education` field in `PersonalInfo` uses literal types (hardcoded strings/numbers), not generics — this is intentional.
