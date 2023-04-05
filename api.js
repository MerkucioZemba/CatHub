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
