const generateCatCardPopup = (cat) => {
	return `<div class="popup-wrapper-cat-card active">
		<div class="popup-cat-card active">
		<div class="popup-close-cat-card btn"><i class="fa-solid fa-xmark"></i></div>
			<div class="${
							cat.favourite ? 'card like' : 'card'
						}" style="background-image: url(${
		cat.image || 'img/cat.jpg'
	})">
			<div>${cat.name}</div>
			<div>${cat.description}</div>
			<div>${cat.age}</div>
			<div>${cat.rate}</div>
		</div>
	</div>`;
};
