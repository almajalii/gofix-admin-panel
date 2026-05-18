/**
 * Shared form element class strings.
 * All class names are static so Tailwind JIT can scan them.
 *
 * Semantic tokens (bg-surface, text-ink, border-line, …) read from CSS vars
 * so we don't need `dark:` prefixes for theme switching.
 *
 * NOTE: Webkit autofill styling lives in index.css under `input:-webkit-autofill`.
 * Doing it there (instead of with Tailwind arbitrary variants) lets the rule
 * use the same --gf-* vars as everything else, so it auto-themes for light/dark
 * without needing to duplicate every declaration.
 */
import { gfx } from './themeColors';

export const labelClass = gfx.label;

export const inputClass      = `px-4 py-2.5 ${gfx.inputBase}`;
export const largeInputClass = `px-4 py-3 text-base ${gfx.inputBase}`;

export const inputClassWithError = `${inputClass} ${gfx.inputError}`;