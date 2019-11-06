"use strict";

const container = $('.container');
const result__container = $('.result__container');
const button__count = $('.button__count');
const button__reset = $('.button__reset');
const button__next = $('.button__next');

const question__1 = $('[name="question__1"]');
const question__2 = $('[name="question__2"]');
const question__3 = $('[name="question__3"]');
const question__random = $('.question__random');
const question__const = $('.question__const');

let parameters;


// Функция рандомно выводит целые числа (для произвольного показа 2 или 3 вопросов):
function getRandomQuestion(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


/** Создание окна ошибки:*/
function createPopup  () {
    let popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.zIndex = 1;
    popup.style.padding = '50px';
    popup.style.background = '#fff';
    popup.style.border = '5px solid #ff6d51';
    popup.style.borderRadius = '20px';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.cursor = 'pointer';
    popup.className = 'popup hide';
    return popup;
};


/** Функция добавления элементов диалогового окна на страницу*/
function renderDialog () {
    let fragment = document.createDocumentFragment();
    fragment.appendChild(createPopup());
    document.body.appendChild(fragment);    
};
renderDialog();


/** Функция показа диалогового окна*/
function showDialog (message) {
    popup.textContent = message;    
    popup.classList.toggle('hide');    
};

/** Функция скрытия диалогового окна*/
function hideDialog () {
    popup.classList.add('hide');
};


let popup = document.querySelector('.popup');

// Обработчик события на клик по модальному окну:
popup.addEventListener("mouseup", function () {
    hideDialog();
});


// Функция принимает на вход данные из localStorage и отображает данные в виде ненумерованного списка:
function render (data) {
let health = data.health;
let mood = data.mood;
let money = data.money;
let description = `
	<div class='description'>
		<p><strong>Текущие значения:</strong></p>
		<ul>		
			<li>Здоровье: <span class="current__health">${health}</span></li>
			<li>Настроение: <span class="current__mood">${mood}</span></li>
			<li>Деньги: <span class="current__money">${money}</span></li>
		</ul>
`
let $description = $(description);
container.append($(description));
}


// Функция устанавливает параметры localStorage:
function setLocalStorage(){
localStorage.parameters = JSON.stringify({
	health: 2,
	mood:2,
	money: 125
	});
}


// Функция при загрузке страницы скрывает рандомно один из вопросов (второй или третий),
// добавляя класс "hide", устанавливает параметры localStorage, отображает их на странице,
// показывает предудущее значение localStorage:
$(document).ready(function() {
	if (localStorage.length != 0){
		parameters = JSON.parse(localStorage.parameters);		
		console.log(parameters);		
	}

	setLocalStorage();
	parameters = JSON.parse(localStorage.parameters);
	render(parameters);		
})


// Функция записывает текущие значения localStorage в список "Текущие значения":
function updateResult(health, mood, money) {
	const current__health = document.querySelector('.current__health');
	const current__mood = document.querySelector('.current__mood');
	const current__money = document.querySelector('.current__money');
	current__health.textContent = health;
	current__mood.textContent = mood;
	current__money.textContent = money;
}


// Функция устанавливает параметры localStorage в текущее состояние:
function setParameters(health, mood, money) {
	localStorage.parameters = JSON.stringify({
	health: health,
	mood: mood,
	money: money
	});
}


// Обработчик события на кнопку "Следующий вопрос" (скрывает вопрос №1 и саму кнопку, добавляет следующий вопрос);
button__next.click(function(){
	for (let i=0; i < question__1.length; i++){	
		if(question__1[i].checked){			
			question__const[0].classList.add('hide');
			button__next[0].classList.add('hide');
			question__random[getRandomQuestion(0, 1)].classList.remove('hide');			
		}	
	}
})


// Изменяем текущие значения localStorage, взависимости от выбранных параметров (ответов на вопросы):
button__count.click(function(){	
	if (question__1[0].checked) {	    	
	    parameters.money = parameters.money - 75;
	} else if(question__1[1].checked){
		parameters.health = parameters.health - 1;
	} else if(question__1[2].checked){
	   	parameters.mood = parameters.mood - 1;
	};
	if(question__2.length != 0){ // Проверяем, если длина элемента не равна 0, то заходим в условия. Если равна, то
		// есть эл-т отсутствует, то в условия не заходим.
		if (question__2[0].checked) {	    	
		    parameters.money = parameters.money - 55;
		} else if(question__2[1].checked){
			parameters.health = parameters.health - 1;
			parameters.mood = parameters.mood + 1;
		} else if(question__2[2].checked){
		 	parameters.mood = parameters.mood - 1;
		}
	};
	if(question__3.length != 0){ // Проверяем, если длина элемента не равна 0, то заходим в условия. Если равна, то
		// есть эл-т отсутствует, то в условия не заходим.
		if (question__3[0].checked) {	    	
		    parameters.money = parameters.money + 100;
		    parameters.health = parameters.health - 1;
		} else if(question__3[1].checked){		
			parameters.mood = parameters.mood - 1;
		}
	}
	updateResult(parameters.health, parameters.mood, parameters.money);
	setParameters(parameters.health, parameters.mood, parameters.money);

	if (parameters.health <= 0) {
		let message = 'Мои силы закончились, кажется я заболеваю.';
		showDialog(message);
	} else if (parameters.mood <= 0) {
		let message = 'У меня совсем нет настроения идти в эту школу.';
		showDialog(message);
	}else if (parameters.money <= 0) {
		let message = 'Кажется, я никогда не смогу управлять своими финансами.';
		showDialog(message);
	} else {
		let message = 'Как же хорошо, теперь моя мечта осуществится!';
		showDialog(message);
	};
	button__count[0].classList.add('hide');
})


// Обнуляем рузультат:
button__reset.click(function(){
	location.reload();		
})