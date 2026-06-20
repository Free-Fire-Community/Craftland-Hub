# Contributing to Craftland Hub

Thanks for your interest in contributing! This guide covers how to set up the project, the workflow we use, and the conventions we follow.

## Code of Conduct

Be respectful and constructive. Harassment, discrimination, or abusive behavior of any kind is not tolerated.

## Ways to Contribute

- Report bugs or request features using the [issue templates](./.github/ISSUE_TEMPLATE).
- Improve documentation.
- Fix bugs or implement features from open issues.
- Add or improve translations under `messages/`.

If you plan a large change, open an issue first to discuss it so effort isn't wasted.

## Development Setup

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/craftland-hub.git
   cd craftland-hub
   npm install
   ```
2. Copy the environment template and fill in your own values:
   ```bash
   cp .env.example .env.local
   ```
   You will need your own Firebase project (Firestore + Authentication) and a value for `MAP_API_BASE_URL`. See the [README](./README.md#environment-variables) for details.
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The app runs on http://localhost:9002.

## Branching & Commits

- Create a feature branch off `main`:
  ```bash
  git checkout -b feat/short-description
  ```
- Use clear, descriptive commit messages. We recommend [Conventional Commits](https://www.conventionalcommits.org/) prefixes:
  - `feat:` a new feature
  - `fix:` a bug fix
  - `docs:` documentation only
  - `refactor:` code change that neither fixes a bug nor adds a feature
  - `chore:` tooling, deps, or maintenance
- Keep commits focused. One logical change per commit where practical.

## Before You Open a Pull Request

Run these locally and make sure they pass:

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run build       # Production build
```

Checklist:

- [ ] Code is linted and type-checks cleanly.
- [ ] The production build succeeds.
- [ ] New UI text is added to all locale files in `messages/` (or noted in the PR if not).
- [ ] No secrets, credentials, or `.env*` files are committed.
- [ ] Documentation is updated if behavior or setup changed.

## Pull Request Guidelines

- Target the `main` branch and push your feature branch to your fork.
- Give the PR a concise title (ideally with a Conventional Commits prefix).
- In the description, explain **what** changed and **why**, link any related issues, and note what you tested.
- Keep PRs reasonably small and scoped; split unrelated changes into separate PRs.
- Be responsive to review feedback.

## Coding Conventions

- **Language**: TypeScript throughout. Prefer explicit types on exported functions and module boundaries.
- **Components**: Functional React components. Reuse the shadcn/ui primitives in `src/components/ui` rather than introducing new UI libraries.
- **Styling**: Tailwind CSS utility classes; follow existing patterns.
- **Server-only secrets**: Never expose secrets to the client. Only values that are safe to be public may use the `NEXT_PUBLIC_` prefix.
- **API routes**: Keep the existing security checks (rate limiting, request-size validation, input validation) when adding or modifying endpoints.
- **i18n**: User-facing strings go through `next-intl`; add keys to every file in `messages/`.

## Security

Do not open public issues for security vulnerabilities. Follow the process in [SECURITY.md](./SECURITY.md) for responsible disclosure.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
