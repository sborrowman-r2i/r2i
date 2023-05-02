export default function decorate(block) {
	[...block.children].forEach((row) => {
		row.classList.add('card');

		[...row.children].forEach((cardContent) => {
			const cardClass = cardContent.querySelector('picture') ? 'card-image' : 'card-copy';

			cardContent.classList.add(cardClass);
		});
	});
}
