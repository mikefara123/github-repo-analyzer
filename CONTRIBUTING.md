# Contributing to GitHub Repository Analyzer

Thank you for considering contributing to GitHub Repository Analyzer! This document outlines the process for contributing to the project and provides guidelines to ensure a smooth collaboration.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the issue, and find related reports.

Before creating bug reports, please check [the issue tracker](https://github.com/yourusername/github-repo-analyzer/issues) to see if the problem has already been reported.

**How Do I Submit A Good Bug Report?**

Bugs are tracked as [GitHub issues](https://github.com/yourusername/github-repo-analyzer/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as much detail as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots or animated GIFs** if possible.
- **If the problem is related to performance or memory**, include a CPU profile capture with your report.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**How Do I Submit A Good Enhancement Suggestion?**

Enhancement suggestions are tracked as [GitHub issues](https://github.com/yourusername/github-repo-analyzer/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
- **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots or animated GIFs** if possible.
- **Explain why this enhancement would be useful** to most users.
- **List some other applications where this enhancement exists**, if applicable.

### Pull Requests

The process described here has several goals:

- Maintain the project's quality
- Fix problems that are important to users
- Enable a sustainable system for the project's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. **Fork the repository** and create your branch from `main`.
2. **Add tests if applicable** for your changes.
3. **Ensure the test suite passes** by running `npm test`.
4. **Make sure your code lints** by running `npm run lint`.
5. **Format your code** with Prettier by running `npm run format`.
6. **Submit a pull request** with a clear title and description.

## Development Workflow

### Setting Up Your Development Environment

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `.env.local.example`
4. Start the development server:
   ```bash
   npm run dev
   ```

### Coding Style

- We use ESLint and Prettier to enforce coding standards
- We follow a component-based architecture for the frontend
- All code should be well-documented with JSDoc comments
- TypeScript is preferred for new code

### Testing

- Write tests for all new features and bug fixes
- Ensure existing tests pass before submitting a pull request
- Aim for high test coverage

To run tests:
```bash
npm test
```

To run tests with coverage:
```bash
npm run test:coverage
```

### Git Workflow

1. **Create a feature branch** from the `main` branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them with a clear message
   ```bash
   git commit -m "Add feature: description of the feature"
   ```

3. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Submit a pull request** to the `main` branch of the original repository

## Additional Resources

- [General GitHub documentation](https://docs.github.com)
- [GitHub Pull Request documentation](https://docs.github.com/en/github/collaborating-with-pull-requests)

Thank you for contributing to GitHub Repository Analyzer! 