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
	
	// create cols for oll categoryes list in main navigation
	var countInPage,
		columCount,
		catList = $('.js-clock-list li')
		n = catList.size();
	if (n % 2 == 0 || n % 3 == 0){
		findCols();
		} else {
				n+=1;
				findCols();
		}
				
    // function for faund count of colums and count of items
	function findCols(){
		for(i=3; i>2; i-=1)
		{
			mod = n%i;
			if(mod==0){
				countInPage = i;
				columCount = n/i;
				break;
			}
		}
	};
	

	createCols();
	 // create cols in klock list
	 function createCols(){
		  for (var i = 0; i <= columCount; i += 1) {
			f = i * countInPage;
			l = f + countInPage;
			(i == columCount - 1 & columCount > 1) ? catList.slice(f, l).wrapAll('<div class="col last col-'+(i+1)+'">') : catList.slice(f, l).wrapAll('<div class="col col-'+(i+1)+'">');
		  };
	 };

})
