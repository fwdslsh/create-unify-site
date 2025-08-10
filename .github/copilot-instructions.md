# create-unify-site CLI Tool

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

`create-unify-site` is a Node.js CLI scaffolding tool that creates new unify-based static site projects. It prompts users for configuration and generates a complete project structure with build and serve scripts.

## Working Effectively

### Prerequisites and Installation
- **REQUIRED**: Install Node.js v20+ and npm
- **REQUIRED**: Install Bun runtime (required by @fwdslsh/unify dependency):
  ```bash
  curl -fsSL https://bun.sh/install | bash
  source ~/.bashrc  # CRITICAL: Must reload PATH to include ~/.bun/bin
  bun --version  # Should show 1.2+
  ```
- **REQUIRED**: Verify installation:
  ```bash
  node --version  # Should show v20+
  npm --version   # Should show 10+
  bun --version   # Should show 1.2+
  ```

### Repository Structure
- `index.js` - Main CLI entry point (executable)
- `package.json` - Project metadata and CLI configuration
- `template/` - Template files copied to new projects
  - `template/src/` - Source files (HTML, layouts, components, assets)
  - `template/dist/` - Build output directory (contains only .gitkeep)
- `.github/workflows/publish.yml` - NPM publishing workflow

### Testing the CLI Tool
- **COMMAND**: `node index.js` (run from repository root)
- **TIMING**: Completes in 1-2 seconds
- **INTERACTIVE**: Prompts for project name and configuration
- **OUTPUT**: Creates new project directory with template files and package.json
- **VALIDATION**: Always verify the generated package.json has correct build/serve scripts

### Testing Generated Projects
1. **Create test project**:
   ```bash
   cd /tmp && mkdir test-project && cd test-project
   node /path/to/create-unify-site/index.js
   # Enter project name and accept defaults
   cd [project-name]
   ```

2. **Build the project**:
   ```bash
   npm run build
   # TIMING: Completes in 1-2 seconds
   # OUTPUT: Generates dist/index.html and dist/sitemap.xml
   ```

3. **Serve the project**:
   ```bash
   source ~/.bashrc  # Ensure Bun is in PATH
   npm run serve
   # TIMING: Starts instantly
   # OUTPUT: Development server on http://localhost:3000 with live reload
   # VALIDATION: curl http://localhost:3000 should return HTML
   ```

### Alternative Unify Commands
*Note: Ensure `source ~/.bashrc` is run first to include Bun in PATH*
- **Direct build**: `npx @fwdslsh/unify build --source src --output dist --layouts .layouts --components .components`
- **Watch mode**: `unify watch` (auto-rebuilds on file changes)
- **Advanced build**: `unify build --clean --minify --verbose` (production build)
- **Custom port**: `unify serve --port 8080`

## Validation

### Manual Validation Scenarios
**ALWAYS test these scenarios after making changes to the CLI tool:**

1. **Complete Scaffolding Workflow**:
   - Run CLI tool and create new project with custom name
   - Verify all template files copied correctly
   - Check package.json has correct build/serve script syntax
   - Confirm project builds successfully
   - Verify serve command starts and serves content

2. **Generated Project Functionality**:
   - Build project and verify HTML output in dist/
   - Start development server and access http://localhost:3000
   - Verify HTML includes template content (card component, layouts)
   - Test that server returns proper HTTP 200 responses

3. **Advanced Features**:
   - Test watch mode rebuilds on file changes
   - Verify clean builds remove old files
   - Test minification produces smaller output
   - Confirm verbose mode shows detailed build information

### Build and Test Commands
- **NO TESTS EXIST**: Repository has no test suite
- **NO LINTING**: No linting configuration present
- **NO CI BUILD**: Only NPM publish workflow exists
- **VALIDATION**: Manual testing only - use scenarios above

## Common Tasks

### Repository Files Inventory
```
.
├── .git/
├── .github/
│   └── workflows/publish.yml
├── LICENSE (CC0-1.0)
├── index.js (main CLI script)
├── package.json (project metadata)
└── template/
    ├── dist/.gitkeep
    └── src/
        ├── .components/card.html
        ├── .layouts/default.html
        ├── assets/favicon.ico
        └── index.html
```

### Package.json Configuration
```json
{
  "name": "create-unify-site",
  "version": "0.0.1",
  "type": "module",
  "bin": {
    "create-unify-site": "./index.js"
  },
  "description": "Scaffold a new unify-based static site project",
  "dependencies": {}
}
```

### Generated Project Scripts
After scaffolding, projects get this package.json:
```json
{
  "name": "[project-name]",
  "type": "module",
  "scripts": {
    "build": "npx @fwdslsh/unify build --source src --output dist --layouts .layouts --components .components",
    "serve": "npx @fwdslsh/unify serve --output dist"
  }
}
```

## Known Issues and Limitations

### Working Correctly
- ✅ CLI scaffolding and template copying
- ✅ Generated package.json scripts (fixed in latest version)
- ✅ Build process with @fwdslsh/unify
- ✅ Development server with live reload
- ✅ All unify advanced features (watch, minify, etc.)

### Dependencies Required
- ⚠️ **Bun runtime required** but not documented in package.json
- ⚠️ **Critical**: Must run `source ~/.bashrc` after Bun installation to add to PATH
- ⚠️ **@fwdslsh/unify package** installed automatically via npx

### Repository Limitations
- ❌ No README.md or documentation
- ❌ No test suite
- ❌ No linting configuration
- ❌ Interactive readline may have issues in some environments (automated testing difficult)
- ❌ CLI tool requires manual input - cannot be easily automated with pipes or redirects

## Timing and Performance

### Operation Timings (NEVER CANCEL - All operations are very fast)
- **CLI scaffolding**: 1-2 seconds
- **Project build**: 1-2 seconds (extremely fast static site generation)
- **Server startup**: <1 second (instant)
- **Watch mode initialization**: <1 second
- **Bun installation**: 30-60 seconds (one-time setup)

### Performance Notes
- All operations complete very quickly due to simple static site nature
- No long-running builds or complex compilation steps
- Only potential delay is initial @fwdslsh/unify package download via npx

## Troubleshooting

### Common Issues
1. **Error: "env: 'bun': No such file or directory"**
   - Solution: Run `source ~/.bashrc` to add Bun to PATH
   - Verification: `which bun` should show `/home/[user]/.bun/bin/bun`

2. **CLI tool hangs during interactive prompts**
   - Solution: Use manual keyboard input rather than piped input
   - Alternative: Copy template files manually and create package.json

3. **Build fails with "Unknown option" error**
   - Indicates old/incorrect package.json scripts
   - Ensure package.json uses flag syntax: `--source src --output dist`

### Validation Commands
- `node --version && bun --version && npm --version` - Check prerequisites
- `npx @fwdslsh/unify --help` - Verify unify tool accessible
- `curl http://localhost:3000` - Test development server response