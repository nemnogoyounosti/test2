import {observable, autorun} from 'mobx'

export class FloatContainer {
	constructor(containerSelector, closeSelector) {
		this._closeSelector = closeSelector
		this._openEl = document.querySelector(containerSelector)
		this._closeEl = document.querySelector(closeSelector)
		this._init = false
		this._floatContainer = observable({
			isOpen: 'no',
			openClose() {
				this.isOpen = this.isOpen === 'yes' ? 'no' : 'yes'
			}
		})

		autorun(() => {
			const state = this._floatContainer.isOpen
			if (!this._init) {
				this._init = true
			} else {
				if (this._openEl !== null) {
					this._openEl.setAttribute('show', state)
				} else {
					console.log(
						'Не удалось обнаружить данный элемент:', this._closeSelector
					)
				}
			}
		})
	}

	openClose() {
		this._floatContainer.openClose()
	}

	init(beforeAction = null, afterAction = null) {
		if (this._closeEl !== null) {
			this._closeEl.addEventListener('click', () => {
				if (beforeAction !== null) {
					beforeAction()
				}
				this._floatContainer.openClose()
				if (afterAction !== null) {
					afterAction()
				}
			})
		} else {
			console.log(
				'Не удалось обнаружить данный элемент:', this._closeSelector
			)
		}
	}
}