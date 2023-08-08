import { writable } from 'svelte/store';

type MenuStates = 'open' | 'closed';

export const menuState = writable<MenuStates>('closed');