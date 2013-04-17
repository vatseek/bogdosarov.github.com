$(document).ready(function () {
    $('#add_to_cart').removeAttr('onclick');

    if (!$('#add_to_cart').length) {
        $('.addToCart').live('click', function (event) {
            event.preventDefault();
            href = $(this).attr('href');
            reg = /product_id=([0-9]+)/
            var product_id = reg.exec(href);
            var product_img = $(this).parent().find('a.good img');

            if (!product_id) {
                window.location = href;
                return;
            }

            $.ajax({
                type: 'post',
                url: 'index.php?route=module/cart/callback',
                dataType: 'html',
                data: {
                    quantity:1, 
                    product_id: product_id[1]
                    },
                success: function (html) {
                    jQuery('#cart-side').html(html);
                },	
                complete: function () {
                    var image = $(product_img).position();
                    var cart  = $('#cart-side').offset();
                    var img = $(product_img).offset();
                    
                    $(product_img).before('<img src="' + $(product_img).attr('src') + '" id="temp" style="position: absolute; top: ' + image.top + 'px; left: ' + image.left + 'px;" />');	
                    params = {
                        top : '+=' + (cart.top - img.top),
                        left : '+=' + (cart.left - img.left),
                        opacity : 0.0,
                        width : $('#module_cart').width(),  
                        height : $('#module_cart').height()
                    };

                    $('#temp').animate(params, 'slow', false, function () {
                        $('#temp').remove();
                    });		
                }			
            });	
        });
    }

    $('#add_to_cart').click(function (event) {
        event.preventDefault();
        
        $.ajax({
            type: 'post',
            url: 'index.php?route=module/cart/callback',
            dataType: 'html',
            data: $('#product :input'),
            success: function (html) {
                jQuery('#cart-side').html(html);
            },	
            complete: function () {
                var image = $('#image').position();
                var img = $('#image').offset();
                var cart  = $('#cart-side').offset();
	
                $('#image').before('<img src="' + $('#image').attr('src') + '" id="temp" style="position: absolute; top: ' + image.top + 'px; left: ' + image.left + 'px;" />');
	
                params = {
                    top : '+=' + (cart.top - img.top),
                    left : '+=' + (cart.left - img.left),
                    opacity : 0.0,
                    width : $('#module_cart').width(),  
                    height : $('#module_cart').height()
                };
				
                $('#temp').animate(params, 'slow', false, function () {
                    $('#temp').remove();
                });		
            }			
        });			
    });			
});