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

	const getData = async (url) => {
		//для получения достаточно ссылки, остального не надо
		const res = await fetch(url); 
		//fetch не выдаст ошибку, только если не будет интернета, ошбики с сервером не отслеживает
		//у промиса, который возвращает fetch есть несколько полезных свойств .ок - что мы получили ответ от сервера
		//второе свойство status - который вернул сервер

		if (!res.ok) {//если res не ок
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
			//мы создаем новый объект ошибки который выкидываем через throuw
		}
		return await res.json();
	};

	function renderSlider(imgSRC, imgAlt, sliderElem) {
		sliderElem = document.querySelector(sliderElem);
		sliderElem.innerHTML = (`<img class='fade' src="${imgSRC}" alt="${imgAlt}"></img>`);
	}

	function sliderCounterTotal(lengthData, totalElem) {
		document.querySelector(totalElem).textContent = addZero(lengthData);
	}

	function sliderCounterCurrent(i, currentElem) {
		i += 1;
		document.querySelector(currentElem).textContent = addZero(i);
	}

	function addZero(item) {
		if (item < 10) {
			item = `0${item}`;
		}
		return item;
	}

	function renderStatusDots(parentElem, classWrapper, classDots, dotsNumber) {
		const parent = document.querySelector(parentElem);
		const wrapperSliderDots = document.createElement('div');
		wrapperSliderDots.classList.add(classWrapper);
		for (let i = 1; i <= dotsNumber; i++) {
			const dot = document.createElement('div');
			//создавать элемент обязательно в цикле
			dot.classList.add(classDots);
			dot.dataset.dot = i;
			wrapperSliderDots.append(dot);
			
		}
		parent.append(wrapperSliderDots);
	}

	function SliderDotsActive (i, dots) {
		dots.forEach(item => {
			item.classList.remove('offer__slider_dots-active');
			if (item.dataset.dot == i + 1) {
				item.classList.add('offer__slider_dots-active');
			}
		});
	}

	function sliderBtn(btnParentClass, btnNext, btnPrev, imgData, sliderItem, currentElem, totalElem, classDots) {
		let i = 0;
		let lengthData = imgData.length;
		let img = function() {
			if (i + 1 > lengthData) {
				i = 0;
			} else if (i < 0) {
				i = lengthData - 1;
			}
			return imgData[i];
		};

		renderStatusDots('.offer__slider', 'offer__slider_dots-wrapper', 'offer__slider_dots', lengthData);
		const dots = document.querySelectorAll(classDots);
		renderSlider(img().img, img().altimg, sliderItem);
		sliderCounterCurrent(i, '#current',);
		SliderDotsActive(i, dots);
		document.querySelector(btnParentClass).addEventListener('click', (e) => {
			if (e.target.classList.contains(btnNext)) {
				++i;
				renderSlider(img().img, img().altimg, sliderItem);
			} else if (e.target.classList.contains(btnPrev)) {
				--i;
				renderSlider(img().img, img().altimg, sliderItem);
			} else if (e.target.dataset.dot) {
				i = e.target.dataset.dot - 1;
				renderSlider(img().img, img().altimg, sliderItem);
			}
			sliderCounterCurrent(i, currentElem);
			SliderDotsActive(i, dots);
		});

		sliderCounterTotal(lengthData, totalElem);
	}

	getData('http://localhost:3000/slider')
	.then(data => {
		sliderBtn('.offer__slider', 'nextBtn', 'prevBtn', data, '.offer__slide', '#current', '#total', '.offer__slider_dots');
	});

/* 	dots.forEach(item => {
		item.addEventListener('click', () => {
			i = item.dataset.dot - 1;
			renderSlider(img().img, img().altimg, sliderItem);
			sliderCounterCurrent(i, currentElem);
			SliderDotsActive(i, dots);
		});
	}); */

	    // Slider ваниант кода преподавателя
