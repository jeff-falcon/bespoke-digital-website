import { writable } from 'svelte/store';

type MenuStates = 'open' | 'closed';

export const menuState = writable<MenuStates>('closed');
export const pageHasHero = writable<boolean>(false);
export const footerHasContactForm = writable<boolean>(true);
export const bgColor = writable<'default' | 'rust' | 'olive'>('default');