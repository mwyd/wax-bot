import { createApp } from "vue";
import { initRoot } from "./setup";
import { setupStores } from "@/stores";
import { WXB_LOG } from "./utils";
import App from "./App";

import "./main.css";

const setupApp = async () => {
  try {
    await setupStores();

    const root = initRoot();
    const app = createApp(App);

    app.mount(root);
  } catch (err) {
    WXB_LOG("App setup error", err);
  }
};

setupApp();
