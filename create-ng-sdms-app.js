#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use globalThis.process for compatibility in ESM environments
const processRef = globalThis.process;

// Color combinations for a nice gradient effect
const coolGradient = gradient(['#12c2e9', '#c471ed', '#f64f59']);
const purpleGradient = gradient(['#8A2387', '#E94057', '#F27121']);
const blueGradient = gradient(['#0052D4', '#4364F7', '#6FB1FC']);

// Random tips and facts about Vue/Vite development
const tips = [
  "💡 Vue 3's Composition API helps organize logic by feature rather than by type",
  "⚡ Vite pre-bundles dependencies for faster startup using esbuild",
  "🎨 Tailwind's JIT mode generates CSS on demand for smaller dev bundles",
  "🔍 Use Vue DevTools to inspect component state in your browser",
  "🚀 DevExtreme components are highly customizable for enterprise applications",
  "📦 Use Pinia for state management - it's the official Vue recommendation",
  "📱 Test your app in different viewport sizes for responsive design",
  "🧩 Vue's Teleport feature lets you render content anywhere in the DOM",
  "⌨️ Learn Vue component shorthand like @ for v-on and : for v-bind",
  "✨ Keep component props primitive and explicit for better maintainability"
];

// Display a random tip
function getRandomTip() {
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}

// Create a promise-based readline question (used as fallback)
function question(rl, query, color = 'cyan') {
  return new Promise((resolve) => {
    rl.question(chalk[color](query), resolve);
  });
}

// Display ASCII art logo with animated gradient
function displayLogo() {
  return new Promise((resolve) => {
    figlet('NG-SDMS', {
      font: 'standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 100,
    }, (err, data) => {
      if (err) {
        console.log('Something went wrong with the ASCII art...');
        resolve();
        return;
      }
      
      // Display the logo with a gradient color effect
      console.log(coolGradient(data));
      console.log(boxen(purpleGradient('✨ NG-SDMS Template Generator ✨'), {
        padding: 1,
        margin: { top: 0, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'cyan'
      }));
      
      // Show a random tip
      console.log(boxen(chalk.yellow(`Tip: ${getRandomTip()}`), {
        padding: 1,
        margin: { top: 0, bottom: 1 },
        borderStyle: 'single',
        dimBorder: true,
        borderColor: 'yellow'
      }));
      
      resolve();
    });
  });
}


async function asyncCopyRecursive(src, dest, exclude = []) {
  const exists = await fs.promises.stat(src).then(() => true).catch(() => false);
  if (!exists) return;
  const stats = await fs.promises.stat(src);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) await fs.promises.mkdir(dest);
    const children = await fs.promises.readdir(src);
    for (const childItemName of children) {
      // Always exclude node_modules
      if (!exclude.includes(childItemName) && childItemName !== 'node_modules') {
        await asyncCopyRecursive(
          path.join(src, childItemName),
          path.join(dest, childItemName),
          exclude
        );
      }
    }
  } else {
    await fs.promises.copyFile(src, dest);
  }
}

