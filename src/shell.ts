import "./css/styles.css";
import { mountCubeDemo } from "./demos/cubeDemo";
import { mountFundamentalsDemo } from "./demos/fundamentalsDemo";
import { mountScreencastDemo } from "./demos/screencastDemo";
import { mountSolarSystemDemo } from "./demos/solarSystemDemo";
import { mountTankDemo } from "./demos/tankDemo";
import { mountTexturesDemo } from "./demos/texturesDemo";
import { mountTigerDemo } from "./demos/tigerDemo";
import { bindViewportHeightSync } from "./utils/bindViewportHeightSync";
import type { DemoFactory } from "./demos/types";

const DEMOS: { id: string; label: string; mount: DemoFactory }[] = [
  { id: "fundamentals", label: "Fundamentals", mount: mountFundamentalsDemo },
  { id: "cube", label: "Cube", mount: mountCubeDemo },
  { id: "screencast", label: "Screencast", mount: mountScreencastDemo },
  { id: "solar-system", label: "Solar system", mount: mountSolarSystemDemo },
  { id: "tank", label: "Tank", mount: mountTankDemo },
  { id: "textures", label: "Textures", mount: mountTexturesDemo },
  { id: "tiger", label: "Tiger (GLTF)", mount: mountTigerDemo },
];

function getShellElements(): {
  tabBar: HTMLElement;
  viewport: HTMLElement;
  canvas: HTMLCanvasElement;
  info: HTMLElement;
  extras: HTMLElement;
} {
  const tabBar = document.querySelector("#tab-bar");
  const viewport = document.querySelector("main.viewport");
  const canvas = document.querySelector("#c");
  const info = document.querySelector("#info2");
  const extras = document.querySelector("#demo-extras");

  if (!(tabBar instanceof HTMLElement)) throw new Error('Missing "#tab-bar"');
  if (!(viewport instanceof HTMLElement)) throw new Error('Missing "main.viewport"');
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Missing "#c"');
  if (!(info instanceof HTMLElement)) throw new Error('Missing "#info2"');
  if (!(extras instanceof HTMLElement)) throw new Error('Missing "#demo-extras"');

  return { tabBar, viewport, canvas, info, extras };
}

export function initShell(): void {
  const { tabBar, viewport, canvas, info, extras } = getShellElements();

  let disposeCurrent: (() => void) | null = null;

  function activate(mount: DemoFactory): void {
    disposeCurrent?.();
    disposeCurrent = null;
    extras.replaceChildren();
    info.textContent = "";
    disposeCurrent = mount({ canvas, info, extras });
  }

  for (const [index, demo] of DEMOS.entries()) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab";
    btn.textContent = demo.label;
    btn.dataset.demoId = demo.id;
    btn.addEventListener("click", () => {
      tabBar.querySelectorAll(".tab").forEach((el) => {
        el.classList.toggle("tab--active", el === btn);
      });
      activate(demo.mount);
    });
    tabBar.appendChild(btn);
    if (index === 0) btn.classList.add("tab--active");
  }

  const syncViewport = bindViewportHeightSync(viewport, tabBar, info);
  activate(DEMOS[0].mount);
  syncViewport();
  requestAnimationFrame(syncViewport);
}
