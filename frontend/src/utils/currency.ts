/**
 * Currency conversion utilities for XLM <-> Stroops
 * 1 XLM = 10,000,000 stroops
 */

const STROOPS_PER_XLM = 10_000_000;

/**
 * Convert XLM to stroops
 * @param xlm Amount in XLM
 * @returns Amount in stroops
 */
export function xlmToStroops(xlm: number): number {
  return Math.round(xlm * STROOPS_PER_XLM);
}

/**
 * Convert stroops to XLM
 * @param stroops Amount in stroops
 * @returns Amount in XLM
 */
export function stroopsToXlm(stroops: number): number {
  return stroops / STROOPS_PER_XLM;
}

/**
 * Format XLM amount with proper decimal places
 * @param xlm Amount in XLM
 * @returns Formatted string
 */
export function formatXlm(xlm: number): string {
  return xlm.toFixed(7).replace(/\.?0+$/, '');
}

/**
 * Format stroops amount with thousand separators
 * @param stroops Amount in stroops
 * @returns Formatted string
 */
export function formatStroops(stroops: number): string {
  return stroops.toLocaleString('en-US');
}
