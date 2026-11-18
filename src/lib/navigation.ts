/**
 * Safe External Navigation Helpers
 * Uses programmatic anchor dispatch instead of window.open so external links
 * (WhatsApp, social links) remain reliable inside sandboxed iframes and PWAs.
 */

export function openExternalUrl(url: string): void {
  if (typeof document === 'undefined' || !url) return;

  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } catch {
    window.location.assign(url);
  }
}
