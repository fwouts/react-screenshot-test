import { devices } from "puppeteer";
import { Viewport } from "../lib";

export const VIEWPORTS: {
  [name: string]: Viewport;
} = {
  Desktop: {
    width: 1024,
    height: 768,
  },
  "iPhone X": devices["iPhone X"].viewport,
};