// Async version of replaceInAllFiles
async function asyncReplaceInAllFiles(directory, replacements) {
  const files = await fs.promises.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      // Recursively process subdirectories
      await asyncReplaceInAllFiles(filePath, replacements);
    } else if (stats.isFile()) {
      // Check if it's a text file (exclude binary files)
      const fileExt = path.extname(file).toLowerCase();
      const textExtensions = ['.js', '.json', '.vue', '.html', '.css', '.md', '.ts', '.jsx', '.tsx'];
      if (textExtensions.includes(fileExt) || fileExt === '') {
        try {
          let content = await fs.promises.readFile(filePath, 'utf8');
          let modified = false;
          for (const [placeholder, value] of Object.entries(replacements)) {
            if (content.includes(placeholder)) {
              content = content.replaceAll(placeholder, value);
              modified = true;
            }
          }
          if (modified) {
            await fs.promises.writeFile(filePath, content, 'utf8');
          }
        } catch (err) {
          // Skip files that can't be processed as text
          console.warn(chalk.yellow(`Warning: Couldn't process file ${filePath}: ${err.message}`));
        }
      }
    }
  }
}

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function interactiveMode(options) {
  console.log(chalk.cyan('\n🧙 Let\'s create your new NG-SDMS application!\n'));
  
  // Prepare questions that haven't been answered via command line options
  const questions = [];
  
  // Output folder question
  if (!options.outputFolder) {
    questions.push({
      type: 'input',
      name: 'outputFolder',
      message: 'Where should we create your project?',
      default: '',
      prefix: '📁',
      suffix: chalk.dim(' (leave blank for current directory)'),
    });
  }
  
  // Project name question
  if (!options.projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'What\'s the name of your project?',
      default: 'ng-sdms-app-fe',
      prefix: '📝',
      suffix: chalk.dim(' (e.g. ng-sdms-nama-domain-fe)'),
      validate: (input) => {
        if (!input.trim()) return 'Project name is required!';
        if (!/^[a-z0-9-]+$/i.test(input)) return 'Project name should only contain letters, numbers, and hyphens';
        return true;
      },
      transformer: (input) => chalk.bold.green(input)
    });
  }
  
  // Domain name question
  if (!options.domainName) {
    questions.push({
      type: 'input',
      name: 'domainName',
      message: 'What\'s the domain/business area for this app?',
      default: (answers) => options.projectName || answers.projectName || 'Finance',
      prefix: '🌐',
      suffix: chalk.dim(' (e.g. Finance, HR, Inventory)'),
      validate: (input) => input.trim() ? true : 'Domain name is required!',
      transformer: (input) => chalk.bold.blue(input)
    });
  }
  
  // Port question with validation
  if (!options.domainPort) {
    questions.push({
      type: 'input',
      name: 'domainPort',
      message: 'Which port would you like to use for development?',
      default: '3000',
      prefix: '🔌',
      suffix: chalk.dim(' (between 1024-65535)'),
      validate: (input) => {
        const port = parseInt(input, 10);
        if (isNaN(port)) return 'Port must be a number';
        if (port < 1024 || port > 65535) return 'Port must be between 1024 and 65535';
        return true;
      },
      transformer: (input) => chalk.bold.cyan(input)
    });
  }
  
  try {
    // Get answers from inquirer
    const answers = await inquirer.prompt(questions);
    
    // Combine command line options with answers
    return {
      outputFolder: options.outputFolder || answers.outputFolder,
      projectName: options.projectName || answers.projectName,
      domainName: options.domainName || answers.domainName,
      domainPort: options.domainPort || answers.domainPort,
    };
  } catch (err) {
    throw err;
  }
}

