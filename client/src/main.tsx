import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;

// If SSG pre-rendered content exists, hydrate; otherwise do a fresh render
if (rootEl.innerHTML.trim()) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
