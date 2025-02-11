import markup from '../markup.html?raw'
import '../styles/style.scss'
import {hostReactAppReady, vimeoAutoPlay} from './utils'

let HEARTS = null
class Heart {
	constructor(container, totalHearts = 20, borderReductionPercent = 20) {
		console.log(totalHearts)
		this.container = container
		this.totalHearts = totalHearts
		this.borderReductionPercent = borderReductionPercent / 100 // Преобразуем в долю (20% → 0.2)
		this.usedPositions = new Set() // Храним использованные позиции
		this.createHearts()
	}

	getRandomPosition() {
		const rect = this.container.getBoundingClientRect()
		const reducedWidth = (1 - this.borderReductionPercent) * 100 // Уменьшаем ширину в процентах
		const reducedHeight = (1 - this.borderReductionPercent) * 100 // Уменьшаем высоту в процентах
		const offsetX = (this.borderReductionPercent / 2) * 100 // Смещение влево
		const offsetY = (this.borderReductionPercent / 2) * 100 // Смещение вверх

		let x, y, key
		let maxAttempts = 100
		let attempts = 0
		do {
			x = Math.random() * reducedWidth + offsetX
			y = Math.random() * reducedHeight + offsetY
			key = `${x.toFixed(2)},${y.toFixed(2)}` // Больше точности
			attempts++
		} while (this.usedPositions.has(key) && attempts < maxAttempts)

		this.usedPositions.add(key)
		return { x, y }
	}

	createHearts() {
		for (let i = 0; i < this.totalHearts; i++) {
			this.createHeart()
		}
	}

	createHeart() {
		// Создаём элемент сердца
		const heart = document.createElement('div')
		heart.classList.add('heart')

		// Добавляем картинку внутрь сердца
		const img = document.createElement('img')
		img.src = getRandomHeartImage()
		img.alt = 'Heart'
		heart.appendChild(img)

		// Добавляем сердечко в контейнер
		this.container.appendChild(heart)

		// Получаем случайные координаты
		const { x, y } = this.getRandomPosition()

		// Устанавливаем позицию сердечка в %
		heart.style.left = `${x}%`
		heart.style.top = `${y}%`
	}
}

// Функция для случайного выбора изображения сердца
function getRandomHeartImage() {
	const images = [
		'https://b2ccdn.sunmar.ru/content/landing-pages/valentine/hb.png',
		'https://b2ccdn.sunmar.ru/content/landing-pages/valentine/hr.png',
	]
	const randomIndex = Math.floor(Math.random() * images.length)
	return images[randomIndex]
}



hostReactAppReady().then(() => {
	if(!document.querySelector('section.valentine')) {
		document
			.querySelector('#quick-search-tab-area + div')
			.insertAdjacentHTML('afterend', markup)
	}
	vimeoAutoPlay()

	//1) Скрываем надпись по клику на кнопку
	const actionButton = document.querySelector('#start')
	const startScreen = document.querySelector('.valentine__screen--start')
	const videoScreen = document.querySelector('.valentine__screen--video')
	const heartsContainer = document.querySelector('.valentine__heart-container');
	actionButton.addEventListener('click', () => {
		heartsContainer.classList.remove('js-hidden')
		startScreen.classList.add('js-hidden')
		videoScreen.classList.add('js-hidden')
	})

	//2) Скрываем информацию об акции
	const closeConditionsBtn = document.querySelector('.valentine__conditions-close')
	const trigger = document.querySelector('.valentine__trigger')
	const expand = document.querySelector('.valentine__conditions-expand')
	const description = document.querySelector('.valentine__conditions-description')
	const conditions = document.querySelector('.valentine__conditions')
	trigger.addEventListener('click', () => {
		conditions.classList.remove('js-hidden')
	})
	closeConditionsBtn.addEventListener('click', ()=> {
		conditions.classList.add('js-hidden')
	})
	expand.addEventListener('click', () => {
		description.style.display = 'block'
	})

	//3) Логика сердечек
	const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
	const container = document.querySelector('.valentine__heart-container')
	if (isMobile) {
	 	HEARTS ||= new Heart(container, 40, 20, 50)
	} else {
		HEARTS ||= new Heart(container, 50, 20, 50)
	}

	let clickCounter = 0

	function handleClick(e) {
		clickCounter++
		e.target.closest('.heart').remove()
		if (clickCounter === 3) {
			trigger.classList.remove('js-hidden')
		}
	}

	container.addEventListener('click', handleClick)

	const copyCode = document.querySelector('#copy-code')

	function copyPromoCode(code) {
		if (!navigator.clipboard) {
			console.error('Clipboard API not supported')
			return
		}

		navigator.clipboard
			.writeText(code)
			.then(() => {
				console.log('Промокод скопирован: ' + code)
				copyCode.classList.add('coppyed')
				copyCode.textContent = 'Промокод скопирован'
			})
			.catch(err => {
				console.error('Ошибка копирования: ', err)
			})
	}

	copyCode.addEventListener('click', () => copyPromoCode('LOVEFLY'))
})
