# Vue 3 + Vite + Tailwind Template

A modern, production-ready template for Vue 3 applications with Vite, Tailwind CSS, and other essential tools.

## Features

- ⚡️ [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), [npm](https://npm.io/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/)
- 📦 [Pinia](https://pinia.vuejs.org/) for state management
- 🚦 [Vue Router](https://router.vuejs.org/) for routing
- 📝 [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for code formatting
- 🎯 [Zod](https://zod.dev/) for schema validation
- 🔔 [Vue Sonner](https://vue-sonner.vercel.app/) for toast notifications
- 🎨 [Phosphor Icons](https://phosphoricons.com/) and [Lucide Icons](https://lucide.dev/)
- 🎨 [Shadcn/vue](https://www.shadcn-vue.com/) for UI element

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── lib/           # Third-party library configurations
├── router/        # Vue Router configuration
├── stores/        # Pinia stores
├── utils/         # Utility functions
└── views/         # Page components
```

## Getting Started

1. Clone this template:
```bash
git clone <your-template-repo-url> my-project
cd my-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm build
```

## Customization

### Project Name
Update the following files with your project name:
- `package.json`: Update the `name` field
- `index.html`: Update the title

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_VERSION=your_app_version

VITE_LICENSE_KEY_DEVEXTREME=devextrme_license_key

VITE_BASE_URL_APP=your_base_url_app || '/'
VITE_BASE_URL_API=your_base_url_api
```

### Styling
- Customize Tailwind CSS in `src\assets\main.css`

## Best Practices

1. **Component Organization**
   - Place reusable components in `src/components`
   - Page-specific components in `src/views`
   - Use PascalCase for component names

2. **State Management**
   - Use Pinia stores for global state
   - Keep stores organized by feature

3. **Routing**
   - Define routes in `src/router/index.js`
   - Use lazy loading for better performance

4. **API Integration**
   - Use the provided axios instance in `src\lib\ourAxios.js`