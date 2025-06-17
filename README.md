# NG-SDMS Template Generator

A modern CLI tool to quickly scaffold a Vue 3 + Vite + Tailwind + DevExtreme project, with customizable domain, port, and project name. Perfect for rapid SDMS (Single Domain Management System) frontend development.

---

## ✨ Features
- **Interactive CLI**: Friendly prompts for project name, domain, and port
- **Customizable Template**: All placeholders replaced in files and folders
- **Modern Stack**: Vue 3, Vite, Tailwind CSS, DevExtreme UI
- **Auto Dependency Install**: Runs `npm ci` for you
- **Git Init**: Initializes a new git repo with an initial commit
- **ASCII Art & Tips**: Fun, engaging CLI experience

---

## 🚀 Getting Started

### 1. Install dependencies
```sh
npm install
```

### 2. Run the CLI
You can run the generator with either interactive prompts or command-line arguments:

#### Interactive mode
```sh
npx create-ng-sdms-app
```

#### Non-interactive mode
```sh
npx create-ng-sdms-app \
  --project-name ng-sdms-finance-fe \
  --domain-name "Finance" \
  --domain-port 3000
```

---

## 🛠️ CLI Options
| Option                | Description                        |
|-----------------------|------------------------------------|
| `-n, --project-name`  | Project name (e.g. my-sdms-fe)     |
| `-d, --domain-name`   | Domain/business area (e.g. Finance) |
| `-p, --domain-port`   | Port for dev server (default: 3000) |
| `-o, --output-folder` | Output folder (default: .)         |
| `--skip-git`          | Skip git initialization            |
| `--skip-install`      | Skip dependency installation       |

---

## 📦 Template Structure
- `template/` — The project template (Vue, Vite, Tailwind, DevExtreme)
- Placeholders like `{{projectName}}`, `{{DOMAIN_NAME}}`, `{{DOMAIN_NAME_SLUG}}`, `{{DOMAIN_PORT}}` are replaced automatically

---

## 📝 Customization
- Edit the `template/` folder to change the default project structure
- Add more placeholders as needed (update the CLI to support them)

---

## 🤝 Contributing
Pull requests and suggestions are welcome! Please open an issue or PR.

---

## 📄 License
MIT

---

## 💡 Example Output
```
$ npx create-ng-sdms-app

🚀 Project Creation Summary

📁 Location: ./my-sdms-fe
📝 Project Name: my-sdms-fe
🏢 Domain: Finance
🔗 URL Path: /finance
🔌 Port: 3000

✨ Success! Your NG-SDMS application is ready! ✨

To get started:
  cd my-sdms-fe
  npm run dev

🔗 Your app will be available at: http://localhost:3000/finance
```
