import $ from 'jquery'
import jQuery from 'jquery';
window.$ = jQuery;

import {slick} from 'slick-carousel'

$(document).ready(() => {


	$('[modal-id]').each((_, v) => {
		const btn = $(v)
		const modalSelector = btn.attr('modal-id')
		const closeSelector = btn.attr('close-btn-id')
		btn.click(() => {
			$(modalSelector).attr('show', 'yes')
		})
		$(`${modalSelector} ${closeSelector}`).click(() => {
			$(modalSelector).attr('show', 'no')
		})
		$(modalSelector).click(function(e) {
			if ($(e.target).is(modalSelector)) {
				$(modalSelector).attr('show', 'no')
			}
		})
	});

	$('.slider').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		variableWidth: true,
		responsive: [
			{
				breakpoint: 1367,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					variableWidth: false
				}
			},
			{
				breakpoint: 601,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					variableWidth: true
				}
			},
			{
				breakpoint: 481,
				settings: "unslick"
			}
		]
	});

	$('.articles__down-list').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		variableWidth: true,
		arrows: false,
		responsive: [
			{
				breakpoint: 1367,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			}
		]
	});

})