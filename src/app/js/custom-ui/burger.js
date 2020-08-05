import {observable, autorun} from 'mobx'

export class Burger {
	constructor(selector) {
		this._elSelector = selector
		this._el = document.querySelector(selector)
		this._init = true
		this._burger = observable({
			isOpen: 'no',
			openClose() {
				this.isOpen = this.isOpen === 'yes' ? 'no' : 'yes'
			}
		})

		autorun(() => {
			const state = this._burger.isOpen

			if (this._init) {
				this._init = false
			} else {
				this._el.setAttribute('active', state)
			}
		})
	}

	openClose() {
		this._burger.openClose()
	}

	init(beforeAction = null, afterAction = null) {
		if (this._el !== null) {
			this._el.addEventListener('click', () => {
				if (beforeAction !== null) {
					beforeAction()
				}
				this._burger.openClose()
				if (afterAction !== null) {
					afterAction()
				}
			})
		} else {
			console.log(
				'Не удалось обнаружить данный элемент:', this._elSelector
			)
		}
	}
}