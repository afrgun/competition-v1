# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Vibe Coding Competition** project built with Next.js (App Router), TypeScript, and Tailwind CSS. The architecture follows **Clean Architecture** (Uncle Bob) adapted for frontend development, with **Atomic Design** principles for component structure.

The project uses a **Speckit Workflow** methodology where each feature is documented in a single markdown file (`speckit.[feature-name].md`) containing Specify, Plan, Tasks, and Implement sections.

## Architecture

### Clean Architecture Layers

The codebase follows strict unidirectional dependency flow:
`domain → usecases → infrastructure → presentation`

**Critical Rules:**
- `presentation` layer MUST NOT directly call `infrastructure`
- All backend communication must go through `usecases`
- Domain layer has ZERO external dependencies (pure TypeScript)
- Use `index.ts` for re-exports in each folder

### Folder Structure

```
src/
├─ domain/              # Pure entities & interfaces (no dependencies)
├─ usecases/            # Application logic (interactors)
├─ infrastructure/      # API services, repositories, external integrations
├─ presentation/        # UI components (Atomic Design)
│  ├─ components/
│  │  ├─ atoms/         # Button, Input, Text, Loader
│  │  ├─ molecules/     # FormField, Card, NavItem
│  │  └─ organisms/     # LoginForm, DashboardGrid, HeroSection
│  └─ layouts/          # AuthLayout, MainLayout
├─ app/                 # Next.js App Router (page.tsx, layout.tsx)
│  ├─ (auth)/           # Auth routes (login, register)
│  └─ (dashboard)/      # Private routes
└─ shared/              # Utils, constants, config, types
```

### Data Mapping Pattern

When integrating with backend APIs:
1. Define clean domain entities in `domain/entities/`
2. Create mappers in `infrastructure/` to transform API responses to domain entities
3. Keep domain entities stable even when API contracts change
4. Only update infrastructure layer when API changes

Example:
```ts
// Domain stays clean
export interface User {
  id: string;
  fullName: string;
  email: string;
  accessToken: string;
}

// Infrastructure handles API mapping
export const mapUserResponse = (data: any): User => ({
  id: data.id,
  fullName: data.fullname,
  email: data.email,
  accessToken: data.access_token,
});
```

## Speckit Workflow

All features follow a structured development process documented in `speckit/speckit.[feature-name].md`:

1. **Specify** — Define feature goals and acceptance criteria
2. **Plan** — Determine components, services, and data flow
3. **Tasks** — Create implementation checklist
4. **Implement** — Execute development

When implementing a feature:
- Read the corresponding speckit file first
- Follow the Tasks checklist in order
- Update the checklist as you complete items
- Add revision notes in the speckit file for significant changes

## Development Commands

Since the project is in early setup phase, standard Next.js commands apply:

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests (Jest + React Testing Library)
```

## Testing Requirements

- Framework: Jest + React Testing Library
- Minimum coverage: 60%
- Required tests:
  - Critical components (Button, Input, Form)
  - Usecase logic
  - API integration calls

Component test pattern:
```
src/presentation/components/atoms/Button/
├─ Button.tsx
├─ Button.test.tsx
├─ Button.stories.tsx
└─ index.ts
```

## Code Conventions

- **Formatter:** Prettier Standard
- **Naming:**
  - Components & folders → PascalCase
  - Functions, variables → camelCase
- Avoid `any` type
- Use async/await with explicit return types
- No console.log in production
- No inline styles (use Tailwind classes)

## UI/UX Standards

- Mobile-first responsive design
- Pixel-perfect implementation matching Figma designs
- Consistent colors and spacing via Tailwind config
- Support for dark/light mode if enabled
- All components must follow Atomic Design hierarchy

## Deployment

- Target platforms: Vercel / Netlify
- Ensure `npm run build` completes without errors
- Never commit `.env` files
- Use `NEXT_PUBLIC_` prefix for client-exposed environment variables

## Important Files

- `speckit/constitution.md` — Project constitution and architecture rules
- `speckit/speckit.login.md` — Example feature specification (login functionality)
- Each speckit file includes revision logs for tracking changes
