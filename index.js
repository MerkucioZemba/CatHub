let store = window.localStorage;
console.log(store);

const refreshCatsAndContent = () => { //отрисовка карточек
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';

	api.getAllCats().then((res) => {
		console.log('getAllCats', res);
		store.setItem('cats', JSON.stringify(res));
		const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
		content.insertAdjacentHTML('afterbegin', cards);

		let cards2 = document.getElementsByClassName('card');
		for (let i = 0, cnt = cards2.length; i < cnt; i++) {
			const width = cards2[i].offsetWidth;
			cards2[i].style.height = width * 0.6 + 'px';
		}
	});
};

const openCatCardPopup = (cat) => { //добавление котика
	const content = document.getElementsByClassName('content')[0];
	content.insertAdjacentHTML('afterbegin', generateCatCardPopup(cat));

	let catPopup = document.querySelector('.popup-wrapper-cat-card');
	let closeCatPopup = document.querySelector('.popup-close-cat-card');
	console.log(closeCatPopup);
	closeCatPopup.addEventListener('click', () => {
		catPopup.remove();
	});
};


const refreshCatsAndContentSync = () => { //получение котиков из local storage
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';

	const cards = JSON.parse(store.getItem('cats')).reduce(
		(acc, el) => (acc += generateCard(el)),
		''
	);
	content.insertAdjacentHTML('afterbegin', cards);

	let cards2 = document.getElementsByClassName('card');
	for (let i = 0, cnt = cards2.length; i < cnt; i++) {
		const width = cards2[i].offsetWidth;
		cards2[i].style.height = width * 0.6 + 'px';
	}
};

const addCatInLocalStorage = (cat) => { //добавление в local storage
	store.setItem(
		'cats',
		JSON.stringify([...JSON.parse(store.getItem('cats')), cat])
	);
};

const getCatsFromLocalStorage = () => {
	return JSON.parse(store.getItem("cats"));
};

const updateCatInLocalStorage = (cat) => { //изменение в local storage
	let cats = getCatsFromLocalStorage();
	for (let i = 0, cnt = cats.length; i < cnt; i++) {
		if (cats[i].id == cat.id) {
			cats[i] = cat;
			break;
		}
	}
	store.setItem(
		'cats',
		JSON.stringify(cats)
	);
};

const deleteCatFromLocalStorage = (catId) => { //удаление

	store.setItem(
		'cats',
		JSON.stringify(
			JSON.parse(store.getItem('cats')).filter((el) => el.id != catId)
		)
	);
};

const getCatFromLocalStorage = (catId) => {
	return JSON.parse(store.getItem('cats')).filter((el) => el.id == catId)

};

refreshCatsAndContent();

const update_btn = document.querySelector('.update_cat');
update_btn.addEventListener('click', (event) => {
	refreshCatsAndContent();
});

document
	.getElementsByClassName('content')[0]
	.addEventListener('click', (event) => {
		console.log(event.target);
		if (event.target.tagName === 'BUTTON') {
			if (event.target.className === 'cat-card-view content_btn') { //просмотр
				console.log("add")
				api.getCatById(event.target.value).then((res) => {
					console.log(res);
					openCatCardPopup(res);
				});
			} else if (event.target.className === 'cat-card-update content_btn') { //изменение
				console.log("put")
				let cat = getCatFromLocalStorage(event.target.value)[0]
				console.log(cat)

				event.preventDefault();
				if (!popupForm2.classList.contains('active')) {
					popupForm2.classList.add('active');
					popupForm2.parentElement.classList.add('active');
				}
				/*openCatCardPopup(cat);*/
				
				console.log(popupForm2);

				const elements = document.querySelector(".updateForm").elements;
				elements.name.value = cat.name;
				elements.age.value = cat.age;
				elements.rate.value = cat.rate;
				elements.description.value = cat.description;
				console.log(elements);

				popupForm2.addEventListener('submit', (event) => {
					event.preventDefault();
					const formData = new FormData(event.target);
					const body = Object.fromEntries(formData.entries());
					const catObj = {id:cat.id, ...body};
				
					api.updateCat({id:cat.id, ...body}).then(() => {
						updateCatInLocalStorage({id:cat.id, ...body});
						refreshCatsAndContentSync();
					});
				
				});

			} else if (event.target.className === 'cat-card-delete content_btn') { //удаление
				api.deleteCat(event.target.value).then((res) => {
					console.log(res);
					deleteCatFromLocalStorage(event.target.value);
					refreshCatsAndContentSync();
				});
			}
		}
	});


const getNewIdOfCat = () => { //функция генерации id для нового кота
	let res = JSON.parse(store.getItem('cats')); 
	if (res.length) {
	  return Math.max(...res.map((el) => el.id)) + 1; //здесь максимально значение из имеющихся на этот момент и увеличение его на единицу
	} else {
	  return 1;
	}
  };


document.forms[0].addEventListener('submit', (event) => { //отправка формы
	event.preventDefault();
	const formData = new FormData(event.target);
	const body = Object.fromEntries(formData.entries());

	api.addCat({ ...body, id: getNewIdOfCat() }).then(() => {
		addCatInLocalStorage({ ...body, id: getNewIdOfCat() });
		refreshCatsAndContentSync();
	});
	document.forms[0].reset();
	document.forms[0].classList.remove('.active');
});

let addBtn = document.querySelector('.add_cat');
let popupWrapper = document.querySelector(".popup-wrapper");
let popupForm = document.querySelector('#popup-form');
let popupForm2 = document.querySelector('#popup-form-2');
let closePopupForm = popupForm.querySelector('.popup-close-btn1');
let closePopupForm2 = popupForm2.querySelector('.popup-close-btn2');

addBtn.addEventListener('click', (e) => {
	e.preventDefault();
	popupForm.classList.add('active');
	popupForm.parentElement.classList.toggle('active');

	const formData = new FormData(event.target);
	const body = Object.fromEntries(formData.entries());

	api.addCat({ ...body, id: getNewIdOfCat() }).then(() => {
		addCatInLocalStorage({ ...body, id: getNewIdOfCat() });
		refreshCatsAndContentSync();
	});
	popupForm.reset();
	popupForm.classList.toggle('active');
	popupWrapper.classList.toggle('active');
});


closePopupForm.addEventListener('click', () => {
	popupForm.classList.remove('active');
	popupForm.parentElement.classList.remove('active');
	popupWrapper.remove();
});

closePopupForm2.addEventListener('click', () => {
	popupForm2.classList.remove('active');
	popupForm2.parentElement.classList.remove('active');
});