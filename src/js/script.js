'use strict';

window.addEventListener('DOMContentLoaded', () => {

	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');


	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabsContent(i = 0) { 
		//таким образом можно задать дефолтно значение, если при вызове функции мы ничего не передаем
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabsContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (item == target) {
					hideTabContent();
					showTabsContent(i);
				}
			});
		}
	});

	//timer 

	const deadLine = "2021-11-23";

	function getTimeRemaining(endTime) {
		const t = Date.parse(endTime) - Date.parse(new Date());
		//как и через date, но более направленный и явный, потому применяется чаще
		const days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / (1000 * 60 * 60)) % 24),
			minutes = Math.floor((t / (1000 * 60)) % 60),
			seconds = Math.floor((t / 1000) % 60);

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endTime) {
		const timer = document.querySelector(selector),
			days = document.querySelector('#days'),
			hours = document.querySelector('#hours'),
			minutes = document.querySelector('#minutes'),
			seconds = document.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endTime);

			days.textContent = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.textContent = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}
	setClock('.timer', deadLine);

	const btn = document.querySelectorAll('button[data-modal]'),
		modal = document.querySelector('.modal');

		
	const openModalTimer = setTimeout(toggleModal, 30000);
	
	function closeModal(closeBody) {
		closeBody.addEventListener('click', (e) => {
			if (e.target && e.target.classList.contains('modal') || e.target.getAttribute('data-close') == '' ) {
				toggleModal();
			}
		});
		document.addEventListener('keydown', (e) => {
			if (e.code === 'Escape' && modal.classList.contains('modal__active')) { //кнопка по коду, для esc - это Escape
				toggleModal();
			}
		});
	}

	function toggleModal() {
		modal.classList.toggle('modal__active');
		clearInterval(openModalTimer);
		document.body.classList.toggle('overflow-hidden');
				//чтобы не прокручивался контент за модальным окном
	}

	function openModal(button) {
		button.forEach((item) => {
			item.addEventListener('click', () =>{
				toggleModal();
			});
		});
	}

 	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			toggleModal();
			window.removeEventListener('scroll', showModalByScroll); //ч>тко повторить событие
			//убрать обработчик можно только через паредачу в него функции
		}
	}

	window.addEventListener('scroll', showModalByScroll);

	openModal(btn);
	closeModal(modal);

	const menuField = document.querySelector('.menu__field > .container');

	class Menu {
		constructor(imgUrl, imgAlt, menuSubtitle, menuDescr, cost, USDtoUAH, parentSelector, ...classes) {
			this.imgUrl = imgUrl;
			this.imgAlt = imgAlt;
			this.menuSubtitle = menuSubtitle;
			this.menuDescr = menuDescr;
			this.cost = cost;
			this.USDtoUAH = USDtoUAH;
			this.changeToUAH();
			this.parentSelector = parentSelector;
			this.classes = classes;
		}

		changeToUAH() {
			this.price = Math.round(this.cost*this.USDtoUAH);
		}
		//returnInnerHTML() {
		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				//проверка не передается ли пустой массив классов, у которого нельзя другим способом указать дефолтное значение
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => element.classList.add(className));
				//перебор массивы от ...rest и циклом добавление переданных классов элементу
			}
			
			element.innerHTML = `
				<img src=${this.imgUrl} alt=${this.imgAlt}>
				<h3 class="menu__item-subtitle">${this.menuSubtitle}</h3>
				<div class="menu__item-descr">${this.menuDescr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total">
					<span>${this.price}</span> грн/день</div>
				</div>`;
			this.parentSelector.append(element);
			//return HTML;
		}
	}

	
	const fitness = new Menu(
		'img/tabs/vegy.jpg',
		'vegy',
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
		9,
		28,
		menuField);
	const premium = new Menu(
		'img/tabs/elite.jpg',
		'elite',
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
		20,
		28,
		menuField);
	const postnoe = new Menu(
		'img/tabs/post.jpg',
		'post',
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
		12,
		28,
		menuField,
		'menu__item',
		'empty',
		'more');
		

	//можно new Menu(args).render(); не создается ссылка

	fitness.render();
	premium.render();
	postnoe.render();

	//menuField.innerHTML = fitness.returnInnerHTML() + premium.returnInnerHTML() + postnoe.returnInnerHTML();

	const forms = document.querySelectorAll('form');

	const massage = {
		loading: 'img/forms/spinner.svg',
		succes: 'Спасибо, мы с вами свяжемся как можно скорее!',
		failure: 'Произошла ошибка отправки формы',
	};

	forms.forEach(item => {
		postData(item);
	});

	function postData(form) {
		form.addEventListener('submit', (e) => {
			//submit сработает каждый раз, когда мы попытаемся отправить форму
			e.preventDefault();
			const request = new XMLHttpRequest();
			const statusMassage = document.createElement('img');
			statusMassage.src = massage.loading;
			statusMassage.style.cssText = `
			display: block;
			margin: 0 auto;
			`;

			form.insertAdjacentElement('afterend', statusMassage);
			request.open('POST', 'server.php');
			//request.setRequestHeader('Content-type', 'multipar/form-data');
			//hпи использовании FromData не надо устанавливать заголовок, так как он устанавливается автоматически
			//чтобы руками не пришлось формировать из форм объект, можно использовать класс FormData
			//(нормально работает в php)
			const formData = new FormData(form);
			//в верстке, если данные идут на сервер, всегда надо указывать name в теге input

			//если надо получить данные в формате JSON

			//после open
			//request.setRequestHeader('Content-type', 'application/son');
			//const formData = new FormData(form); нельзя formdata заставить сделать JSON
			//const object = {
			//	formData.forEach(function(value, key) {
				//object[key] = value;
			//}) из списка от FromData мы создаем оъект перебором
			//}
			//const json = JSON.stringify(object); после чего помещаем в send вместо FormData
			//php не умеет работать с json напрямую, в php надо дописать
			//$_POST = json_decode(file_get_contents("php://input"), true);

			request.send(formData);

			request.addEventListener('load', () => {
				if (request.status === 200) {
					//console.log(request.response); //лог ответа от сервера
					//который в PHP настроен как эхо нашего POST
					//statusMassage.textContent = massage.//succes; //сообщение успеха
					form.reset(); //очистка формы
					//setTimeout(() => {
					statusMassage.remove(); //удаление сообщения
					//}, 2000);
					showModalAfterSend(massage.succes); 
				} else {
					//statusMassage.textContent = massage.failure;
					showModalAfterSend(massage.failure); 
				}
			});
		});
	}

	function showModalAfterSend(text) {
		if (!modal.classList.contains('modal__active')) {
			toggleModal();
		}

		const prevModalDialog = document.querySelector('.modal__dialog');
		prevModalDialog.classList.add('hide');

		const massageModal = document.createElement('div');
		massageModal.classList.add('modal__dialog');
		massageModal.innerHTML = `<div class="modal__content">
		<div data-close class="modal__close">&times;</div>
		<div class="modal__title">${text}</div>
		</div>`;
		modal.append(massageModal);
		
		setTimeout(() => {
			massageModal.remove();
			prevModalDialog.classList.remove('hide');
		}, 3000);
	}
});