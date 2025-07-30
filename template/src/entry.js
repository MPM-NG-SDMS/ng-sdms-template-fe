/* eslint-disable vue/multi-word-component-names */
import "./assets/main.css"; // Import global styles
import "./assets/dx.material.custom-scheme.css"; // Import DevExtreme styles

import { createApp } from "vue";
import { createPinia } from "pinia"; // Import Pinia for state management
import config from "devextreme/core/config"; // Import DevExtreme config

import App from "./App.vue";
import router from "./router";
import i18n from "./lib/i18n";

let app = null;

// Apply DevExtreme configuration
config({
  licenseKey: import.meta.env.VITE_LICENSE_KEY_DEVEXTREME, // Use the license key from .env
  defaultCurrency: "IDR", // Set the default currency
});

export const mount = (container) => {
  if (app == null) {
    app = createApp(App);

    app.use(i18n);
    
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: value,
          storageArea: localStorage,
          url: window.location.href,
        })
      );
    };

    window.addEventListener("storage", (event) => {
      console.log("Storage event detected:", event);

      if (event.key === "locale" && event.newValue) {
        i18n.global.locale.value = event.newValue;
      }
    });

    // Use Pinia and Router
    app.use(createPinia());
    app.use(router);

    try {
      app.mount(container);
    } catch (error) {
      console.error("ERROR: entry.ts mount()", error);
    }
  }
};

export const unmount = () => {
  if (app != null) {
    app.unmount();
    window.removeEventListener("storage");

    app = null;
  } else {
    console.warn("App is not mounted.");
  }
};

export const navigate = (path) => {
  if (router) {
    router.push(path).catch(() => {}); // ignore NavigationDuplicated errors
  }
};
