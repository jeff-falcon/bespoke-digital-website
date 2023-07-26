<button on:click type="button">
	<svg width="5" height="6" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M5 2.99993L0.5 5.59801L0.5 0.401855L5 2.99993Z" />
	</svg>
</button>

<style>
	button {
		background: transparent;
		border: 1px solid var(--text-light-40);
		width: var(--button-height-large);
		height: var(--button-height-large);
		cursor: pointer;
		transition: linear 180ms border-color;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	button:hover {
		border-color: var(--text-light);
	}
	svg {
		fill: var(--text-light);
		display: block;
	}
</style>
