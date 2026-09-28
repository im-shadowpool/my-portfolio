/**
 * Runs `fn` once the page has finished loading and the browser has a quiet
 * moment, so decorative animation never competes with the first render.
 * Returns a cancel function.
 */
export function afterLoadIdle(fn: () => void, timeout = 1500) {
  let cancelled = false;
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const idle = () => {
    if (cancelled) return;
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(() => !cancelled && fn(), { timeout });
    else timer = setTimeout(() => !cancelled && fn(), 200);
  };

  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", idle);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timer) clearTimeout(timer);
  };
}
