import type { Preview } from "@storybook/vue3-vite";
import { setup } from "@storybook/vue3";
import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import "../src/style.css";

setup((app) => {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: { name: "primevue", order: "theme, base, primevue" },
      },
    },
  });
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
