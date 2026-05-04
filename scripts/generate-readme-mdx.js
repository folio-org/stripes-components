#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const libRoot = path.join(repoRoot, 'lib');
const checkMode = process.argv.includes('--check');
const cleanMode = process.argv.includes('--clean');

const README_NAMES = ['README.md', 'Readme.md', 'readme.md'];
const STORY_FILE_PATTERN = /\.stories\.(js|jsx|ts|tsx)$/;
const AUTO_HEADER = 'AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.';

// Normalize paths for Storybook/MDX imports and console output.
function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

// Collect top-level component directories under lib/.
function getComponentDirs() {
  return fs
    .readdirSync(libRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(libRoot, entry.name));
}

// Find a README file for a component using supported filename variants.
function findReadme(componentDir) {
  for (const fileName of README_NAMES) {
    const fullPath = path.join(componentDir, fileName);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

// Recursively find component story files used to bind generated README docs.
function findStoryFiles(componentDir) {
  const storyFiles = [];

  // Walk a component subtree and collect all CSF story files.
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name === 'node_modules') continue;

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (STORY_FILE_PATTERN.test(entry.name) && !entry.name.endsWith('.stories.mdx')) {
        storyFiles.push(fullPath);
      }
    }
  }

  walk(componentDir);

  return storyFiles.sort((a, b) => a.localeCompare(b));
}

// Prefer the canonical <Component>.stories.* file when one exists.
function getPreferredStoryFile(componentDir, componentName, storyFiles) {
  const preferred = storyFiles.find((filePath) => {
    const base = path.basename(filePath).toLowerCase();
    return base === `${componentName.toLowerCase()}.stories.js` ||
      base === `${componentName.toLowerCase()}.stories.ts` ||
      base === `${componentName.toLowerCase()}.stories.jsx` ||
      base === `${componentName.toLowerCase()}.stories.tsx`;
  });

  return preferred || storyFiles[0] || null;
}

// Extract named story exports to support optional Story block generation.
function getNamedStoryExports(storyFileContents) {
  const names = new Set();

  const constExportRegex = /export\s+const\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
  let constMatch = constExportRegex.exec(storyFileContents);
  while (constMatch) {
    names.add(constMatch[1]);
    constMatch = constExportRegex.exec(storyFileContents);
  }

  const blockExportRegex = /export\s*\{([^}]+)\}/g;
  let blockMatch = blockExportRegex.exec(storyFileContents);
  while (blockMatch) {
    const parts = blockMatch[1].split(',').map((part) => part.trim()).filter(Boolean);

    for (const part of parts) {
      const aliasMatch = /(?:default\s+as|[A-Za-z_$][A-Za-z0-9_$]*\s+as)\s+([A-Za-z_$][A-Za-z0-9_$]*)/.exec(part);
      if (aliasMatch) {
        names.add(aliasMatch[1]);
        continue;
      }

      const directMatch = /^([A-Za-z_$][A-Za-z0-9_$]*)$/.exec(part);
      if (directMatch && directMatch[1] !== 'default') {
        names.add(directMatch[1]);
      }
    }

    blockMatch = blockExportRegex.exec(storyFileContents);
  }

  const excluded = new Set([
    '__namedExportsOrder',
    '__page',
    '__docgenInfo',
    'default',
  ]);

  return [...names].filter((name) => !excluded.has(name));
}

// Derive a display heading from README content with component fallback.
function getReadmeHeading(readmeContent, componentName) {
  const match = /^#\s+(.+)$/m.exec(readmeContent);
  if (match) {
    return match[1].trim();
  }

  return componentName;
}

// Remove source patterns that are invalid in MDX3 before embedding markdown.
function sanitizeReadmeContent(readmeContent) {
  // MDX3 does not support HTML comments in markdown source.
  return readmeContent.replace(/<!--[\s\S]*?-->/g, '').trim();
}

