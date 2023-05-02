export default function decorate(block) {
	const cols = [...block.firstElementChild.children];
	
	block.classList.add(`columns-${cols.length}-cols`);

	// setup image columns
	[...block.children].forEach((row) => {
		row.classList.add('column-grid');

		[...row.children].forEach((column) => {
			const pic = column.querySelector('picture');

			column.classList.add('column');

			if (!pic || !pic.closest('div')) return;

			pic.closest('div').classList.add('column-image');
		});
	});
}
