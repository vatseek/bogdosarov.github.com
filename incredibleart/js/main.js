$(function(){
	// height for main container
	var wrapper = $('.wrapper')
		height = $(window).height()-141;
		wrapper.css({minHeight: height+'px'});			
	
	$(window).resize(function() {
		wrapper.css({minHeight: height+'px'});			
	});
})
