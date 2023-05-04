import { getMetadata, decorateButtons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav) {
	const button = nav.querySelector('.nav-hamburger button');
	const expanded = button.getAttribute('aria-expanded') === 'true';
	document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
	button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
	button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
	// fetch nav content
	const navMeta = getMetadata('nav');
	const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
	const resp = await fetch(`${navPath}.plain.html`);

	if (resp.ok) {
		const html = await resp.text();

		// decorate nav DOM
		const nav = document.createElement('nav');
		nav.id = 'nav';
		nav.innerHTML = html;

		const classes = ['brand', 'sections', 'tools'];
		classes.forEach((c, i) => {
			const section = nav.children[i];
			if (section) section.classList.add(`nav-${c}`);
		});

		const navSections = nav.querySelector('.nav-sections');
		if (navSections) {
			navSections.querySelectorAll('a').forEach((navLink) => {
				navLink.addEventListener('click', (event) => {
					event.preventDefault();
					const jumpLink = navLink.getAttribute('href');
					const jumpLocation = document.querySelector(jumpLink).closest('.section');

					window.scrollTo({
						top: jumpLocation.offsetTop,
						behavior: 'smooth',
					});
				});
			});
		}

		const navTools = nav.querySelector('.nav-tools');
		if (navTools) decorateButtons(navTools);

		// hamburger for mobile
		const hamburger = document.createElement('div');
		hamburger.classList.add('nav-hamburger');
		hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
				<span class="nav-hamburger-icon"></span>
			</button>`;
		hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
		nav.append(hamburger);
		hamburger.querySelector('button').setAttribute('aria-expanded', 'false');

		const navWrapper = document.createElement('div');
		navWrapper.className = 'nav-wrapper';
		navWrapper.append(nav);
		block.append(navWrapper);
	}
}
