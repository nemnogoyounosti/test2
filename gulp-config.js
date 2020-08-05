module.exports = {
	src: {
		pages: 'src/app/pages/*.pug',
		styles: 'src/app/css/main.styl',
		cssVendors: 'src/app/css/vendor/*.css',
		js: 'src/app/js/*.js',
		customUi: 'src/app/js/custom-ui/*.js',
		jsVendors: 'src/app/js/vendor/*.js',
		img: 'src/app/img/**/*.{jpeg,jpg,png,tiff,gif,bmp,svg,webp}',
		fonts: 'src/app/fonts/*.{eot,ttf,woff,woff2}'
	},
	build: {
		pages: 'build/',
		styles: 'build/css/',
		cssVendors: 'build/css/vendor/',
		js: 'build/js/',
		jsVendors: 'build/js/vendor/',
		img: 'build/img/',
		fonts: 'build/css/fonts/',
		other: 'build/',
		manifest: 'build/manifest/'
	},
	watch: {
		styles: 'src/app/css/**/*.styl',
		layout: 'src/app/layout/*.pug',
		templates: 'src/app/templates/**/*.pug'
	},
	// eslint-disable-next-line max-len
	othersPath: 'companion_files/*.*',
	webServer: {
		server: {
			baseDir: './build'
		},
		tunnel: false,
		host: 'localhost',
		port: 8000,
		logPrefix: 'by_k1ll1n'
	},
	revManifest: {
		cssManifest: 'css-rev-manifest.json',
		jsManifest: 'js-rev-manifest.json'
	},
	plugins: {
		gulp: require('gulp'),
		gulpif: require('gulp-if'),
		babel: require('gulp-babel'),
		pug: require('pug'),
		gulpPug: require('gulp-pug'),
		stylus: require('stylus'),
		gulpStylus: require('gulp-stylus'),
		replace: require('gulp-replace'),
		uglify: require('gulp-uglify-es').default,
		fs: require('fs'),
		prefixer: require('gulp-autoprefixer'),
		cssUrlReplace: require('gulp-css-url-replace'),
		cleanCSS: require('gulp-clean-css'),
		browserSync: require('browser-sync'),
		imagemin: require('gulp-imagemin'),
		rev: require('gulp-rev'),
		base64: require('gulp-base64'),
		webpack: require('webpack'),
		wpStream: require('webpack-stream')
	},
	webpackConfig: {
		mode: null,
		entry: ['@babel/polyfill', './src/app/js/main.js'],
		output: {
			filename: 'app.js'
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.(js)$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
					query: {
						presets: [
							['@babel/env', {targets: {esmodules: true}}]
						],
						plugins: [
							['@babel/plugin-proposal-decorators', {'legacy': true}],
							['@babel/plugin-proposal-class-properties', {'legacy': true}]
						]
					}
				},
				{
					test: /jquery.+\.js$/,
					use: [{
						loader: 'expose-loader',
						options: 'jQuery'
					},
					{
						loader: 'expose-loader',
						options: '$'
					}]
				}
			]
		}
	}
}