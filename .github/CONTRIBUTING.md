# Contributing to Simplified Mojang API

Thanks for your interest in contributing! Bug reports, feature ideas and pull requests are all welcome.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug:** open an issue with the [Bug report](https://github.com/HaJuegos/simplified-mojang-API/issues/new?template=bug.yml) template.
- **Suggest a feature:** open an issue with the [Feature request](https://github.com/HaJuegos/simplified-mojang-API/issues/new?template=feature_rqs.yml) template.
- **Wrap a new Mojang method or event:** open a pull request.
- **Report a vulnerability:** see [SECURITY.md](SECURITY.md). Do not open a public issue.

Before opening an issue, search the existing ones to avoid duplicates.

## Development setup

Requirements: Node.js 24+ and npm or pnpm.

```bash
git clone https://github.com/HaJuegos/simplified-mojang-API.git
cd simplified-mojang-API
npm install --legacy-peer-deps
npm run build
```

## Project structure

```text
src/
 ┣ core/     Base utilities: types, error handler, events manager
 ┣ events/   Simplified wrappers (after/before events, world tools, debug, fake players, custom tools)
 ┗ index.ts  Public exports
```

Anything new that should be public must be exported from `src/index.ts`.

## Pull request guidelines

1. Fork the repository and create a branch from `main` (e.g. `feat/new-event` or `fix/timer-reset`).
2. Keep each PR focused on a single change.
3. Make sure `npm run build` passes with no TypeScript errors.
4. Reuse the existing error handler (`src/core/errorHandler.ts`) instead of adding ad-hoc `try/catch` logging.
5. Add or update usage examples in the README when you add a public method.
6. Update the `[Unreleased]` section of [CHANGELOG.md](CHANGELOG.md).
7. Describe **what** changed and **why** in the PR description.

## Code style

- TypeScript, strongly typed. Avoid `any`.
- Prefer small, composable methods over large ones.
- Code comments are written in **Spanish**. Please keep comments in Spanish for consistency. Identifiers, docs and commit messages stay in English.
- Match the formatting of the surrounding code.

## Commit messages

Use short, imperative messages. [Conventional Commits](https://www.conventionalcommits.org/) are encouraged:

```text
feat: add fastItemsSystem filter option
fix: reset timer correctly when forceRestart is true
docs: update README examples
```

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE.md).
