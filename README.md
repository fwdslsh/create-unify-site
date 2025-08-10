# create-unify-site

A CLI tool to scaffold new [Unify](https://github.com/fwdslsh/unify)-based static site projects.

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
- **Layout folder**: Where your layout templates are stored (default: `src/.layouts`)
- **Component folder**: Where your reusable components are stored (default: `src/.components`)

## What it does

This tool creates a new directory with your project name and:

1. **Copies a template structure** from the package's template directory
2. **Generates a `package.json`** with the correct scripts to build and serve your site
3. **Sets up build and serve scripts** that use the [@fwdslsh/unify](https://www.npmjs.com/package/@fwdslsh/unify) static site generator

The generated `package.json` will include these scripts:

```json
{
  "scripts": {
    "build": "npx @fwdslsh/unify build <inputDir> <outputDir> --layouts <layoutDir> --components <componentDir>",
    "serve": "npx @fwdslsh/unify serve <outputDir>"
  }
}
```

## Getting Started

After scaffolding your project:

```bash
cd your-project-name
npm run build
npm run serve
```

This will:
1. Build your static site using the Unify generator
2. Start a local development server to preview your site

## Example

```bash
$ npx create-unify-site
Project name: my-awesome-site
Source folder (default: src): 
Output folder (default: dist): 
Layout folder (default: src/.layouts): 
Component folder (default: src/.components): 
✔ Project scaffolded in /path/to/my-awesome-site
🎉 Done! Run:
  cd my-awesome-site
  npm run build
  npm run serve
```

## License

This project is licensed under the [Creative Commons Attribution 4.0 International License](LICENSE).

## Related

- [@fwdslsh/unify](https://www.npmjs.com/package/@fwdslsh/unify) - The static site generator this tool scaffolds projects for
- [Unify Documentation](https://github.com/fwdslsh/unify) - Learn more about the Unify static site generator