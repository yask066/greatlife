import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative, resolve, sep } from 'node:path';

const requiredFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'favicon.svg',
  'fonts/manrope-latin-cyrillic.woff2',
];

function listHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listHtmlFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function localTargetPath(value, distDirectory) {
  const trimmed = value.trim();

  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
    return null;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) {
    return null;
  }

  const withoutQueryOrHash = trimmed.split(/[?#]/, 1)[0];
  const decodedPath = decodeURIComponent(withoutQueryOrHash || '/');
  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
  const targetPath = resolve(distDirectory, relativePath);
  const relativeTarget = relative(distDirectory, targetPath);

  return relativeTarget === '..' || relativeTarget.startsWith(`..${sep}`) || relativeTarget.includes('\0')
    ? targetPath
    : targetPath;
}

export function verifyBuild(distDirectory) {
  const resolvedDist = resolve(distDirectory);
  const errors = [];

  if (!existsSync(resolvedDist)) {
    throw new Error(`Build directory does not exist: ${resolvedDist}`);
  }

  for (const requiredFile of requiredFiles) {
    const filePath = join(resolvedDist, requiredFile);

    if (!existsSync(filePath)) {
      errors.push(`Missing required file: ${requiredFile}`);
    }
  }

  const attributePattern = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;

  for (const htmlFile of listHtmlFiles(resolvedDist)) {
    const html = readFileSync(htmlFile, 'utf8');
    const htmlRelativePath = relative(resolvedDist, htmlFile);
    let match;

    while ((match = attributePattern.exec(html)) !== null) {
      const targetPath = localTargetPath(match[1], resolvedDist);

      if (targetPath !== null && !existsSync(targetPath)) {
        errors.push(`Broken internal link in ${htmlRelativePath}: ${match[1]}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

const invokedScript = process.argv[1] ? resolve(process.argv[1]) : '';
const currentScript = resolve(fileURLToPath(import.meta.url));

if (invokedScript === currentScript) {
  const distDirectory = process.argv[2];

  if (!distDirectory) {
    console.error('Usage: node scripts/verify-build.mjs <dist-directory>');
    process.exitCode = 1;
  } else {
    try {
      verifyBuild(distDirectory);
      console.log(`Build verification passed: ${resolve(distDirectory)}`);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