/* 
		let slideIndex = 1;
		const slides = document.querySelectorAll('.offer__slide'),
			prev = document.querySelector('.offer__slider-prev'),
			next = document.querySelector('.offer__slider-next'),
			total = document.querySelector('#total'),
			current = document.querySelector('#current');
	
		showSlides(slideIndex);
	
		if (slides.length < 10) {
			total.textContent = `0${slides.length}`;
		} else {
			total.textContent = slides.length;
		}
	
		function showSlides(n) {
			if (n > slides.length) {
				slideIndex = 1;
			}
			if (n < 1) {
				slideIndex = slides.length;
			}
	
			slides.forEach((item) => item.style.display = 'none');
	
			slides[slideIndex - 1].style.display = 'block'; 
			// Как ваша самостоятельная работа - переписать на использование классов show/hide
			
			if (slides.length < 10) {
				current.textContent =  `0${slideIndex}`;
			} else {
				current.textContent =  slideIndex;
			}
		}
	
		function plusSlides (n) {
			showSlides(slideIndex += n);
		}
	
		prev.addEventListener('click', function(){
			plusSlides(-1);
		});
	
		next.addEventListener('click', function(){
			plusSlides(1);
		}); */

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

	getData('http://localhost:3000/menu')
	.then(data => {
		data.forEach(({img, altimg, title, descr, price}) => { //деструктуризация объекта
			//наша функция render() создана выше
			//new Menu(obj.img, obj.altimg, obj.title, obj.descr, obj.price).render();
			new Menu(img, altimg, title, descr, price, 28, menuField).render(); //вызываем метод класса подставляя значения
		});
	});

	//библиотека axios, не надо писать функцию с getData и преобразовывать данные
	//axios.get('http://localhost:3000/menu')//Запрост получен, больше информации и уже в нужном нам формате
	//.then(data => {
		//data.data.forEach(({img, altimg, title, descr, price}) => { 
			//тафтология с data.data из-за того, что нам нужная не общая информация, а именно лежащая в ответе пункт с data
			//new Menu(img, altimg, title, descr, price, 28, menuField).render();
		//});
	//});


	//альтернативный способ, если не нужна шаблонизация, просто создать через функцию
	/* getData('http://localhost:3000/menu').then(data => {
		createCard(data);
	}); */

	//можно обойтись без классов
	function createCard(data) {
		data.forEach(({img, altimg, title, descr, price}) => { //деструктуризация на отдельные свойства
			const element = document.createElement('div');
			price = price*28;

			element.classList('menu__item');

			element.innerHTML= `верстка с элементами уже без this ${img}, ${altimg}, ${title}, ${descr}`;

			document.querySelector('.menu .container').append(element);
		});
	}


	/* 	const fitness = new Menu( заменяем данными с сервера json-server
		'img/tabs/vegy.jpg',
		'vegy',
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд:...',
		9,
		28,
		menuField);
	const premium = new Menu(
		'img/tabs/elite.jpg',
		'elite',
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн...',
		20,
		28,
		menuField);
	const postnoe = new Menu(
		'img/tabs/post.jpg',
		'post',
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов...',
		12,
		28,
		menuField,
		'menu__item',
		'empty',
		'more'); */
		

	//можно new Menu(args).render(); не создается ссылка

	/* fitness.render();
	premium.render();
	postnoe.render(); вызов функции render() на объект*/

	//menuField.innerHTML = fitness.returnInnerHTML() + premium.returnInnerHTML() + postnoe.returnInnerHTML();

	const forms = document.querySelectorAll('form');

	const massage = {
		loading: 'img/forms/spinner.svg',
		succes: 'Спасибо, мы с вами свяжемся как можно скорее!',
		failure: 'Произошла ошибка отправки формы',
	};

	forms.forEach(item => {
		bindPostData(item);
	});

	const postData = async (url, data) => { //переносим fetch в отдельную функцию
		//async говорит, что внутри функции асинхронный код
		const res = await fetch(url, { //await говорит о том, что надо дождаться fetch
			//прежде чем переходит к return
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: data, 
		}); 
		return await res.json(); //и здесь await - мы не знаем, через сколько данные обработаются
		//это все асинхронный код, fetch возвращает промис, который изначально будет пустым и json ничего не вернет
	};

	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			//submit сработает каждый раз, когда мы попытаемся отправить форму
			e.preventDefault();
			//const request = new XMLHttpRequest(); уже не надо
			const statusMassage = document.createElement('img');
			statusMassage.src = massage.loading;
			statusMassage.style.cssText = `
			display: block;
			margin: 0 auto;
			`;

			form.insertAdjacentElement('afterend', statusMassage);

			const formData = new FormData(form);

			/* const object = {};
			formData.forEach((value, key) => {
			object[key] = value;
			});  *///для отправки с fetch формата JSON
			//меняет обработчик выше на более современный

			//formData.entries() на выходе получим массив массивов из объекта типа
			// [['a', 23], ['b', 4]] дальше необходимо опять сделать объект для передачи в JSON
			//для этого есть обратный метод fromEntries
			//таким образом справа на лево массив массивов => обект => формат json

			const json = JSON.stringify(Object.fromEntries(formData.entries())); 


			//особенность fetch не перейдет в состояние отклонено, если столкнулся с http протоколом (например 404)
			//он все равно выполнится нормально и при ошибке
			//свойство status перейдет в false
			//ошибко будет только если что-то помешает запросу выполнится вообще

			/* fetch('server.php', { ненужен, так как выше сделали функцию
				method: 'POST',
				//заголовок для json
				headers: {
					'Content-type': 'application/json'
				}, //при отправке formData не надо делать заголовок
				//body: JSON.stringify(object) //header и body нужен для JSON, до fetch надо запустить цикл
				body: formData
			}) */
			
			
		postData('http://localhost:3000/requests', json/* JSON.stringify(object) */)
		//.then(data => data.text()) //преобразование ответа от сервера, уже не надо, это происходит в post data
			.then(data => {
				console.log(data);
				form.reset();
				statusMassage.remove();
				showModalAfterSend(massage.succes); 
			}).catch(() => {
				showModalAfterSend(massage.failure); //кетч необходимо прописывать всегда на случай ошибок
			}).finally(() => {
				form.reset(); //действие, которое должно выполнятся вне зависимости от результата
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

	//calculator

	const result = document.querySelector('.calculating__result span');
	let sex = 'female',	
		height, weight, age,
		ratio = 1.375;
	
	function calcTotal() {
		if (!sex || !height || !weight || !ratio || !age) {
			result.textContent = '0000';
			return;
		}

		if (sex === 'female') {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.2 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}

	calcTotal();

	function getStaticInformation (parentSelector, activeClass) {
		const element = document.querySelectorAll(`${parentSelector} div`);

		document.querySelector(parentSelector).addEventListener('click', (e) => {
			if (e.target.getAttribute('data-ratio')) {
				ratio = +e.target.getAttribute('data-ratio');
			} else { //нажимает на кнопку, если это не data-ratio, остается только кнопка пола, сокращение кода
				sex = e.target.getAttribute('data-gender');
			}
			
			if (e.target.getAttribute('data-gender') || e.target.getAttribute('data-ratio')) {
				element.forEach(elem => {
					elem.classList.remove(activeClass);
				});
				e.target.classList.add(activeClass);
			}

			calcTotal();
		});
	}

	getStaticInformation('#gender', 'calculating__choose-item_active');
	getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

	function getDinamicInformation(selector) {
		const input = document.querySelector(selector);

		input.addEventListener('input', (e) => {
			switch(input.getAttribute('id')) {
				case 'height':
					height = +input.value;
					break;
				case 'weight':
					weight = +input.value;
					break;
				case 'age':
					age = +input.value;
					break;
			}

			calcTotal();
		});
	}

	getDinamicInformation('#height');
	getDinamicInformation('#weight');
	getDinamicInformation('#age');

	/* fetch('http://localhost:3000/menu')
	.then(data => data.json())
	.then(res => console.log(res)); */


	//server-json
	// npm i json-server --save-dev
	//npm - npm пакеты
	//i - сокращение от install
	//json-server - название пакета
	//можно указать -g для глобальной установки. Потребуется в начале писать sudo
	//--save-dev  мы говорим, что испольуем для разработки. Зависимость для разработки
	//если нужен пакет для работы внутри, тогда просто --save
	//до установки надо указать npm init для создани пакета
	//package.json содержит информацию от пакетах и ту, что мы в него положили
	//package-lock.json - информация о зависимостях установленных пакетов

	//далее при наличии package.json достаточно прописать в терминале npm i и подятнутся все пакеты
});