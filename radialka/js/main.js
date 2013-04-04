$(function() {
	  
  var catList = $('.js-all-cat-list li'), // list of oll hiden's categoryes
	catParent = $('.js-all-cat-list'), // parrent container categoryes
	mainNav = $('.js-main-nav td div'), // main navigation links
	countInPage, // count items in 1 column 
	f, // first element in column
	l, // last element in column
	phone = false, // used when phone screen
	columCount, // conut of colums in modal
	mod,
	windowInnerWidth= window.innerWidth, // used for mediaqueries
	currentSize = 1, // current page size
	newSize = 0, // new page size, changes when query transitions
	n = catList.size(),
	pageText = $('#mainSlider li'); // array for main slider thumbs
  
    // add class .mac-os in body wen we used Mak OS or iOS
	if(navigator.userAgent.indexOf('Mac') > 0){
		$('body').addClass('mac-os');
	};
	
  // placeholder for old browsers
  $('input[placeholder], textarea[placeholder]').placeholder();
	
  // create cols for oll categoryes list in main navigation	
  if (n % 2 == 0 || n % 9 == 0){
	findCols();
  }
  else{
	n+=1;
	findCols();
  }

  // function for faund count of colums and count of items
  function findCols(){ 
	for(i=9; i>2; i-=1)
	{
		mod = n%i;
		if(mod==0){
			countInPage = i;
			columCount = n/i;
			break;
		}
	}
  };
  
  // create cols in dropdown list
  for (var i = 0; i <= columCount; i += 1) { 
	f = i * countInPage;
	l = f + countInPage;
	(i == columCount - 1 & columCount > 1) ? catList.slice(f, l).wrapAll('<div class="col last">') : catList.slice(f, l).wrapAll('<div class="col">');
  };
  
  // search ul in td for main navigation
  mainNav.each(function() {
	if ($(this).find('ul').length > 0) {
		$(this).addClass('has-ul');
	}
  });

  // brand slider options
  var brandSlider = new Sly('#brandSlider',{ 
	horizontal: 1,
	itemNav: 'basic',
	smart: 1,
	activateMiddle: 1,
	mouseDragging: 1,
	touchDragging: 1,
	releaseSwing: 0,
	startAt: 0,
	speed: 300,
	
	// buttons
	prevPage: '.js-brandPrev',
	nextPage: '.js-brandNext'
  });

  // main slider options
  var mainSlider = new Sly('#mainSlider',{
	horizontal: 1,
	itemNav: 'basic',
	smart: 1,
	mouseDragging: 1,
	touchDragging: 1,
	releaseSwing: 1,
	startAt: 0,
	scrollBy: 1,
	speed: 300,
	elasticBounds: 1,
	
	// paginator
	pagesBar: '.mainSliderThumbs',
	pageBuilder:    
    function (index) {
    return '<li><a class="hidden-table hidden-phone">' + ($(pageText[index]).data('slider')) + '</a></li> ';
    },
	activatePageOn: 'click',
    
    // buttons
	prevPage: '.js-mainSlider-l',
	nextPage: '.js-mainSlider-r'
  });
  
  // init brand slider
  brandSlider.init();
  
  // init main slider
  mainSlider.init();

  // show hidden elements
  $('.js-toogle').click(function(){
		if($(this).hasClass('js-show')){
			$(this).removeClass('js-show');
		} else {
			$('.js-toogle').removeClass('js-show');
			$(this).addClass('js-show');
		}
  });
  
  // show cart list
  $('.js-open-cart').click(function(){
  	$('.js-shopping-cart').toggleClass('js-show');
  });
  
  // create select from navigation when page size <= 480px
  function createSelect(className){
  	var el = $(className).find('li a'),
  	s = $("<select class='js-navigation hidden-table hidden-desctop'/>");
  	
  	el.each(function(){
  		$("<option />", {value: $(this).attr('href'),text:$(this).text()}).appendTo(s);
  	});
  	
  	s.appendTo(className);
  }
  
  // show oll categoryes when page size <= 480px
  $(document).on("click", ".js-show-oll-cat", function(){
  	$(this).toggleClass('active');
  	 $('.js-oll-cat').toggleClass('js-show');
  });
  
  // size for main dropdown container
  function dropdownSize(size){
	if (catList.size() > countInPage) {
	catParent.width((size * columCount) + columCount+1);}	
  }
 
 // calculate dropdown container size 
 dropdownSize(169); 
  
  // create navigation for size of page <= 480px
  function createNav(navName, newNav){
  	var navItems = $(navName).find('li a'),
  		cList = $(newNav);
  		navItems.each(function(){
  		var li = $("<li />")
  			.appendTo(cList);
  		var a = $("<a />")
  			.text($(this).text())
  			.attr('href',$(this).attr('href'))
  			.appendTo(li);
  	});
  };
  
  // update dinamic elements when media query transitions
  function updateElements(size){	
 	mainSlider.reload(); // reload main slider when changet page size
 	brandSlider.reload(); // reload main slider when changet page size
 	 	
 	if(size === 980){
 		dropdownSize(169);
 	} else
 	if(size === 768){
 		brandSlider.reload();
		dropdownSize(148);
 	} else
 	if(size === 480){
 		if(!phone){
 		createSelect('.js-top-navigation');
	  	createSelect('.js-change-curse');
	  	createNav('.oll-category','.oll-cat-list');
	  }
	  phone = true;
 	} else
 	if(size === 320){
 		if(!phone){
 		createSelect('.js-top-navigation');
	  	createSelect('.js-change-curse');
	  	createNav('.oll-category','.oll-cat-list');
	  }
	  phone = true;
 	}
	console.log('Update '+size);
  }
	
	//Know the size of the display and when we has change 
	// media query - then update dinmic elements
	function mediaQueries(){
		if(currentSize != newSize){
			if((windowInnerWidth >= 1000)){
				newSize = 1;
		    	updateElements(980);
		    } else
		    if((windowInnerWidth >= 768) & (windowInnerWidth <= 1000)){
		    	newSize = 2;
		    	updateElements(768);
		    } else
		    if((windowInnerWidth >= 480) & (windowInnerWidth <= 767)){
		    	newSize = 3;
		    	updateElements(480);
		    } else
		    if(windowInnerWidth < 479){
		    	newSize = 4;
		    	updateElements(320);
		    }	
		    currentSize = newSize; 
 			console.log(currentSize+' '+newSize);
	    }
	}
    
   
    mediaQueries();
       
    $(window).resize(function(){
    	windowInnerWidth = window.innerWidth;	
    	if((windowInnerWidth >= 1000)){
		    	newSize = 1;
		    } else
		    if((windowInnerWidth >= 768) & (windowInnerWidth <= 1000)){
		    	newSize = 2;
		    } else
		    if((windowInnerWidth >= 480) & (windowInnerWidth <= 767)){
		    	newSize = 3;
		    } else
		    if(windowInnerWidth < 480){
		    	newSize = 4;
		    }
		console.log(newSize+' '+currentSize);
    	mediaQueries();
    });
});
