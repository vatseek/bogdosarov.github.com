jQuery(document).ready(function(){


	//    var params = {
	//        changedEl: ".searchForm select",
	//        visRows: 5,
	//        scrollArrows: true
	//    }
	//    cuSel(params);
	var params = {
		changedEl: "header.siteHeader .payNlang select",
		visRows: 5,
		scrollArrows: true
	}
	cuSel(params);

	//    var params = {
	//        changedEl: ".chooseMader select",
	//        visRows: 5,
	//        scrollArrows: true
	//    }
	//    cuSel(params);


	jQuery('#unwrapBtn').click(function(event){
		jQuery('ul.selectFirmList').toggle();

		if (jQuery('ul.selectFirmList').css('display') == 'none') {
			jQuery(this).html('Показать производителей');
		} else {
			jQuery(this).html('Скрыть производителей');
		}
	});

	jQuery('span.filterManu').bind('click',function(event,from_hash) {
		from_hash = from_hash || [];
		event.preventDefault();
		var ids = [], fb;

		if(from_hash.length){
			ids = from_hash;
			$.each(from_hash, function(){
				fb = jQuery('span.filterManu[data-id="'+this+'"]');
				if (fb.hasClass('inactive')) {
					fb.removeClass('inactive');
				}
				fb.addClass('active');
			});
		}else{
			if (jQuery(this).hasClass('active')) {
				jQuery(this).removeClass('active');
			} else {
				jQuery(this).addClass('active');
			}
			if (jQuery(this).hasClass('inactive')) {
				jQuery(this).removeClass('inactive');
			}
			jQuery('span.filterManu.active').each(function() {
				ids.push(jQuery(this).data('id'));
			});
		}
				
		
		var filterManu = jQuery('span.filterManu');
		
		if(ids.length){
			filterManu.not('.active').addClass('inactive');
		}else{
			filterManu.removeClass('inactive');
		}

		var categoryPath = jQuery('#category_path').text();

		var url = window.location.search;
		var patternSort = '(\\?|&)sort=([.a-zA-Z]+)&?';
		var patternOrder = '(\\?|&)order=([.a-zA-Z]+)&?';
		var patternPage = '(\\?|&)page=(\\d+)&?';
		var regexpSort = new RegExp(patternSort);
		var regexpOrder = new RegExp(patternOrder);
		var regexpPage = new RegExp(patternPage);
		var sort = url.match(regexpSort) || '';
		var order = url.match(regexpOrder) || '';
		var page = url.match(regexpPage) || 1;
		if (sort && sort[2]) {
			sort = sort[2];
		}
		if (order && order[2]) {
			order = order[2];
		}
		if (page && page[2]) {
			page = page[2];
		}

        var patternTest = 'brands=([\\d+_])+',
            patternBrands = '(\\d+)';
        var regexpBrands = new RegExp(patternBrands, 'ig');
        var regexpTest = new RegExp(patternTest, 'ig');

        var clearPage = false;
        if (regexpTest.test(location.hash) && page != 1) {
            var matchBrands = location.hash.match(regexpTest),
                brands = matchBrands[0].match(regexpBrands);
            if (brands.length == ids.length) {
                for (var i = 0; i < brands.length; i++) {
                    if (brands[i] != ids[i]) {
                        clearPage = true;
                    }
                }

                if (clearPage) {
                    page = 1;
                }
            } else {
                clearPage = true;
            }

        }

        if (clearPage) {
            var patternPage = 'page=([\\d+])';
            var regexpPage = new RegExp(patternPage);
            if (regexpPage.test(window.location.href)) {
                var matchPage = window.location.href.match(regexpPage);
                if (matchPage[0] != 1) {
                    var pattern = '([\\?\\&\\#]brands=[\\d+_]+)', replace = '', hash;
                    if (ids.length) {
                        pattern = '(brands=[\\d+_]+)';
                        replace = 'brands=' + ids.join('_');
                    }

                    var regexp = new RegExp(pattern);

                    if(regexp.test(location.hash)){
                        hash = location.hash.replace(regexp,replace,'g').replace(new RegExp('^#'),'','g');
                    }else{
                        hash = location.hash.replace(new RegExp('(^#|undefined)'),'','g');
                        if(hash){
                            hash += '&'+replace;
                        }else{
                            hash = replace;
                        }
                    }

                    location.hash = hash;
                    var tst = window.location.href;

                    window.location.href = tst.replace(regexpPage, "");
                    return;
                }
            }

        }



		jQuery.ajax({
			type: 'post',
			url: 'index.php?route=module/filter/callback',
			dataType: 'json',
			data: {
				category: categoryPath,
				ids: ids,
				sort: sort,
				order: order,
				page: page
			},
			success: function (result) {
				if (result.products) {
					jQuery('.indexListOfGoods').replaceWith(result.products);
				}
				if (result.pagination) {
					jQuery('div.pagination').replaceWith(result.pagination);
				}

				var pattern = '([\\?\\&\\#]brands=[\\d+_]+)', replace = '', hash;
				if (ids.length) {
					pattern = '(brands=[\\d+_]+)';
					replace = 'brands=' + ids.join('_');
				}
				
				var regexp = new RegExp(pattern);
				
				if(regexp.test(location.hash)){
					hash = location.hash.replace(regexp,replace,'g').replace(new RegExp('^#'),'','g');
				}else{
					hash = location.hash.replace(new RegExp('(^#|undefined)'),'','g');
					if(hash){
						hash += '&'+replace;
					}else{
						hash = replace;
					}
				}
				
				location.hash = hash;
				
				updateAnchors(hash);
	
			}
		});
	});
	
	function updateAnchors(hash){
		
		if(hash){
			hash = '#'+hash;
		}else{
			hash = '';
		}
		// Заполняем хеши в хлебных крошках
		$('ul.breadDots>li>a').each(function(){
			var bchref = $(this).attr('href').split('#');
			$(this).attr('href', bchref[0] + hash);
		});
		// Заполняем хеши в ссылках на товары
		$('ul.indexListOfGoods>li>a').each(function(){
			var bchref = $(this).attr('href').split('#');
			$(this).attr('href', bchref[0] + hash);
		});
		// Заполняем хеши в ссылках пагинатора
		$('div.pagination a').each(function(){
			var bchref = $(this).attr('href').split('#');
			$(this).attr('href', bchref[0] + hash);
		});
				
		$('#sortBy option').each(function(){
			var value = jQuery(this).val();
			value = value.replace(regexp,'','g').replace(new RegExp('#.*'),'','g');
			if (hash) {
				value += hash;
			}
			$(this).val(value);
		});
	}
	
	var regexp = new RegExp('[\\?\\&\\#]brands=([\\d+_]+)');
	if(regexp.test(location.hash)){
		var brands = location.hash.match(regexp)[1].split('_');
		if(brands.length>0){
			if (jQuery('ul.selectFirmList').css('display') == 'none') {
				jQuery('#unwrapBtn').triggerHandler('click');
			}
			var anchors = jQuery('span.filterManu');
			if(anchors.length){
				anchors.triggerHandler('click',[brands]);
			}else{
				updateAnchors(location.hash.substr(1))
			}
		}
	}
	

	/*
    переход при изменении значения языка и валюты
	 */

	jQuery("#language_code").change (
		function(){
			var lang_code = jQuery(this).attr('value');
			jQuery('input[name=\'language_code\']').attr('value', lang_code);
			jQuery('#language_form').submit();
		//            return true;

		});

	jQuery("#currency_code").change (
		function(){
			var curr_code = jQuery(this).attr('value');
			jQuery('input[name=\'currency_code\']').attr('value', curr_code);
			jQuery('#currency_form').submit();
		//            return true;

		});



	/*
    для браузеров не поддерживающих HTML5 делаем по старинке заещаемый текст
	 */

	if (!Modernizr.input.placeholder)
	{

		jQuery(".searchForm .search input").eq(0).attr('value','Поиск...');

		jQuery(".searchForm .search input").eq(0).focus (
			function(){
				if(jQuery(this).val()=='Поиск...')
					jQuery(this).val('');
				return true;
			});
		jQuery(".searchForm .search input").eq(0).blur (
			function(){
				if(jQuery(this).val()=='')
					jQuery(this).val('Поиск...');
				return true;
			});
	}


	/*
    переход при изменении значения языка и валюты
	 */

	jQuery("#chooseLang").change (
		function(){

			var	temlel;
			if(jQuery(this).attr('value') == 1)
			{
				temlel = "http://www.ua.ru/";
			}
			else if (jQuery(this).attr('value') == 2)
			{
				temlel = "http://www.google.ru/";
			}
			else if (jQuery(this).attr('value') == 3)
			{
				temlel = "http://www.msn.com/";
			}


			window.top.location.href = temlel;
			return true;

		});

	jQuery("#choosePay").change (
		function(){


			var	temlel;
			if(jQuery(this).attr('value') == 1)
			{
				temlel = "http://www.ua.ru/";
			}
			else if (jQuery(this).attr('value') == 2)
			{
				temlel = "http://www.google.ru/";
			}
			else if (jQuery(this).attr('value') == 3)
			{
				temlel = "http://www.msn.com/";
			}


			window.top.location.href = temlel;
			return true;

		});

	/*
     раскрашиваем таблицу корзины
	 */

	//    jQuery(".basketForm table tr:even").addClass('even');
	jQuery(".wideDesText ul.wideDescrList li:even").addClass('even');

	$("#browsable").scrollable({
		circular: true
	}).navigator().autoscroll({
		interval: 5000
	});


	// Product images scroller
	function makeImagesScroller(){
		var imgScroller = $("#imgScroller");
		var listItems = imgScroller.find('li');
		var itemsInCont = (imgScroller.width()/(listItems.width() + 8)).toFixed(0);
		if(listItems.length <= itemsInCont){
			$('div.googSlider > a').addClass('disabled');
		}
		var group;
		var newImgScroller = imgScroller.clone(true);
		imgScroller.empty();
		while((group = newImgScroller.find('li:lt('+itemsInCont+')').remove()).length){
			group = $('<ul/>').append(group);
			imgScroller.append($('<div/>').append(group));
		}
		$('div',imgScroller).wrapAll('<div class="items" />');
		imgScroller.scrollable();
	}

	makeImagesScroller();



	/** Order History**/
	var orderItemsWrapper = $('div.orderItemsWrapper');
	$('span.orderItems-toggler').click(function(){
		var id = this.id.match(/(\d+)$/i)[1];

		if(!id){
			return false;
		}

		orderItemsWrapper.eq($(this).index('.orderItems-toggler')).toggle(0,function(){
			thisItems = jQuery(this);
			if(thisItems.not(':hidden')){
				thisItems.load('index.php?route=account/invoice/items&order_id='+id);
			}
		});
		return false;
	});
	
	// Prettyphoto
	$("a[rel^='prettyPhoto']").prettyPhoto({
		animation_speed: 'fast',
		theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
		show_title: false,
		social_tools: false,
		deeplinking: false
	});

});

/**
 * Reset Children Elements
 */
function resetChildrenEl(target) {
	var type;
	$('select, input',target).each(function(){
		type = this.type.toLowerCase();
		switch (type) {
			case "text":
			case "password":
			case "textarea":
			case "hidden":
				this.value = "";
				break;
			case "radio":
			case "checkbox":
				if (this.checked) {
					this.checked = false;
				}
				break;
			case "select-one":
			case "select-multi":
				this.selectedIndex = 0;
				break;
		}
	});
	return false;
}