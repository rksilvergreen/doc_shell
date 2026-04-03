/**
 * nav-buttons — button-side wiring for back / forward header controls.
 *
 * Dispatches navigation actions to doc-layout/navigation.ts, which keeps the
 * scroll stack and performs actual navigation.
 */
import { emitNavBack, emitNavForward } from "../../doc-layout/navigation";

export {};

let ac: AbortController | undefined;

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  const backBtn = document.getElementById("doc-nav-back") as HTMLButtonElement | null;
  const fwdBtn = document.getElementById("doc-nav-fwd") as HTMLButtonElement | null;
  if (!backBtn || !fwdBtn) return;

  backBtn.addEventListener("click", function () {
    emitNavBack();
  }, { signal });

  fwdBtn.addEventListener("click", function () {
    emitNavForward();
  }, { signal });
}

document.addEventListener("astro:page-load", init);
