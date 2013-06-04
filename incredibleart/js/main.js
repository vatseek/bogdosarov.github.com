$(function(){
	// height for main container
	var wrapper = $('.wrapper');
	wrapper.height($(window).height()-161);
	
	$(window).resize(function() {
		wrapper.height($(window).height()-161);			
	});
})
