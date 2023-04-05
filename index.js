let store = window.localStorage; // инициализация локального хранилища
console.log(store);

const refreshCatsAndContent = () => {
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';

	api.getAllCats().then((res) => {
		console.log('getAllCats', res);
		store.setItem('cats', JSON.stringify(res)); // пополнение локального хранилища нашими котами
		const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
		content.insertAdjacentHTML('afterbegin', cards); // загуглите insertAdjacentHTML afterbegin

		let cards2 = document.getElementsByClassName('card');
		for (let i = 0, cnt = cards2.length; i < cnt; i++) {
			const width = cards2[i].offsetWidth;
			cards2[i].style.height = width * 0.6 + 'px';
		}
	});
};

const openCatCardPopup = (cat) => {
	const content = document.getElementsByClassName('content')[0];
	content.insertAdjacentHTML('afterbegin', generateCatCardPopup(cat));

	let catPopup = document.querySelector('.popup-wrapper-cat-card');
	let closeCatPopup = document.querySelector('.popup-close-cat-card');
	console.log(closeCatPopup);
	closeCatPopup.addEventListener('click', () => {
		catPopup.remove();
	});
};


const refreshCatsAndContentSync = () => {
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';

	const cards = JSON.parse(store.getItem('cats')).reduce(
		(acc, el) => (acc += generateCard(el)),
		''
	);
	content.insertAdjacentHTML('afterbegin', cards); // загуглите insertAdjacentHTML afterbegin

	let cards2 = document.getElementsByClassName('card');
	for (let i = 0, cnt = cards2.length; i < cnt; i++) {
		const width = cards2[i].offsetWidth;
		cards2[i].style.height = width * 0.6 + 'px';
	}
};

const addCatInLocalStorage = (cat) => {
	store.setItem(
		'cats',
		JSON.stringify([...JSON.parse(store.getItem('cats')), cat])
	);
};

const getCatsFromLocalStorage = () => {
	return JSON.parse(store.getItem("cats"));
};

const updateCatInLocalStorage = (cat) => {
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

const deleteCatFromLocalStorage = (catId) => {

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

document
	.getElementsByClassName('content')[0]
	.addEventListener('click', (event) => {
		console.log(event.target);
		if (event.target.tagName === 'BUTTON') {
			if (event.target.className === 'cat-card-view content_btn') {
				console.log("add")
				api.getCatById(event.target.value).then((res) => {
					console.log(res);
					openCatCardPopup(res);
				});
			} else if (event.target.className === 'cat-card-update content_btn') {
				console.log("put")
				let cat = getCatFromLocalStorage(event.target.value)[0]
				console.log(cat)

				event.preventDefault();
				if (!popupForm2.classList.contains('active')) {
					popupForm2.classList.add('active');
					popupForm2.parentElement.classList.add('active');
				}
				openCatCardPopup(cat);

				
				api.updateCat(cat).then((res) => {

					console.log(res);

					updateCatInLocalStorage(event.target.value);
					refreshCatsAndContentSync();
				});
			} else if (event.target.className === 'cat-card-delete content_btn') {
				api.deleteCat(event.target.value).then((res) => {
					console.log(res);
					deleteCatFromLocalStorage(event.target.value);
					refreshCatsAndContentSync();
				});
			}
		}
	});


const getNewIdOfCat = () => {
	cats = getCatsFromLocalStorage()
	let max_id = 0;
	for (let i = 0, cnt = cats.length; i < cnt; i++) {
		if (max_id < cats[i].id) {
			max_id = cats[i].id + 1;
		}
	}

	return max_id
};

document
	// .getElementById('reload-page')
	// .addEventListener('click', refreshCatsAndContent);


document.forms[0].addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(event.target);
	const body = Object.fromEntries(formData.entries());

	api.addCat({ ...body, id: getNewIdOfCat() }).then(() => {
		addCatInLocalStorage({ ...body, id: getNewIdOfCat() }); // синхронная замена асинхронщины
		refreshCatsAndContentSync();
	});

});

document.forms[0].addEventListener('update', (event) => {
	event.preventDefault();
	const formData = new FormData(event.target);
	const body = Object.fromEntries(formData.entries());

	api.updateCat({ ...body}).then(() => {
		updateCatInLocalStorage({ ...body});
		refreshCatsAndContentSync();
	});

});


let addBtn = document.querySelector('.add_cat');
// let updateBtn = document.querySelector('.cat-card-update content_btn');
let popupForm = document.querySelector('#popup-form');
let popupForm2 = document.querySelector('#popup-form-2');
let closePopupForm = popupForm.querySelector('.popup-close');

addBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (!popupForm.classList.contains('active')) {
		popupForm.classList.add('active');
		popupForm.parentElement.classList.add('active');
	}
});

// updateBtn.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	if (!popupForm.classList.contains('active')) {
// 		popupForm.classList.add('active');
// 		popupForm.parentElement.classList.add('active');
// 	}
// });

closePopupForm.addEventListener('click', () => {
	popupForm.classList.remove('active');
	popupForm.parentElement.classList.remove('active');
});
