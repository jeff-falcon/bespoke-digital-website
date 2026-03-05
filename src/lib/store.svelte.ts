type MenuStates = 'open' | 'closed';

class BespokeStore {
	menuState = $state<MenuStates>('closed');
	isMenuOpenComplete = $state<boolean>(false);
	pageHasHero = $state<boolean>(false);
	footerHasContactForm = $state<boolean>(true);
	bgColor = $state<string>('var(--bg-dark)');
	inputBorderIsRounded = $state<boolean>(false);
}

export const store = new BespokeStore();