async function createProject(options) {
  try {
    // Convert command-line options to project configs
    const {
      outputFolder,
      projectName,
      domainName,
      domainPort,
      skipGit = false,
      skipInstall = false
    } = options;
    
    const templateDir = path.resolve(__dirname, 'template');
    const baseDir = outputFolder ? path.resolve(processRef.cwd(), outputFolder) : processRef.cwd();
    const targetDir = path.resolve(baseDir, projectName);
    
    // Check if target directory already exists
    if (fs.existsSync(targetDir)) {
      console.error(chalk.red(`Error: Directory already exists: ${targetDir}`));
      processRef.exit(1);
    }
    
    // Generate domain slug from domain name
    const domainSlug = createSlug(domainName);
    const domainCamelCase = domainName
      .split(' ')
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toLowerCase() + word.slice(1)
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');
    
    // Show project creation summary in a nice box
    console.log(boxen(
      chalk.bold(blueGradient('🚀 Project Creation Summary')) + '\n\n' +
      `📁 Location: ${chalk.cyan(targetDir)}\n` +
      `📝 Project Name: ${chalk.green(projectName)}\n` +
      `🏢 Domain: ${chalk.blue(domainName)}\n` +
      `🔗 URL Path: ${chalk.magenta('/' + domainSlug)}\n` +
      `🔌 Port: ${chalk.yellow(domainPort)}\n`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan'
      }
    ));
    
    // Ask for confirmation before proceeding
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: chalk.cyan('Ready to create your awesome NG-SDMS app?'),
      default: true
    }]);
    
    if (!confirm) {
      console.log(chalk.yellow('✋ Project creation cancelled'));
      processRef.exit(0);
    }
    
    // Copy template files with spinner
    let spinner = ora('Copying template files...').start();
    await new Promise(resolve => setTimeout(resolve, 1000)); // For visual effect
    await asyncCopyRecursive(templateDir, targetDir);
    spinner.succeed(chalk.green('Template files copied successfully'));

    // Rename gitignore to .gitignore if present
    const gitignorePath = path.join(targetDir, 'gitignore');
    const dotGitignorePath = path.join(targetDir, '.gitignore');
    try {
      if (fs.existsSync(gitignorePath)) {
        await fs.promises.rename(gitignorePath, dotGitignorePath);
        console.log(chalk.green('Renamed gitignore to .gitignore'));
      }
    } catch (err) {
      console.warn(chalk.yellow(`Warning: Could not rename gitignore: ${err.message}`));
    }
    
    // Replace placeholders in all files with spinner
    spinner = ora('Configuring project files...').start();
    const replacements = {
      '{{projectName}}': projectName,
      '{{DOMAIN_NAME}}': domainCamelCase,
      '{{DOMAIN_NAME_SLUG}}': `/${domainSlug}`,
      '{{DOMAIN_PORT}}': domainPort
    };
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Replace in package.json and all other files
    await asyncReplaceInAllFiles(targetDir, replacements);
    spinner.succeed(chalk.green('Project configuration complete'));
    
    // Install dependencies with spinner
    if (!skipInstall) {
      spinner = ora({
        text: 'Installing dependencies (this may take a few minutes)...',
        spinner: 'dots12'
      }).start();
      try {
        await asyncExec('npm ci', { cwd: targetDir });
        spinner.succeed(chalk.green('Dependencies installed successfully'));
      } catch (err) {
        spinner.fail(chalk.red('Failed to install dependencies'));
        console.error(chalk.red(`Error: ${err.message}`));
        // Continue despite errors - the user can run npm install manually
      }
    } else {
      console.log(chalk.yellow('⚡ Skipping dependency installation (--skip-install)'));
    }
    // Initialize git and make initial commit
    if (!skipGit) {
      spinner = ora('Initializing git repository...').start();
      try {
        await asyncExec('git init', { cwd: targetDir });
        await asyncExec('git add .', { cwd: targetDir });
        await asyncExec('git commit -m "Initial Commit"', { cwd: targetDir });
        spinner.succeed(chalk.green('Git repository initialized'));
      } catch (err) {
        spinner.fail(chalk.yellow('Git initialization failed (not critical)'));
        console.warn(chalk.yellow(`Warning: ${err.message}`));
      }
    } else {
      console.log(chalk.yellow('⚡ Skipping git initialization (--skip-git)'));
    }
    
    // Show completion message with gradient and box
    console.log('\n');
    console.log(boxen(
      coolGradient('✨ Success! Your NG-SDMS application is ready! ✨') + '\n\n' +
      chalk.cyan(`📁 Created at: ${chalk.bold.white(targetDir)}\n\n`) +
      chalk.green(`To get started:\n`) +
      chalk.white(`  cd ${path.relative(processRef.cwd(), targetDir) || '.'}\n`) +
      chalk.white(`  npm run dev\n\n`) +
      chalk.yellow(`🔗 Your app will be available at: ${chalk.bold.white(`http://localhost:${domainPort}/${domainSlug}`)}\n\n`),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    processRef.exit(1);
  }
}

// Helper to run shell commands asynchronously
function asyncExec(command, options = {}) {
  // Set a larger buffer for commands that may output a lot
  const execOptions = { maxBuffer: 10 * 1024 * 1024, ...options };
  return new Promise((resolve, reject) => {
    exec(command, execOptions, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function main() {
  try {
    // Clear terminal for a clean start
    console.clear();
    
    // Display the beautiful ASCII art logo with gradient
    await displayLogo();
    
    // Create the command line program with commander
    const program = new Command();
  
    program
      .name('create-ng-sdms-app')
      .description('Creates a new NG-SDMS application from a template')
      .version('1.0.0')
      .option('-o, --output-folder <path>', 'Output folder (default: current directory)')
      .option('-n, --project-name <n>', 'Project name')
      .option('-d, --domain-name <n>', 'Domain name')
      .option('-p, --domain-port <port>', 'Domain port')
      .option('--skip-git', 'Skip git initialization')
      .option('--skip-install', 'Skip dependency installation');
    
    program.parse();
    
    const options = program.opts();
    let projectConfig = options;
    // Fix: ensure skipGit and skipInstall are passed as booleans
    projectConfig.skipGit = !!options.skipGit;
    projectConfig.skipInstall = !!options.skipInstall;
    // If essential options are missing, go to interactive mode
    if (!options.projectName) {
      projectConfig = await interactiveMode(options);
      // Also propagate skipGit/skipInstall if user used flags interactively
      projectConfig.skipGit = !!options.skipGit;
      projectConfig.skipInstall = !!options.skipInstall;
    }
    // Before creating the project, show a "starting" message with a little drama
    const startSpinner = ora({
      text: '🚀 Preparing to launch your project into existence...',
      spinner: 'moon'
    }).start();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Dramatic pause
    startSpinner.succeed('Target acquired! Beginning project creation sequence');
    // Create the project
    await createProject(projectConfig);
    // Add a little ending message
    console.log('\n' + chalk.dim('Happy coding! Remember, with great code comes great responsibility.') + '\n');
  } catch (err) {
    console.error(chalk.red(`\n❌ Oh no! Something went wrong: ${err.message}`));
    // Show troubleshooting tips
    console.log(boxen(
      chalk.yellow('🔧 Troubleshooting Tips 🔧') + '\n\n' +
      '• Make sure you have Node.js 18+ installed\n' +
      '• Check that you have npm permissions\n' +
      '• Try running with admin/sudo privileges\n' +
      '• Ensure the template directory exists',
      {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: 'single',
        borderColor: 'yellow'
      }
    ));
    processRef.exit(1);
  }
}

// Let the magic begin!
main();
