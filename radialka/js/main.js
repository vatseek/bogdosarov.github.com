// global functions and variables
  
  // Function for remove spaces
  function delSpaces(str){
	    str = str.replace(/\s/g, '');
	    return str;
	}
	
  // Function to separate numbers
  function addSpaces(str){
  	str = String(str);
  	str = str.split('').reverse();
  	for(var i=0; i<str.length; i++){
  		if(i%3 === 0 && i){
  			str[i]=str[i]+' ';
  		}
  	}
  	str = String(str.reverse()).replace(/,/g, "");
  	return str;
  }

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
	documentClientWidth= $(window).width()+17, // used for mediaqueries
	currentSize = 1, // current page size
	newSize = 0, // new page size, changes when query transitions
	n = catList.size(),
	filterTooltip = $('.js-filter-tooltip');
	
	if(typeof mobailFilter !== 'undefined'){
		var filterCatalog = $('.js-filter');
	}
	
	// show register-login popup
	$('.js-register').click(function(e) {
		$( ".js-login-reg-tabs" ).tabs({ active: 1 });
		$('.js-modal-cnt-login').lightbox_me({
		centered: true,
		overlayCSS: {
			background: '#1e262e',
			opacity: .9
		}
		});
		e.preventDefault();
	}); 
	$('.js-login').click(function(e) {
		$( ".js-login-reg-tabs" ).tabs({ active: 0 });
		$('.js-modal-cnt-login').lightbox_me({
		centered: true,
		overlayCSS: {
			background: '#1e262e',
			opacity: .9
		}
		});
		e.preventDefault();
	}); 
	
    // add class .mac-os in body wen we used Mak OS or iOS
	if(navigator.userAgent.indexOf('Mac') > 0){
		$('body').addClass('mac-os');
	};
	
	// select color in filter on page catalog
	$(".js-select-color li").click(function(){
		$(this).toggleClass("checked");
	});
	
	// tabs for login/registration modal
	$('.js-login-reg-tabs').tabs({
		active:1 
	});
	
	// show user password
	$(".js-remove-pass").click(function(){
		var passInput = $('.js-user-pass')
		 passInput.attr('type') === 'password' ? passInput.attr({type:'text'}) : passInput.attr({type:'password'});
	});
	
	// show oll brands in filter on page catalog
	$('.js-filter-show-brand').click(function(){
		var cnt = $('.js-filter-brand-cnt'),
			height = $('.js-filter-brand-cnt .input-row').innerHeight(),
			bHeight,
			size = $('.js-filter-brand-cnt input[type="checkbox"]').size();
		$(this).toggleClass('js-open-brand');
		if($(this).hasClass('js-open-brand')){
			bHeight = size * height;
			$(this).html('скрыть все бренды');
			cnt.animate({height: bHeight}, 200);	
		} else {
			$(this).html('показать все бренды');
			bHeight = 5 * height;
			cnt.animate({height: bHeight}, 200);			
		}
	});
	
	
	
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
 	if(typeof mainSlider !== "undefined"){mainSlider.reload();} // reload main slider when changet page size
 	if(typeof brandSlider !== "undefined"){brandSlider.reload();} // reload main slider when changet page size
 	 	
 	if(size === 980){
 		dropdownSize(169);
 	    $(".catalog-list .tovarItem").removeClass('margin-0');
 	    $(".catalog-list .tovarItem:nth-child(3n)").addClass('margin-0');
 	    $(".category-list .category-item:nth-child(5n)").addClass('margin-right-0');
 	    
 	    if(typeof mobailFilter !== 'undefined'){
 	    	if(mobailFilter){
				filterCatalog.detach();
				filterCatalog.appendTo('.js-main-filter-cnt');
				mobailFilter = false;
			}
	  	}
 	} else
 	if(size === 768){
 		//brandSlider.reload();
		dropdownSize(148);
		// remove padding in second element in catalog-list	
 	    $(".catalog-list .tovarItem").removeClass('margin-0');
 	    $(".catalog-list .tovarItem:nth-child(2n)").addClass('margin-0');
 	    $(".category-list .category-item").removeClass('margin-right-0');
 	    $(".category-list .category-item:nth-child(2n)").addClass('margin-right-0');
 	    
 	    if(typeof mobailFilter !== 'undefined'){
			if(mobailFilter){
				filterCatalog.detach();
				filterCatalog.appendTo('.js-main-filter-cnt');
				mobailFilter = false;
			}
	  	}
 	} else
 	if(size === 480){
 		if(!phone){
 		createSelect('.js-top-navigation');
	  	createSelect('.js-change-curse');
	  	createNav('.oll-category','.oll-cat-list');
	  	$(".category-list .category-item").removeClass('margin-right-0');
	  	$(".category-list .category-item:nth-child(n)").addClass('margin-right-0');
	  }
	  phone = true;
	  
	  if(typeof mobailFilter !== 'undefined'){
	  	if(!mobailFilter){
		  	filterCatalog.detach();
			filterCatalog.appendTo('.js-filter-mobail');
			mobailFilter = true;	
	  	}
	  }
	  
 	} else
 	if(size === 320){
 		if(!phone){
 		createSelect('.js-top-navigation');
	  	createSelect('.js-change-curse');
	  	createNav('.oll-category','.oll-cat-list');
	  }
	  phone = true;
	  
	  if(typeof mobailFilter !== 'undefined'){
	  	if(!mobailFilter){
			filterCatalog.detach();
			filterCatalog.appendTo('.js-filter-mobail');
			mobailFilter = true;
	   }
	  }
 	}
	console.log('Update '+size);
  }
	
	//Know the size of the display and when we has change 
	//media query - then update dinmic elements
	function mediaQueries(){
		if(currentSize != newSize){
			if((documentClientWidth >= 1000)){
				newSize = 1;
		    	updateElements(980);
		    } else
		    if((documentClientWidth >= 768) & (documentClientWidth <= 1000)){
		    	newSize = 2;
		    	updateElements(768);
		    } else
		    if((documentClientWidth >= 480) & (documentClientWidth <= 767)){
		    	newSize = 3;
		    	updateElements(480);
		    } else
		    if(documentClientWidth < 479){
		    	newSize = 4;
		    	updateElements(320);
		    }	
		    currentSize = newSize; 
 			console.log(currentSize+' '+newSize);
	    }
	}
    
   
   mediaQueries();
       
    $(window).resize(function(){
    	documentClientWidth = $(window).width()+17;	
    	if((documentClientWidth >= 1000)){
		    	newSize = 1;
		    } else
		    if((documentClientWidth >= 768) & (documentClientWidth <= 1000)){
		    	newSize = 2;
		    } else
		    if((documentClientWidth >= 480) & (documentClientWidth <= 767)){
		    	newSize = 3;
		    } else
		    if(documentClientWidth < 480){
		    	newSize = 4;
		    }
		console.log(newSize+' '+documentClientWidth);
    	mediaQueries();
    });
});

