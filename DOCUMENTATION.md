# GitHub Repository Analyzer Documentation

## Overview

GitHub Repository Analyzer is a powerful tool that analyzes GitHub repositories and provides comprehensive quality metrics and actionable recommendations. It helps developers and teams improve their code quality by identifying potential issues and suggesting improvements.

## Features

- **Code Complexity Analysis**: Measures and reports on code complexity metrics
- **Style Consistency Checking**: Analyzes codebase for style consistency
- **Documentation Coverage**: Evaluates the completeness of documentation
- **Test Coverage**: Measures test coverage of the codebase
- **Security Vulnerability Detection**: Identifies potential security issues
- **Code Duplication Analysis**: Finds duplicate code sections
- **File Organization Assessment**: Evaluates the structure and organization of the codebase
- **Dependency Management**: Analyzes dependencies and suggests improvements
- **Maintainability Index**: Calculates the maintainability score of the codebase

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/github-repo-analyzer.git

# Navigate to the project directory
cd github-repo-analyzer

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your GitHub credentials

# Start the development server
npm run dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
GITHUB_TOKEN=your_github_personal_access_token
API_RATE_LIMIT=5000
MAX_REPO_SIZE=100
NODE_ENV=development
```

## Project Structure

```
github-repo-analyzer/
├── components/          # React components
│   ├── charts/          # Chart components
│   ├── common/          # Common UI components
│   ├── layout/          # Layout components
│   └── metrics/         # Metric display components
├── constants/           # Application constants
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Library code and utilities
├── pages/               # Next.js pages
│   └── api/             # API routes
├── public/              # Static assets
├── styles/              # CSS styles
├── utils/               # Utility functions
├── __tests__/           # Test files
├── .env.local           # Environment variables
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── jest.config.js       # Jest configuration
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## Usage

1. Navigate to the application in your browser (default: http://localhost:3000)
2. Enter a GitHub repository URL (e.g., https://github.com/username/repo)
3. Click "Analyze" to start the analysis
4. View the comprehensive report with metrics and recommendations

## API Reference

### /api/analyze-repo

Analyzes a GitHub repository and returns metrics.

**Method**: POST

**Parameters**:
- `repoUrl`: The URL of the GitHub repository to analyze

**Response**:
```json
{
  "overallScore": 7.5,
  "metrics": {
    "codeComplexity": 8.0,
    "styleConsistency": 7.0,
    "documentationCoverage": 6.0,
    "testCoverage": 9.0,
    "securityVulnerabilities": 8.0,
    "codeDuplication": 7.0,
    "fileOrganization": 8.0,
    "dependencyManagement": 7.5,
    "maintainabilityIndex": 8.0
  },
  "recommendations": [
    "Improve documentation coverage by adding more inline comments",
    "Fix style inconsistencies in the src/components directory",
    "Remove duplicate code in utility functions"
  ]
}
```

### /api/socket

WebSocket endpoint for real-time analysis updates.

## Development

### Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Linting

```bash
# Run ESLint
npm run lint
```

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

We take security seriously. If you discover a security vulnerability, please send an email to security@example.com rather than opening an issue.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **API Rate Limit Exceeded**: Increase the time between requests or use a GitHub token with higher rate limits
2. **Repository Too Large**: Set a higher value for MAX_REPO_SIZE in your .env file
3. **Analysis Timeout**: For large repositories, try analyzing specific directories instead of the entire codebase

## Support

For support, please open an issue on GitHub or contact support@example.com. 