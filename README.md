# GitHub Repository Analyzer

A powerful web application that analyzes GitHub repositories and provides comprehensive quality metrics, helping developers and teams identify areas for improvement in their codebases.

![GitHub Repository Analyzer](https://github.com/yourusername/github-repo-analyzer/raw/main/public/screenshot.png)

## ✨ Features

The analyzer evaluates repositories across multiple quality dimensions:

- **Code Complexity**: Analyzes code complexity and readability
- **Documentation Coverage**: Evaluates README quality and documentation presence
- **Test Coverage**: Detects test files and evaluates testing infrastructure
- **Style Consistency**: Examines code style and formatting standards
- **Security Score**: Identifies potential security vulnerabilities
- **Maintainability Index**: Measures how easy the codebase is to maintain
- **Duplication Score**: Identifies code duplication levels
- **File Organization**: Evaluates project structure and organization
- **Dependency Management**: Assesses dependency handling practices

## 🔍 How It Works

The analyzer connects to the GitHub API and performs a comprehensive analysis of the target repository:

1. Fetches repository metadata, structure, and content
2. Analyzes languages used, commit history, and contribution patterns
3. Examines code organization, documentation, and testing practices
4. Generates scores across multiple metrics on a scale of 1-10
5. Provides actionable recommendations based on identified issues

## 📂 Project Structure

```
github-repo-analyzer/
├── components/             # Reusable UI components
│   ├── common/             # Shared components like Button, Card, etc.
│   ├── layout/             # Layout components (Header, Footer, etc.)
│   ├── metrics/            # Metric-specific components
│   │   ├── CodeComplexity.js
│   │   ├── DocumentationCoverage.js
│   │   └── ...
│   └── charts/             # Chart components
├── context/                # React context for state management
│   └── AnalysisContext.js  # Global context for analysis state
├── hooks/                  # Custom React hooks
│   ├── useGitHubApi.js
│   └── useAnalysisProgress.js
├── lib/                    # External libraries and API clients
│   └── github.js           # GitHub API client configuration
├── pages/                  # Next.js pages
│   ├── api/                # API routes
│   │   └── analyze.js      # API endpoint for analysis
│   ├── _app.js             # Custom App component
│   ├── _document.js        # Custom Document component
│   └── index.js            # Homepage
├── public/                 # Static assets
│   ├── images/
│   └── favicon.ico
├── styles/                 # Global styles and theme
│   ├── globals.css
│   └── theme.js
├── utils/                  # Utility functions
│   ├── analyzer.js         # Core analysis logic
│   ├── formatters.js       # Data formatting utilities
│   └── recommendations.js  # Recommendation generation
├── constants/              # Application constants
│   ├── metrics.js          # Metrics configuration
│   └── patterns.js         # Code pattern definitions
├── .env.local.example      # Example environment variables
├── .gitignore              # Git ignore file
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ 
- npm or yarn
- A GitHub account with a Personal Access Token (classic)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/github-repo-analyzer.git
   cd github-repo-analyzer
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file:
   ```
   cp .env.local.example .env.local
   ```

4. Add your GitHub token to the `.env.local` file:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

   > **Note:** The token requires `repo` scope to access private repositories. For public repositories, you can use a token with no scopes.

### Usage

1. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`) and click "Analyze"

4. View the detailed analysis results, including:
   - Overall repository score
   - Individual metric ratings
   - Language breakdown
   - Tailored recommendations for improvement

## 📊 Understanding the Metrics

Each repository is scored on a scale of 1-10 across various dimensions:

- **8-10**: Excellent - Following best practices
- **6-7**: Good - Room for minor improvements
- **4-5**: Fair - Needs attention
- **1-3**: Poor - Significant improvements needed

The overall score is calculated as a weighted average of all metrics.

## 🌍 Deployment

### Deploy to Vercel

The easiest way to deploy this application is using [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add your `GITHUB_TOKEN` environment variable
4. Deploy!

### Other Hosting Options

You can deploy to any platform that supports Next.js applications:

- [Netlify](https://netlify.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)

## 🔧 Technology Stack

- **Frontend**: React, Next.js, Chart.js
- **API**: GitHub API via Octokit
- **Styling**: CSS Modules
- **Deployment**: Vercel (recommended)

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔮 Roadmap

- Add more in-depth code analysis
- Support additional version control platforms
- Add trending repositories analysis
- Create comparison features between repositories
- Add historical analysis to track improvements over time 