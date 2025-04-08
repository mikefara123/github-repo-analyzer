/**
 * Code patterns and detection configurations
 */

/**
 * Files to check for pattern detection by language
 */
export const PATTERN_DETECTION_FILES = {
  // JavaScript/TypeScript/Web
  JAVASCRIPT: [
    'package.json',
    'tsconfig.json',
    'src/index.js',
    'src/index.ts',
    'src/App.js',
    'src/App.tsx',
    'src/store/index.js',
    'src/context/index.js',
  ],
  
  // Svelte specific
  SVELTE: [
    'packages/svelte/src/index.js',
    'packages/svelte/compiler/index.js',
    'packages/svelte/src/runtime/index.js',
    'src/lib/index.js',
    'src/routes/+layout.svelte',
    'svelte.config.js',
  ],
  
  // Python
  PYTHON: [
    'setup.py',
    'requirements.txt',
    'src/__init__.py',
    'app.py',
    'main.py',
  ],
  
  // Go
  GO: [
    'go.mod',
    'main.go',
    'cmd/main.go',
    'pkg/server/server.go',
    'internal/app/app.go',
  ],
  
  // Java/Kotlin
  JAVA: [
    'pom.xml',
    'build.gradle',
    'src/main/java/com/example/Application.java',
    'src/main/kotlin/com/example/Application.kt',
  ],
  
  // Ruby
  RUBY: [
    'Gemfile',
    'app/models/application_record.rb',
    'config/routes.rb',
    'app/controllers/application_controller.rb',
  ],
  
  // Generic files
  GENERIC: [
    'README.md',
    'Dockerfile',
    '.github/workflows/ci.yml',
    'docker-compose.yml'
  ]
};

/**
 * Code patterns to detect, grouped by category
 */
export const CODE_PATTERNS = {
  // Design pattern detection patterns
  DESIGN_PATTERNS: [
    {
      name: 'Factory Pattern',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /(?:create|make|build|generate)\w+\s*\([^)]*\)\s*{[^}]*return new \w+/i,
      significance: 'high',
      category: 'designPattern'
    },
    {
      name: 'Singleton Pattern',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /(?:static|private)\s+\w+\s+instance|getInstance\(\)|new \w+\(\).*instance.*===.*null/i,
      significance: 'high',
      category: 'designPattern'
    },
    {
      name: 'Observer Pattern',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /(?:addEventListener|removeEventListener|on\(|emit\(|subscribe|publish|dispatch\(|notify)/i,
      significance: 'high',
      category: 'designPattern'
    },
    {
      name: 'Strategy Pattern',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /interface\s+\w+Strategy|class\s+\w+Strategy/i,
      significance: 'high',
      category: 'designPattern'
    },
    {
      name: 'Dependency Injection',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /constructor\s*\([^)]*\)\s*{\s*this\.\w+\s*=|@Injectable|@Inject/i,
      significance: 'high',
      category: 'designPattern'
    }
  ],
  
  // Framework-specific patterns
  FRAMEWORKS: [
    {
      name: 'React Hooks',
      languages: ['javascript', 'typescript'],
      regex: /use[A-Z]\w+\s*\(/i,
      significance: 'medium',
      category: 'framework'
    },
    {
      name: 'React Context',
      languages: ['javascript', 'typescript'],
      regex: /createContext|useContext|Provider value/i,
      significance: 'medium',
      category: 'framework'
    },
    {
      name: 'React Component',
      languages: ['javascript', 'typescript'],
      regex: /(?:function|const)\s+\w+\s*=?\s*(?:\([^)]*\)|)\s*=>\s*\{[^}]*return\s*\(?<[a-zA-Z]/i,
      significance: 'low',
      category: 'framework'
    },
    {
      name: 'Vue Component',
      languages: ['javascript', 'typescript'],
      regex: /Vue\.component\(|new Vue\(|createApp\(|defineComponent\(/i,
      significance: 'medium',
      category: 'framework'
    },
    {
      name: 'Angular Component',
      languages: ['javascript', 'typescript'],
      regex: /@Component\(|@Injectable\(|@NgModule\(/i,
      significance: 'medium',
      category: 'framework'
    },
    {
      name: 'Svelte Component',
      languages: ['svelte'],
      regex: /<script>|export let |on:click/i,
      significance: 'medium',
      category: 'framework'
    }
  ],
  
  // Best practices patterns
  BEST_PRACTICES: [
    {
      name: 'Error Handling',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /try\s*{[^}]*}\s*catch|throws|throw new |raise |panic\(|rescue|except:/i,
      significance: 'high',
      category: 'bestPractice'
    },
    {
      name: 'Input Validation',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /validate|sanitize|isValid|typeof|instanceof|pattern|regex|required|scheme|validator/i,
      significance: 'high',
      category: 'bestPractice'
    },
    {
      name: 'Logging',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /console\.(?:log|error|warn|info)|System\.out\.print|println!|fmt\.Print|logger|logging/i,
      significance: 'medium',
      category: 'bestPractice'
    },
    {
      name: 'Configuration Management',
      languages: ['javascript', 'typescript', 'java', 'python', 'go', 'ruby'],
      regex: /process\.env|dotenv|config|environment|settings|constants/i,
      significance: 'medium',
      category: 'bestPractice'
    },
    {
      name: 'Async Patterns',
      languages: ['javascript', 'typescript'],
      regex: /async|await|Promise|then\(|catch\(|async\/await|\.then\(/i,
      significance: 'high',
      category: 'bestPractice'
    }
  ]
}; 