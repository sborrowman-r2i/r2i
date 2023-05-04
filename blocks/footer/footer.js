import { readBlockConfig} from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
	const cfg = readBlockConfig(block);
	block.textContent = '';

	// fetch footer content
	const footerPath = cfg.footer || '/footer';
	const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

	if (resp.ok) {
		const html = await resp.text();

		// decorate footer DOM
		const footer = document.createElement('div');
		footer.innerHTML = html;

		block.append(footer);

		const footerGrid = footer.querySelector('.column-grid > div');
		const footerColumns = [...footerGrid.children]
		
		footerColumns.forEach((column, index) => {
			column.classList.add('column');

			if (index === 1) column.classList.add('footer-links');
		});
	}
}
