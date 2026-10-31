// Web app manifest, served at /manifest.webmanifest, so browsers can install
// Unhook as a standalone app. Icons are SVGs in web/public. There is no
// service worker yet, so the app doesn't work offline.

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Unhook",
    short_name: "Unhook",
    description: "Track subscriptions and free trials before they renew.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
