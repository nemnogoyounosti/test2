const config = require('./gulp-config')
const {src, dest, watch, task, series} = config.plugins.gulp
const plugins = config.plugins
const reload = config.plugins.browserSync.reload
const env = process.env.GULP_ENV || 'development'

// eslint-disable-next-line require-jsdoc
function buildHtml() {
	let cssManifest = ''
	let jsManifest = ''
	if (env === 'production') {
		// eslint-disable-next-line max-len
		cssManifest = JSON.parse(plugins.fs.readFileSync(config.build.manifest + config.revManifest.cssManifest, 'utf8'))
		// eslint-disable-next-line max-len
		jsManifest = JSON.parse(plugins.fs.readFileSync(config.build.manifest + config.revManifest.jsManifest, 'utf8'))
	}

	delete require.cache[require.resolve('./libs')]
	return src(config.src.pages)
		.pipe(plugins.gulpPug({
			pretty: true,
			locals: {
				cssManifest: cssManifest,
				jsManifest: jsManifest,
				pjson: require('./package'),
				libs: require('./libs'),
				env: process.env
			}
		}))
		.pipe(dest(config.build.pages))
		.pipe(reload({stream: true}))
}

// eslint-disable-next-line require-jsdoc
function buildStyles() {
	return src(config.src.styles, {sourcemaps: true})
		.pipe(plugins.gulpStylus())
		.pipe(plugins.prefixer())
		.pipe(plugins.cssUrlReplace(
			{'font': 'fonts/', 'img': '/'}
		))
		.pipe(plugins.base64({
			baseDir: 'src/app/img',
			exclude: ['svg#Glyphter'],
			extensions: ['svg', 'png', 'jpg']
		}))
		.pipe(plugins.cleanCSS({compatibility: 'ie10'}))
		.pipe(plugins.gulpif(env === 'production', plugins.rev()))
		.pipe(dest(config.build.styles, {sourcemaps: true}))
	// eslint-disable-next-line max-len
		.pipe(plugins.gulpif(env === 'production', plugins.rev.manifest(config.revManifest.cssManifest)))
		.pipe(plugins.gulpif(env === 'production', dest(config.build.manifest)))
		.pipe(reload({stream: true}))
}

// eslint-disable-next-line require-jsdoc
function mergeVendorStyles() {
	return src(config.src.cssVendors, {sourcemaps: true})
		.pipe(plugins.cleanCSS())
		.pipe(dest(config.build.cssVendors, {sourcemaps: true}))
		.pipe(reload({stream: true}))
}

// eslint-disable-next-line require-jsdoc
function buildJs() {
	const wpConf = config.webpackConfig
	wpConf.mode = env
	return src(config.src.js)
		.pipe(plugins.wpStream(wpConf))
		// .pipe(plugins.gulpif(env === 'production', plugins.uglify()))
		.pipe(plugins.gulpif(env === 'production', plugins.rev()))
		.pipe(dest(config.build.js))
		// eslint-disable-next-line max-len
		.pipe(plugins.gulpif(env === 'production', plugins.rev.manifest(config.revManifest.jsManifest)))
		.pipe(plugins.gulpif(env === 'production', dest(config.build.manifest)))
		.pipe(reload({stream: true}))
}

// eslint-disable-next-line require-jsdoc
function mergeVendorJs() {
	return src(config.src.jsVendors, {sourcemaps: true})
		.pipe(dest(config.build.jsVendors, {sourcemaps: true}))
		.pipe(reload({stream: true}))
}

// eslint-disable-next-line require-jsdoc
function collectImages() {
	const im = plugins.imagemin
	return src(config.src.img)
		.pipe(im([
			im.gifsicle({interlaced: true}),
			im.jpegtran({progressive: true}),
			im.optipng({optimizationLevel: 1}),
			im.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		],
		{
			verbose: true
		}
		))
		.pipe(dest(config.build.img))
		.pipe(reload({stream: true}))
}

// eslint-disable-next-line require-jsdoc
function collectFonts() {
	return src(config.src.fonts)
		.pipe(dest(config.build.fonts))
		.pipe(reload({stream: true}))
}

// eslint-disable-next-line require-jsdoc
function collectOthers() {
	return src(config.othersPath)
		.pipe(dest(config.build.other))
}

task('webserver', done => {
	config.plugins.browserSync(config.webServer)
	done()
})

// eslint-disable-next-line require-jsdoc
function watchFiles() {
	// eslint-disable-next-line max-len
	watch([config.watch.layout, config.src.pages, config.watch.templates], buildHtml)
	watch(config.watch.styles, series(buildStyles))
	watch(config.src.cssVendors, mergeVendorStyles)
	watch(config.src.customUi, series(buildJs))
	watch(config.src.js, series(buildJs))
	watch(config.src.jsVendors, mergeVendorJs)
	watch(config.src.img, collectImages)
	watch(config.src.fonts, collectFonts)
	watch('./libs.json', buildHtml)
}

const devBuild = series(
	buildStyles, mergeVendorStyles,
	buildJs, mergeVendorJs, collectImages,
	collectFonts, buildHtml)
const prodBuild = series(
	buildStyles, mergeVendorStyles,
	buildJs, mergeVendorJs, collectImages,
	collectFonts, collectOthers, buildHtml)

const build = env === 'development' ? devBuild : prodBuild
// eslint-disable-next-line max-len
const def = env === 'development' ? series(build, 'webserver', watchFiles) : build

exports.html = buildHtml
exports.style = buildStyles
exports.vendorStyle = mergeVendorStyles
exports.js = buildJs
exports.vendorJs = mergeVendorJs
exports.images = collectImages
exports.fonts = collectFonts
exports.others = collectOthers
exports.watch = series(watchFiles)
exports.default = def