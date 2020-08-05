module.exports = function(plop) {
	plop.setHelper('log', function(text) {
		console.log(text)
	})

	plop.setGenerator('page', {
		description: 'Генерация страницы',
		prompts: [
		    {
				type: 'input',
				name: 'layout_name',
				message: 'Введите название шаблона'
		    },
			{
				type: 'input',
				name: 'page_name',
				message: 'Введите название страницы'
			}
		],
		actions: [
			{
				type: 'add',
				path: '../../src/app/pages/{{page_name}}.pug',
				templateFile: '../templates/page.hbs'
			},
			{
				type: 'add',
				path: '../../src/app/css/pages/{{page_name}}.styl'
			}
		]
	})
	plop.setPartial('layoutName', '{{layout_name}}')
}

// plop --plopfile generators/index.js