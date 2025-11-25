# Vibe Coding Competition

A modern web application built with Next.js, TypeScript, and Tailwind CSS following Clean Architecture principles and Atomic Design patterns.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Conventions](#code-conventions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

This project is built for the Vibe Coding Competition, implementing a scalable frontend architecture that follows Uncle Bob's Clean Architecture principles adapted for React/Next.js applications. The codebase emphasizes separation of concerns, testability, and maintainability through strict architectural boundaries.

### Key Features

- **Clean Architecture** - Unidirectional dependency flow ensuring maintainable code
- **Atomic Design** - Structured component hierarchy (atoms → molecules → organisms)
- **Speckit Workflow** - Feature development methodology with comprehensive documentation
- **Type-Safe** - Full TypeScript implementation
- **Tested** - Jest + React Testing Library with 60% minimum coverage
- **Responsive** - Mobile-first design approach

## Architecture

### Clean Architecture Layers

The application follows strict unidirectional dependency flow:

```
domain → usecases → infrastructure → presentation
```

**Critical Architectural Rules:**

- `presentation` layer MUST NOT directly call `infrastructure`
- All backend communication flows through `usecases`
- `domain` layer has ZERO external dependencies (pure TypeScript)
- Each layer uses `index.ts` for clean re-exports

### Data Flow

```
UI Component → UseCase → Repository (Infrastructure) → API
                ↓
            Domain Entity
```

### Layer Responsibilities

| Layer            | Responsibility                           | Dependencies       |
| ---------------- | ---------------------------------------- | ------------------ |
| **Domain**       | Business entities and interfaces         | None               |
| **UseCases**     | Application business logic               | Domain only        |
| **Infrastructure** | API calls, external services           | Domain, UseCases   |
| **Presentation** | UI components, layouts                   | Domain, UseCases   |

## Tech Stack

**Core:**
- [Next.js 15](https://nextjs.org/) - React framework with Page Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

**Testing:**
- [Jest](https://jestjs.io/) - Testing framework
- [React Testing Library](https://testing-library.com/react) - Component testing

**Code Quality:**
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting

**Additional:**
- [@heroicons/react](https://heroicons.com/) - Icon library
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd competition-v1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration. Use `NEXT_PUBLIC_` prefix for client-exposed variables.

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start development server             |
| `npm run build`   | Create production build              |
| `npm run start`   | Start production server              |
| `npm run lint`    | Run ESLint                           |
| `npm test`        | Run test suite                       |
| `npm run test:watch` | Run tests in watch mode           |

## Project Structure

```
competition-v1/
├── pages/                      # Next.js Page Router
│   ├── _app.tsx                # App wrapper
│   ├── _document.tsx           # HTML document structure
│   ├── index.tsx               # Home page
│   ├── about.tsx               # About page
│   ├── login.tsx               # Login page
│   ├── register.tsx            # Register page
│   └── dashboard/              # Dashboard routes
│       ├── index.tsx           # Dashboard home
│       ├── tickets.tsx         # All tickets
│       ├── tickets/[id].tsx    # Ticket detail
│       ├── my-ticket.tsx       # My tickets
│       └── my-ticket/[id].tsx  # My ticket detail
│
├── app/                        # Global styles
│   └── globals.css             # Global CSS
│
├── domain/                     # Business entities & interfaces
│   ├── entities/               # Pure domain models
│   └── repositories/           # Repository interfaces
│
├── usecases/                   # Application business logic
│   └── [feature]/              # Use case implementations
│
├── infrastructure/             # External integrations
│   ├── api/                    # API client services
│   ├── repositories/           # Repository implementations
│   └── mappers/                # DTO to entity mappers
│
├── presentation/               # UI layer
│   ├── components/
│   │   ├── atoms/              # Basic UI elements (Button, Input)
│   │   ├── molecules/          # Component combinations (FormField, Card)
│   │   └── organisms/          # Complex components (LoginForm, Header)
│   └── layouts/                # Page layouts (AuthLayout, DashboardLayout)
│
├── shared/                     # Shared utilities
│   ├── config/                 # App configuration
│   ├── constants/              # Constants
│   ├── types/                  # Shared types
│   └── utils/                  # Helper functions
│
├── speckit/                    # Feature specifications
│   ├── constitution.md         # Architecture rules
│   └── speckit.[feature].md    # Feature documentation
│
└── public/                     # Static assets
```

## Development Workflow

This project uses the **Speckit Workflow** methodology for structured feature development.

### Speckit Process

Every feature follows this workflow documented in `speckit/speckit.[feature-name].md`:

1. **Specify** - Define feature goals, user stories, and acceptance criteria
2. **Plan** - Design components, services, and data flow
3. **Tasks** - Create detailed implementation checklist
4. **Implement** - Execute development following the tasks

### Example Workflow

```bash
# 1. Read the feature specification
cat speckit/speckit.login.md

# 2. Implement following the task checklist
# 3. Update checklist as you complete tasks
# 4. Add revision notes for significant changes
```

### Data Mapping Pattern

When integrating with backend APIs:

```typescript
// 1. Define clean domain entity (domain/entities/User.ts)
export interface User {
  id: string;
  fullName: string;
  email: string;
}

// 2. Create mapper (infrastructure/mappers/userMapper.ts)
export const mapUserResponse = (data: ApiUserResponse): User => ({
  id: data.id,
  fullName: data.fullname,  // Map API field names
  email: data.email,
});

// 3. Use in repository (infrastructure/repositories/UserRepository.ts)
async getUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return mapUserResponse(response.data);
}
```

## Code Conventions

### Naming Conventions

- **Components & Folders:** PascalCase (`Button.tsx`, `UserProfile/`)
- **Functions & Variables:** camelCase (`getUserData`, `isAuthenticated`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Types & Interfaces:** PascalCase with descriptive names

### TypeScript Standards

- Avoid `any` type - use `unknown` or proper typing
- Use async/await with explicit return types
- Prefer interfaces over types for object shapes
- Use type guards for runtime type checking

### React/Next.js Standards

- Use functional components with hooks
- Prefer named exports for components
- No inline styles - use Tailwind classes only
- Extract reusable logic into custom hooks

### File Organization

Each component should follow this structure:

```
ComponentName/
├── ComponentName.tsx           # Component implementation
├── ComponentName.test.tsx      # Unit tests
├── ComponentName.stories.tsx   # Storybook (optional)
└── index.ts                    # Re-export
```

### Formatting

- **Tool:** Prettier (Standard configuration)
- **Line length:** 80 characters recommended
- **No semicolons:** Prettier standard
- **Single quotes:** For strings

## Testing

### Testing Requirements

- **Minimum coverage:** 60%
- **Framework:** Jest + React Testing Library
- **Test location:** Co-located with components (`*.test.tsx`)

### What to Test

**Required:**
- Critical components (Button, Input, Form elements)
- All use case logic
- API integration calls
- User interactions and event handlers

**Test Pattern:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Deployment

### Deployment Platforms

- **Recommended:** Vercel, Netlify
- **Alternative:** Docker, AWS, Google Cloud

### Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] No `.env` files committed
- [ ] ESLint warnings resolved (`npm run lint`)

### Environment Variables

Create `.env.local` for local development:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.example.com

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# Analytics (example)
NEXT_PUBLIC_GA_ID=UA-XXXXX-X
```

**Important:**
- Never commit `.env` files to version control
- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Server-only variables should NOT have the prefix

## Contributing

### Development Guidelines

1. **Read the Speckit:** Check `speckit/` folder for feature specifications
2. **Follow Architecture:** Respect Clean Architecture boundaries
3. **Write Tests:** Maintain minimum 60% coverage
4. **Code Review:** Ensure all CI checks pass
5. **Documentation:** Update speckit files for significant changes

### Branch Strategy

```bash
# Feature branches
git checkout -b feature/user-authentication

# Bug fixes
git checkout -b fix/login-validation

# Hotfixes
git checkout -b hotfix/security-patch
```

### Commit Messages

Follow conventional commits:

```
feat: add user registration form
fix: resolve login token expiration issue
docs: update API integration guide
test: add tests for authentication flow
refactor: simplify user mapper logic
```

## Important Files

- `CLAUDE.md` - AI assistant guidance for development
- `speckit/constitution.md` - Project constitution and architecture rules
- `speckit/speckit.login.md` - Example feature specification

## License

[Add your license here]

## Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Check `speckit/` documentation for architecture questions

---

Built with precision and care for the Vibe Coding Competition.
