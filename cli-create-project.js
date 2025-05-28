#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use globalThis.process for compatibility in ESM environments
const processRef = globalThis.process;

function copyRecursiveSync(src, dest, exclude = []) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(childItemName => {
      if (!exclude.includes(childItemName)) {
        copyRecursiveSync(path.join(src, childItemName),
          path.join(dest, childItemName), exclude);
      }
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

// function replaceInFile(filePath, replacements) {
//   let content = fs.readFileSync(filePath, 'utf8');
//   for (const [search, replace] of Object.entries(replacements)) {
//     content = content.replace(search, replace);
//   }
//   fs.writeFileSync(filePath, content, 'utf8');
// }

function main() {
  const rl = readline.createInterface({
    input: processRef.stdin,
    output: processRef.stdout
  });

  rl.question('Output folder (leave blank for current directory): ', function(outputFolder) {
    rl.question('Project name: ', function(projectName) {
      const templateDir = path.resolve(__dirname, 'template');
      const baseDir = outputFolder ? path.resolve(processRef.cwd(), outputFolder) : processRef.cwd();
      const targetDir = path.resolve(baseDir, projectName);
      if (fs.existsSync(targetDir)) {
        console.error('Directory already exists:', targetDir);
        processRef.exit(1);
      }
      copyRecursiveSync(templateDir, targetDir);
      // Replace project name and description in package.json using template markers
      const pkgPath = path.join(targetDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        let pkgContent = fs.readFileSync(pkgPath, 'utf8');
        pkgContent = pkgContent.replace(/"name":\s*"[^"]*"/, `"name": "${projectName}"`);
        pkgContent = pkgContent.replace(/"description":\s*"[^"]*"/, `"description": "${projectName}"`);
        fs.writeFileSync(pkgPath, pkgContent, 'utf8');
      }
      // Install dependencies
      console.log('Installing dependencies...');
      execSync('npm ci', { cwd: targetDir, stdio: 'inherit' });
      // Initialize git and make initial commit
      try {
        console.log('Initializing git repository...');
        execSync('git init', { cwd: targetDir, stdio: 'inherit' });
        execSync('git add .', { cwd: targetDir, stdio: 'inherit' });
        execSync('git commit -m "Initial Commit"', { cwd: targetDir, stdio: 'inherit' });
      } catch (err) {
        console.warn('Git initialization failed:', err.message);
      }
      console.log('Project created at', targetDir);
      rl.close();
    });
  });
}

main();
