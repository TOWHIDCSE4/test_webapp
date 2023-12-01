var GUI = {};
GUI.win = $(window);
GUI._initBackTop =  function() {
	if($(".back-to-top").length > 0){
		$(window).scroll(function () {
			var e = $(window).scrollTop();
			if (e > 300) {
				$(".back-to-top").show()
			} else {
				$(".back-to-top").hide()
			}
		});
		$(".back-to-top").click(function () {
			$('body,html').animate({
				scrollTop: 0
			},500)
		})
	}  
}
GUI._initMenuFixed = function(){
	$(window).scroll(function(event) {
		var hei = $('header').height();
		if ($(window).width()>1200) {
			if ($(window).scrollTop()>hei) {
				$('.header-menu').addClass('fixed');
			}
			else{
				$('.header-menu').removeClass('fixed');
			}
		}
		else{
			if ($(window).scrollTop()>0) {
				$('.header-menu').addClass('fixed');
			}
			else{
				$('.header-menu').removeClass('fixed');
			}
		}
	});
}
GUI._initSocial = function (){
	if(navigator.userAgent.indexOf("Speed Insights ") == -1){
		$(window).bind("load", function() {
			$('body').append('<div id="fb-root"></div>');
			$.ajax({
				global: false,
				url: "theme/frontend/js/social.js",
				dataType: "script"
			});
			$.ajax({
				global: false,
				url: "https://apis.google.com/js/platform.js",
				dataType: "script"
			});
			window.___gcfg = {
				lang: 'vi',
				parsetags: 'onload'
			};
		});
	}
}
GUI._initSLiderHome = function (){
	if(typeof $.fn.slick == 'function') {
		if($( ".slider-main-group" ).length>0) {
			$('.slider-main-group').slick({
				infinite: true,
				slidesToShow: 1,
				arrows: false,
				fade: true,
				dots:true,
				// autoplay: true,
				autoplaySpeed: 5000,
			});
		}
	}
}
GUI._initSLiderLearn = function (){
	if(typeof $( ".learn-slider" ).slick == 'function') {
		if($( ".learn-slider" ).length>0) {
			$('.learn-slider').slick({
				infinite: true,
				slidesToShow: 4,
				// autoplay: true,
				autoplaySpeed: 7000,
				nextArrow: '<i class="icon-chevron-right t-right" ></i>',
				prevArrow: '<i class="icon-chevron-left t-left" ></i>',
				responsive: [
				{
					breakpoint: 991,
					settings: {
						slidesToShow: 3,
					}
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 2,
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
					}
				}
				]
			});
			$('.learn-main .learn-slider .slick-slide.slick-active').eq(2).addClass('learn-hover-left');
			$('.learn-main .learn-slider .slick-slide.slick-active').eq(3).addClass('learn-hover-left');
			jQuery('.learn-main .learn-slider').on('afterChange', function(event, slick, currentSlide) {
				if (jQuery(".learn-main .learn-slider .slick-slide").hasClass("slick-active")) {
					jQuery('.learn-main .learn-slider .slick-slide.slick-active').eq(3).addClass('learn-hover-left');
					jQuery('.learn-main .learn-slider .slick-slide.slick-active').eq(1).removeClass('learn-hover-left');
					jQuery('.learn-main .learn-slider .slick-slide.slick-active').eq(0).removeClass('learn-hover-left');
					jQuery('.learn-main .learn-slider .slick-slide.slick-active').eq(2).addClass('learn-hover-left');
				} else {
				}
			});
		}
	}
}
GUI._initSLiderLearnCate = function (){
	if(typeof $( ".cate-main-slide" ).slick == 'function') {
		if($( ".cate-main-slide" ).length>0) {
			$('.cate-main-slide').slick({
				infinite: true,
				slidesToShow: 2,
				// autoplay: true,
				autoplaySpeed: 7000,
				nextArrow: '<i class="icon-chevron-right t-right" ></i>',
				prevArrow: '<i class="icon-chevron-left t-left" ></i>',
				responsive: [
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
					}
				}
				]
			});
		}
	}
}
GUI._initSLiderLearnCourse = function (){
	if(typeof $( ".course-detail1-slide" ).slick == 'function') {
		if($( ".course-detail1-slide" ).length>0) {
			$('.course-detail1-slide').slick({
				infinite: true,
				slidesToShow: 1,
				// autoplay: true,
				autoplaySpeed: 7000,
				nextArrow: '<i class="icon-chevron-right t-right" ></i>',
				prevArrow: '<i class="icon-chevron-left t-left" ></i>',
			});
		}
	}
}
GUI._initSLiderLearnDasboard1 = function (){
	if(typeof $( ".dasboard1-slide" ).slick == 'function') {
		if($( ".dasboard1-slide" ).length>0) {
			$('.dasboard1-slide').slick({
				infinite: true,
				slidesToShow: 3,
				// autoplay: true,
				autoplaySpeed: 7000,
				nextArrow: '<i class="icon-chevron-right t-right" ></i>',
				prevArrow: '<i class="icon-chevron-left t-left" ></i>',
				responsive: [
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 2,
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
					}
				}
				]
			});
		}
	}
}
GUI._initSLiderFeel = function (){
	if(typeof $( ".feel-slider" ).slick == 'function') {
		if($( ".feel-slider" ).length>0) {
			$('.feel-slider').slick({
				infinite: true,
				slidesToShow: 3,
				autoplay: true,
				autoplaySpeed: 7000,
				arrows: false,
				// nextArrow: '<i class="icon-chevron-right t-right" ></i>',
				// prevArrow: '<i class="icon-chevron-left t-left" ></i>',
				responsive: [
				{
					breakpoint: 991,
					settings: {
						slidesToShow: 2,
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
					}
				}
				]
			});
		}
	}
}
GUI._initNumberUp = function(){
	if($('.info-main').length > 0 && $(window).width()>1200) {
		var capacityStatus=0;
		var heiwin = $(window).height();
		GUI.win.scroll(function() {  
			if(capacityStatus==0 && GUI.win.scrollTop() > ($(".info-main").offset().top) - heiwin){
				if($('.count').length>0){
					$('.count').each(function () {
						$(this).prop('Counter',0).animate({
							Counter: $(this).text().replace(/\D/g, '').replace(/ /g,'')
						}, {
							duration: 3000,
							easing: 'swing',
							step: function (now) {
								$(this).text(Math.ceil(now));
							}
						});
					});
				}
				capacityStatus=1; 
			}
		});
	}
}
var IMG = {
	chooseImg:function(){
		if($('.choose_img').length ==0) return;
		$('.choose_img').change(function(event) {
			IMG.readURL(this);
		});
	},
	readURL:function(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#img_preview').attr('src', e.target.result);
				$('.form-q-a .img-booth').addClass('selected');
			}
			reader.readAsDataURL(input.files[0]);
		}
	}
}
GUI.initWow = function (){
	if(GUI.win.width()>991){
		new WOW().init();
	}
}
GUI._initSelect2 = function (){
	if($( ".sort-by.select" ).length>0) {
		$(".sort-by.select").select2();
	}
}
GUI._initContributeClick = function (){
	if($( ".contribute-click" ).length>0) {
		$(document).on("click",".contribute-click", function(){
			$(this).parent('.contribute-plus').append('<label class="i-dot d-flex">\
				<input type="radio" name="check" value="">\
				<i class="contribute-check mt-2">\
				</i>\
				<textarea class="contribute-text-question"data-rows="1" rows="1" tabindex="0" placeholder ="" >Nhập câu trả lời\
				</textarea>\
				</label>')
		});
	}
}
GUI._initAddQuestion = function (){
	if($( ".add-question" ).length>0) {
		$(document).on("click",".add-question", function(){
			$(this).parent().children('.add-question-ct').append('<div class="contribute-content mb-3">\
				<h3 class="bold text-black mb-3">Câu hỏi</h3>\
				<div class="contribute-question mb-2">\
				<textarea class="contribute-text-question"data-rows="1" tabindex="0" placeholder ="Câu hỏi" >Nhập câu trả lời</textarea>\
				</div>\
				<div class="contribute-plus">\
				<label class="contribute-click mb-3">\
				<i class="icon-plus mr-2"></i>\
				<span>Thêm đáp án</span>\
				</label>\
				</div>\
				</div>')
		});
	}
}
GUI._initShowChapter = function(){
	if($( ".chapter-content  .chapter-title" ).length>0) {
		$(".chapter-content  .chapter-title" ).click(function(event) {
			event.preventDefault();
			var _this =$(this);
			var $box = _this.parent('.chapter-content');
			$content = $box.find('.chapter-item');
			$(".chapter-content  .chapter-title" ).not(_this).removeClass('v1');
			$(".chapter-content  .chapter-item" ).not($content).slideUp(200);
			_this.toggleClass('v1');
			$content.stop().slideToggle(200);
		});
	}
}
GUI._initCloseDash4 = function(){
	if($( ".close-dasboard4" ).length>0) {
		$(".close-dasboard4" ).click(function(event) {
			$(this).closest('.col-lg-15').remove();
			// $(this).closest('.exam-detail3').remove();
		});
	}
}
GUI._initExamSubmit = function(){
	if($( ".exam-submit" ).length>0) {
		$(".exam-submit" ).click(function(event) {
			if($(".exam-detail3" ).is(':hidden')){
				$('.exam-detail3').slideDown();
			}
		});
		$(".close-exam-detail3").click(function(event) {
			if($(".exam-detail3" ).is(':visible')){
				$('.exam-detail3').slideUp();
			}
		});
	}
}
GUI._initCloseCuoseLeft = function(){
	if($( ".course-detail2-left-cate .course-detail2-left-title" ).length>0) {
		$(".course-detail2-left-cate .course-detail2-left-title" ).click(function(event) {
			var _this =$(this);
			$(".course-detail2-left-cate .course-detail2-left-title" ).not(_this).removeClass('active');
			$(".course-detail2-left-cate .course-detail2-left-title" ).not(_this).nextAll("ul").slideUp();
			if($(this).nextAll("ul").is(':hidden')){
				$(this).nextAll("ul").slideDown();
				$(this).addClass('active');
			}
			else{
				$(this).nextAll("ul").slideUp();
				$(this).removeClass('active');
			}
		});
	}
}
GUI._initCloseCourse = function(){
	if($( ".course-detail2" ).length>0) {
		// $(window).resize(function(event) {
			// if($(window).width()<992){
				$(".click-course-left" ).click(function(event) {
					if($(".course-detail2-left " ).hasClass('left0')){
						$(this).closest('.course-detail2-left').removeClass('left0');

					}
					else{
						$(this).closest('.course-detail2-left').addClass('left0');
					}
				});
			// }
		// });
	}
}
GUI.init= function (){
	GUI._initSLiderHome();
	GUI._initBackTop();
	GUI._initSLiderLearn();
	GUI._initSLiderLearnCate();
	GUI._initSLiderFeel();
	GUI._initNumberUp();
	GUI.initWow();
	IMG.chooseImg();
	GUI._initSelect2();
	GUI._initContributeClick();
	GUI._initAddQuestion();
	GUI._initShowChapter();
	GUI._initSLiderLearnCourse();
	GUI._initSLiderLearnDasboard1();
	GUI._initCloseDash4();
	GUI._initCloseCourse();
	GUI._initCloseCuoseLeft();
	GUI._initExamSubmit();
}
$(function() {
	GUI.init();
});
