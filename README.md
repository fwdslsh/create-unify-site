# create-unify-site

A CLI tool to scaffold new [Unify](https://github.com/fwdslsh/unify)-based static site projects using the latest [unify-starter](https://github.com/fwdslsh/unify-starter) template.

## Installation

You can use this package directly with `npx` without installing it globally:

```bash
npx create-unify-site
```

Or install it globally:

```bash
npm install -g create-unify-site
```

## Usage

To create a new Unify-based static site project:

```bash
npx create-unify-site
```

The CLI will prompt you for the following configuration options:

- **Project name**: The name of your project (also used as the directory name)
- **Source folder**: Where your source files will be located (default: `src`)
- **Output folder**: Where the built site will be generated (default: `dist`)

## What it does

This tool creates a new directory with your project name and:

1. **Downloads the latest template** from the [unify-starter](https://github.com/fwdslsh/unify-starter) repository
2. **Falls back to a built-in template** if the download fails (ensuring it always works)
3. **Generates a `package.json`** with the correct scripts to build and serve your site
4. **Sets up modern build and serve scripts** that use the [@fwdslsh/unify](https://www.npmjs.com/package/@fwdslsh/unify) static site generator

The generated project includes:

- **Modern HTML5 template** with responsive design
- **Component-based architecture** using Unify's include system
- **CSS and JavaScript assets** for styling and interactivity
- **Server-side includes** for maintainable, reusable components
- **Development and production scripts** for building and serving

## Project Structure

The scaffolded project follows the unify-starter structure:

```
my-project/
├── src/
│   ├── _includes/           # Reusable components
│   │   ├── head.html       # HTML head section
│   │   ├── header.html     # Site header/navigation
│   │   ├── footer.html     # Site footer
│   │   └── card.html       # Example component
│   ├── assets/             # Static assets
│   │   ├── main.css        # Site styles
│   │   ├── main.js         # Site JavaScript
│   │   └── favicon.png     # Site icon
│   └── index.html          # Main page template
├── dist/                   # Build output (generated)
└── package.json           # Project configuration
```

## Generated Scripts

The generated `package.json` includes these modern scripts:

```json
{
  "scripts": {
    "build": "npx @fwdslsh/unify build --source src --output dist",
    "dev": "npx @fwdslsh/unify serve --source src --output dist",
    "serve": "npx @fwdslsh/unify serve --output dist"
  }
}
```

## Getting Started

After scaffolding your project:

```bash
cd your-project-name

# Build your site
npm run build

# Start development server with live reload
npm run dev

# Or serve the built site
npm run serve
```

This will:
1. Build your static site using the Unify generator with component includes
2. Start a local development server with live reload for development
3. Serve your built site for production testing

## Component System

The scaffolded project uses Unify's powerful server-side include system:

```html
<!-- Include reusable components -->
<!--#include virtual="/_includes/header.html" -->

<main>
  <h1>Your content here</h1>
  
  <!-- Include components anywhere -->
  <!--#include virtual="/_includes/card.html" -->
</main>

<!--#include virtual="/_includes/footer.html" -->
```

## Example

```bash
$ npx create-unify-site
Project name: my-awesome-site
Source folder (default: src): 
Output folder (default: dist): 
📥 Downloading unify-starter template...
⚠ Could not download from GitHub, using built-in template
📄 Creating starter template files...
✔ Project scaffolded in /path/to/my-awesome-site
🎉 Done! Run:
  cd my-awesome-site
  npm run build
  npm run dev
```

## Features

- ✅ **Always works**: Falls back to built-in template if GitHub is unavailable
- ✅ **Latest templates**: Downloads from unify-starter repository when possible
- ✅ **Modern workflow**: Includes development server with live reload
- ✅ **Component-based**: Server-side includes for maintainable architecture
- ✅ **Zero configuration**: Works out of the box with sensible defaults
- ✅ **Responsive design**: Mobile-first CSS included
- ✅ **Production ready**: Optimized build process

## Requirements

- Node.js 20+ and npm 10+
- [Bun runtime](https://bun.sh) (required by @fwdslsh/unify)

Install Bun if you haven't already:

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

## License

This project is licensed under the [Creative Commons Attribution 4.0 International License](LICENSE).

## Related

- [@fwdslsh/unify](https://www.npmjs.com/package/@fwdslsh/unify) - The static site generator this tool scaffolds projects for
- [unify-starter](https://github.com/fwdslsh/unify-starter) - The starter template repository
- [Unify Documentation](https://github.com/fwdslsh/unify) - Learn more about the Unify static site generator