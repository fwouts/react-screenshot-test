import { devices, Viewport } from "puppeteer";

export const VIEWPORTS: {
  [name: string]: Viewport;
} = {
  Desktop: {
    width: 1024,
    height: 768
  },
  "iPhone X": devices["iPhone X"].viewport
};