// Escape markdown so it can be safely embedded in a JavaScript template literal.
function escapeMarkdownForJsString(markdown) {
  return markdown
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

// Build the generated MDX wrapper that renders README markdown in Storybook docs.
function buildWrapper({ componentName, readmeContent, storyImportPath, storyExports }) {
  const sanitizedReadme = sanitizeReadmeContent(readmeContent);

  const imports = [
    "import { Meta, Canvas, Story } from '@storybook/addon-docs/blocks';",
    // Renders README markdown text to React elements inside generated MDX docs.
    "import ReactMarkdown from 'react-markdown';",
    // Enables GitHub-flavored markdown features (tables, strikethrough, task lists).
    "import remarkGfm from 'remark-gfm';",
    // Allows inline HTML found in README files to be rendered in docs output.
    "import rehypeRaw from 'rehype-raw';",
  ];

  if (storyImportPath) {
    imports.push(`import * as Stories from '${storyImportPath}';`);
  }

  const lines = [
    `{/* ${AUTO_HEADER} */}`,
    ...imports,
    '',
    `export const readmeMarkdown = \`${escapeMarkdownForJsString(sanitizedReadme)}\`;`,
    '',
    storyImportPath
      ? '<Meta of={Stories} name="Readme" />'
      : `<Meta title="Components/${componentName}" name="Readme" />`,
    '',
  ];

  lines.push(
    '<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>',
    '  {readmeMarkdown}',
    '</ReactMarkdown>',
    ''
  );

  return `${lines.join('\n')}\n`;
}

// Write generated content only when changed to keep diffs and checks stable.
function writeIfChanged(filePath, content) {
  const exists = fs.existsSync(filePath);
  const current = exists ? fs.readFileSync(filePath, 'utf8') : null;

  if (current === content) {
    return { changed: false, created: false };
  }

  if (checkMode) {
    return { changed: true, created: !exists };
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return { changed: true, created: !exists };
}

// Delete previously generated README wrapper files from lib/.
function removeGeneratedWrappers() {
  const removedFiles = [];

  // Walk the lib tree and remove only files marked with the auto-generated header.
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name === 'node_modules') continue;

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!/\.readme(?:\.stories)?\.mdx$/.test(entry.name)) {
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes(AUTO_HEADER)) {
        continue;
      }

      fs.unlinkSync(fullPath);
      removedFiles.push(fullPath);
    }
  }

  walk(libRoot);

  console.log('README wrapper clean complete.');
  console.log(`Removed: ${removedFiles.length}`);
}

// Main CLI entrypoint: validate mode, generate wrappers, and report results.
function run() {
  if (checkMode && cleanMode) {
    console.error('Choose either --check or --clean, not both.');
    process.exit(1);
  }

  if (cleanMode) {
    removeGeneratedWrappers();
    return;
  }

  const componentDirs = getComponentDirs();
  const changedFiles = [];
  const createdFiles = [];
  const removedFiles = [];

  for (const componentDir of componentDirs) {
    const componentName = path.basename(componentDir);
    const readmePath = findReadme(componentDir);

    if (!readmePath) {
      continue;
    }

    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    const storyFiles = findStoryFiles(componentDir);
    const storyFile = getPreferredStoryFile(componentDir, componentName, storyFiles);

    let storyImportPath = null;
    let storyExports = [];

    if (storyFile) {
      const relative = path.relative(componentDir, storyFile);
      storyImportPath = `./${toPosix(relative).replace(/\.(js|jsx|ts|tsx)$/, '')}`;
      const storyFileContents = fs.readFileSync(storyFile, 'utf8');
      storyExports = getNamedStoryExports(storyFileContents);
    }

    const outputFile = path.join(componentDir, `${componentName}.readme.mdx`);
    const legacyOutputFile = path.join(componentDir, `${componentName}.readme.stories.mdx`);

    if (fs.existsSync(legacyOutputFile) && legacyOutputFile !== outputFile) {
      if (checkMode) {
        changedFiles.push(legacyOutputFile);
      } else {
        fs.unlinkSync(legacyOutputFile);
        removedFiles.push(legacyOutputFile);
      }
    }

    const outputContent = buildWrapper({
      componentName,
      readmeContent,
      storyImportPath,
      storyExports,
    });

    const result = writeIfChanged(outputFile, outputContent);
    if (result.changed) {
      changedFiles.push(outputFile);
    }
    if (result.created) {
      createdFiles.push(outputFile);
    }
  }

  if (checkMode && changedFiles.length > 0) {
    console.error('README wrapper docs are out of date. Run: node scripts/generate-readme-mdx.js');
    for (const filePath of changedFiles) {
      console.error(` - ${toPosix(path.relative(repoRoot, filePath))}`);
    }
    process.exit(1);
  }

  const mode = checkMode ? 'check' : 'generate';
  console.log(`README wrapper ${mode} complete.`);
  console.log(`Changed: ${changedFiles.length}`);
  console.log(`Created: ${createdFiles.length}`);
  if (!checkMode) {
    console.log(`Removed legacy: ${removedFiles.length}`);
  }
}

run();
