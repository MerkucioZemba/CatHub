// // 1 GET https://cats.petiteweb.dev/api/single/:user/show - отобразить всех котиков
// // 1 GET https://cats.petiteweb.dev/api/single/:user/ids - отобразить все возможные айди котиков
// // 1 GET https://cats.petiteweb.dev/api/single/:user/show/:id  - отобразить конкретного котика
// // 1 POST https://cats.petiteweb.dev/api/single/:user/add - добавить котика
// // 1 PUT https://cats.petiteweb.dev/api/single/:user/update/:id - изменить информацию о котике
// // 0 DELETE  https://cats.petiteweb.dev/api/single/:user/delete/:id - удалить котика из базы данных

const config = {
	baseUrl: 'https://cats.petiteweb.dev/api/single/merkuciozemba/',
};


class Api {
	constructor(config) {
		this.baseUrl = config.baseUrl;
	}

	getAllCats = () => {
		return fetch(`${this.baseUrl}show`).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};

	addCat = (cat) => {
		return fetch(`${this.baseUrl}add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(cat),
		}).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};

	updateCat = (cat) => {
		return fetch(`${this.baseUrl}update/${cat.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(cat),
		}).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};

	getIdsOfCat = () => {
		return fetch(`${this.baseUrl}ids`).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};

	getCatById = (catId) => {
		return fetch(`${this.baseUrl}show/${catId}`).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};

	deleteCat = (id) => {
		return fetch(`${this.baseUrl}delete/${id}`, {
			method: 'DELETE',
		}).then((res) => {
			return res.ok ? res.json() : Promise.reject('У меня лапки');
		});
	};
}

let api = new Api(config);
