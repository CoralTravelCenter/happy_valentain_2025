import markup from '../markup.html?raw'
import '../styles/style.scss'
import {hostReactAppReady, vimeoAutoPlay} from './utils'

hostReactAppReady().then(() => {
	if (!document.querySelector('section.valentine')) {
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
		ym(215233, 'reachGoal', 'start')
	})

	//2) Скрываем информацию об акции
	const closeConditionsBtn = document.querySelector('.valentine__conditions-close')
	const trigger = document.querySelector('.valentine__trigger')
	const expand = document.querySelector('.valentine__conditions-expand')
	const description = document.querySelector('.valentine__conditions-description')
	const conditions = document.querySelector('.valentine__conditions')
	trigger.addEventListener('click', () => {
		conditions.classList.remove('js-hidden')
		ym(215233, 'reachGoal', 'finish')
	})
	closeConditionsBtn.addEventListener('click', () => {
		conditions.classList.add('js-hidden')
	})
	expand.addEventListener('click', () => {
		description.style.display = 'block'
	})

	//3) Логика сердечек
	document.querySelector('.valentine__push-to-begin span').addEventListener('click', (e) => {
		e.currentTarget.closest('div').classList.add('js-hidden')
	})
	const container = document.querySelector('.valentine__heart-container')
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

	copyCode.addEventListener('click', () => {
		copyPromoCode('LOVEFLY')
		ym(215233, 'reachGoal', 'promo')
	})
})
