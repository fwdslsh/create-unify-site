#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';
import readline from 'readline/promises';
import { mkdir, copyFile, readdir, writeFile } from 'fs/promises';
import https from 'https';
import * as tar from 'tar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub repository details
const UNIFY_STARTER_REPO = 'fwdslsh/unify-starter';
const TARBALL_URL = `https://api.github.com/repos/${UNIFY_STARTER_REPO}/tarball`;

// Fallback files to create if download fails
const FALLBACK_FILES = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
<!--#include virtual="/_includes/head.html" -->
  <title>Welcome to Unify</title>
</head>
<body>
<!--#include virtual="/_includes/header.html" -->

  <main>
    <h1>Hello from Unify</h1>
    <p>This is a zero-boilerplate static site built with <a href="https://github.com/fwdslsh/unify">Unify</a>.</p>
    
    <p>Unify brings the power of server-side includes to static site generation. Build maintainable sites with component-based architecture—no more copying and pasting headers, footers, and navigation across multiple pages!</p>
    
    <!--#include virtual="/_includes/card.html" -->
    
    <h2>Getting Started</h2>
    <pre><code># Build your site
npm run build

# Start development server
npm run dev</code></pre>
  </main>

<!--#include virtual="/_includes/footer.html" -->
</body>
</html>`,
  '_includes/head.html': `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="/assets/main.css">
<link rel="icon" href="/assets/favicon.png">`,
  '_includes/header.html': `<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>`,
  '_includes/footer.html': `<footer>
  <p>&copy; 2025 My Unify Site. Built with <a href="https://github.com/fwdslsh/unify">Unify</a>.</p>
  <script src="/assets/main.js"></script>
</footer>`,
  '_includes/card.html': `<div class="card">
  <h3>Welcome Card</h3>
  <p>This is an example component that demonstrates Unify's include system.</p>
  <p>Edit this file at <code>src/_includes/card.html</code> to customize it.</p>
</div>`,
  'assets/main.css': `/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

nav a {
  color: #007acc;
  text-decoration: none;
  font-weight: 500;
}

nav a:hover {
  text-decoration: underline;
}

main {
  margin-bottom: 2rem;
}

h1, h2, h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

p {
  margin-bottom: 1rem;
}

pre {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

code {
  background: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Monaco', 'Consolas', monospace;
}

.card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.card h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}

footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
}

footer a {
  color: #007acc;
}`,
  'assets/main.js': `// Main JavaScript file for Unify site
console.log('Unify site loaded successfully!');

// Example: Add some interactive functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add click handlers or other interactive features here
  console.log('DOM loaded, ready for interactivity!');
  
  // Example: Highlight code blocks
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    block.style.display = 'block';
  });
});

// Example function you can use in your site
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
if (localStorage.getItem('dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
}`
};

async function downloadAndExtract(url, extractDir) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'create-unify-site'
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadAndExtract(response.headers.location, extractDir).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      // Extract directly from stream
      response
        .pipe(tar.extract({
          cwd: extractDir,
          strip: 1,
          filter: (path) => path.includes('/src/'),
          map: (header) => {
            // Remap paths to remove the /src prefix
            if (header.path.includes('/src/')) {
              header.path = header.path.replace(/^[^/]+\/src\//, '');
            }
            return header;
          }
        }))
        .on('finish', resolve)
        .on('error', reject);
    }).on('error', reject);
  });
}

// Get the latest release version of @fwdslsh/unify from GitHub
async function getLatestUnifyVersion() {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'create-unify-site',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    https.get('https://api.github.com/repos/fwdslsh/unify/releases/latest', options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            // Remove leading 'v' if present
            const version = json.tag_name.startsWith('v') ? json.tag_name.slice(1) : json.tag_name;
            resolve(version);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error('Failed to fetch latest release'));
        }
      });
    }).on('error', reject);
  });
}

async function createFallbackFiles(srcDir) {
  console.log('📄 Creating starter template files...');
  
  for (const [filePath, content] of Object.entries(FALLBACK_FILES)) {
    const fullPath = path.join(srcDir, filePath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    await mkdir(dir, { recursive: true });
    
    // Write file
    await writeFile(fullPath, content, 'utf-8');
  }
}

async function copy(srcDir, destDir) {
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copy(src, dest);
    } else {
      await copyFile(src, dest);
    }
  }
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const name = await rl.question('Project name: ');
  const inputDir = await rl.question('Source folder (default: src): ') || 'src';
  const outputDir = await rl.question('Output folder (default: dist): ') || 'dist';
  rl.close();

  const targetDir = path.resolve(process.cwd(), name || 'unify-site');
  const srcDir = path.join(targetDir, inputDir);

  // Create target directory structure
  await mkdir(srcDir, { recursive: true });
  await mkdir(path.join(targetDir, outputDir), { recursive: true });

  // Try to download from unify-starter repository, fallback to local files
  try {
    console.log('📥 Downloading unify-starter template...');
    await downloadAndExtract(TARBALL_URL, srcDir);
    console.log('✔ Downloaded latest template from unify-starter');
  } catch (error) {
    console.log('⚠ Could not download from GitHub, using built-in template');
    await createFallbackFiles(srcDir);
  }

  // Get latest unify version
  let unifyVersion = '^0.4.3';
  try {
    unifyVersion = '^' + await getLatestUnifyVersion();
  } catch (e) {
    console.log('⚠ Could not fetch latest unify version, using default:', unifyVersion);
  }

  const pkgPath = path.join(targetDir, 'package.json');
  const pkgJson = {
    name: name || 'unify-site',
    version: '0.0.1',
    description: 'A static site built with Unify',
    type: 'module',
    scripts: {
      build: `npx @fwdslsh/unify build --source ${inputDir} --output ${outputDir}`,
      dev: `npx @fwdslsh/unify serve --source ${inputDir} --output ${outputDir}`,
      serve: `npx @fwdslsh/unify serve --output ${outputDir}`
    },
    devDependencies: {
      '@fwdslsh/unify': unifyVersion
    },
    keywords: ['unify', 'static-site-generator', 'starter-kit']
  };
  await writeFile(pkgPath, JSON.stringify(pkgJson, null, 2), 'utf-8');

  console.log(`✔ Project scaffolded in ${targetDir}`);
  console.log('🎉 Done! Run:');
  console.log(`  cd ${name}`);
  console.log('  npm run build');
  console.log('  npm run dev');
}

main();
