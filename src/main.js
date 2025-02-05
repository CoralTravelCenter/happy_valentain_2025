import markup from '/src/markup.html?raw'
import './style.css'
import './blob-animation.css'
import './hearts.css'
import {debounce, hostReactAppReady, vimeoAutoPlay} from "./utils.js";

function getRandomHeartImage() {
	const images = [
		'https://b2ccdn.sunmar.ru/content/landing-pages/valentine/hb.png',
		'https://b2ccdn.sunmar.ru/content/landing-pages/valentine/hr.png'
	];

	const randomIndex = Math.floor(Math.random() * images.length);
	return images[randomIndex];
}

class Heart {
    constructor(container, totalHearts = 20) {
        this.container = container;
        this.totalHearts = totalHearts;
        this.spacingX = 5.0; // Расстояние между сердечками по ширине в процентах
        this.spacingY = 5.0; // Расстояние между сердечками по высоте в процентах
        this.heartSize = 100; // Размер сердечка в пикселях
        this.usedPositions = new Set(); // Храним использованные позиции
        this.createHeart();
    }

    getRandomPosition() {
        let x, y, key;
        let maxAttempts = 100;
        let attempts = 0;
        do {
            x = Math.random() * (100 - this.spacingX);
            y = Math.random() * (100 - this.spacingY);
            key = `${Math.round(x)},${Math.round(y)}`;
            attempts++;
        } while (this.usedPositions.has(key) && attempts < maxAttempts);

        this.usedPositions.add(key);
        return { x, y };
    }

    createHeart() {
        // Создаём элемент сердца
        const heart = document.createElement('div');
        heart.classList.add('heart');


        // Добавляем картинку внутрь сердца
        const img = document.createElement('img');
        img.src = getRandomHeartImage();
        img.alt = 'Heart';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        heart.appendChild(img);

        // Добавляем сердечко в контейнер
        this.container.appendChild(heart);

        // Получаем случайные координаты в процентах с равномерным распределением
        const { x, y } = this.getRandomPosition();

        // Устанавливаем позицию сердечка
        heart.style.position = 'absolute';
        heart.style.left = `${x}%`;
        heart.style.top = `${y}%`;
    }


}



hostReactAppReady().then(()=> {
	document.querySelector('#quick-search-tab-area + div').insertAdjacentHTML('afterend', markup)
	vimeoAutoPlay()

	//1) Скрываем надпись по клику на кнопку
	const actionButton = document.querySelector('#start');
	const startScreen = document.querySelector('.start-screen');
	const videoScreen = document.querySelector('.vimeo-screen');
	actionButton.addEventListener('click', ()=> {
		startScreen.style.display = 'none'
		videoScreen.style.display = 'none'
	})

    //2) Скрываем информацию об акции
    const closeBtn = document.querySelector('.close');
    const info = document.querySelector('.conditions');
    const trigger = document.querySelector('.condition-trigger');
    trigger.addEventListener('click', ()=> {
        info.style.display = 'block'
        trigger.style.display = 'none'
    })
    closeBtn.addEventListener('click', ()=> {
        info.style.display = 'none'
    })

    //3) Логика сердечек
	const container = document.querySelector('.heart-container');
    for (let i = 0; i <= 100; i++) {
        new Heart(container)
    }

    let clickCounter = 0

	function handleClick(e) {
        clickCounter++
        e.target.closest('.heart').remove()
        if (clickCounter === 3) {
            trigger.style.display = 'block'
        }
	}

	container.addEventListener('click', handleClick);
})