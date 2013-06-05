$(function(){
	// show hide top menu
	$('.js-show-menu').click(function() {
		if($(this).hasClass('js-open')){
			$('.js-top-menu').stop().animate({top: '-41px'}, 300);			
			$(this).toggleClass('js-open');
		} else {
			$('.js-top-menu').stop().animate({top: 0}, 300);			
			$(this).toggleClass('js-open');
		}
	});
	
	// Change curse
	var changeCurse = $('.js-change-curse');
	$('.js-select-curse').click(function() {
		changeCurse.slideToggle(150);	
	});
	$('.js-change-curse a').click(function() {
		$('.js-change-curse a').removeClass('active');
		$(this).addClass('active');
		changeCurse.slideUp(150);
		$('.js-curse').html($(this).html());
	});
})
