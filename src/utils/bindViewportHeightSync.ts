/**
 * Sizes <main> in px from the window minus header/footer so WebGL demos get correct
 * clientWidth/clientHeight (canvas intrinsic size + flex alone is unreliable).
 */
export function bindViewportHeightSync(
  viewport: HTMLElement,
  tabBar: HTMLElement,
  info: HTMLElement
): () => void {
  const sync = (): void => {
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const reserved = tabBar.offsetHeight + info.offsetHeight;
    viewport.style.flex = "0 0 auto";
    viewport.style.height = `${Math.max(0, Math.floor(vh - reserved))}px`;
  };

  sync();
  const ro = new ResizeObserver(sync);
  ro.observe(tabBar);
  ro.observe(info);
  window.addEventListener("resize", sync);
  window.visualViewport?.addEventListener("resize", sync);

  return sync;
}
