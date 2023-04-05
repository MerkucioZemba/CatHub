const generateCard = (cat) => {
	return `<div class="${
		cat.favourite ? 'card like' : 'card'
	}" style="background-image: url(${cat.image || 'img/cat.jpg'})">
	<span class="card_text">${cat.name}</span>
	<div class="cat-card-btns">
<button class="cat-card-view content_btn" value=${cat.id}>Посмотреть</button>
<button class="cat-card-update content_btn" value=${cat.id}>Изменить</button>
<button class="cat-card-delete content_btn" value=${cat.id}>Удалить</button>
</div> 
</div>`;
};
