if (reformalOptions && !Reformal) {

var Reformal = (function(config){

/* Util object that holds some helper functions and usefull one-time-calculated variables. */
var Util = {
    renderTemplate: function(template, params) {
        return template.replace(/{{(.*?)}}/g, function(a, b) {
            var r = params[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    },
    extendObject: function(a, b) {
        for(prop in b){
            a[prop] = b[prop];
        }
        return a;
    },
    includeCss: function(rules) {
        var ss = document.createElement('style');
        ss.setAttribute('type', 'text/css');
        ss.setAttribute('media', 'screen');
        if (ss.styleSheet) {
            ss.styleSheet.cssText = rules;
        } else {
            ss.appendChild(document.createTextNode(rules));
        }
        document.getElementsByTagName('head')[0].appendChild(ss);
    },
    isQuirksMode: function() {
        return document.compatMode && document.compatMode == "BackCompat";
    },
    logHit: function(id) {
        if (Util.isSsl) return;
        var rand =  Math.round(100000 * Math.random());
        var i = new Image();
        i.src = 'http://hits.informer.com/log.php?id=' + id + '&r=' + rand;
    },
    isSsl: 'https:' == document.location.protocol,
    proto: 'https:' == document.location.protocol ? 'https://' : 'http://'
}
Util.ieVersion = (function() {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        return new Number(RegExp.$1);
    }
    return null;
})()
Util.supportsCssPositionFixed = (function() {
    if (Util.ieVersion === null) {
        return true;
    }
    if (Util.ieVersion < 7) {
        return false;
    }
    return !Util.isQuirksMode();
})()

/* 
 * Definition of object with all configurable options and their default values. It's extended with user-defined values.
 */
var options = Util.extendObject({
    project_id        : null,          // Required
    project_host      : null,          // Required
    show_tab          : true,          // When true the tab will be created and shown automatically
    force_new_window  : false,         // When false forces project's page opening instead of opening widget
    tab_orientation   : "left",        // Possible values are left,right,top-left,top-right,bottom-left,bottom-right
    tab_indent        : "200px",  
    tab_image_url     : '',            // Required when show_tab is true
    tab_image_ssl_url : '',            // Specify it when tab's image url in https case differs from one in http case, otherwise tab_image_url with https: proto is used
    tab_is_custom     : false,         // Controls which css-styles will be used for tab.
    tab_bg_color      : 'transparent',
    tab_border_color  : '#FFFFFF',
    tab_border_radius : 5,
    tab_border_width  : 2,
    tab_shadow_color  : '#888',
    widget_width      : 740,           // Highly NOT recommended to change
    widget_height     : 520,           // Highly NOT recommended to change
    demo_mode         : false          // Never change it
}, config);

options.project_url = ['http://', options.project_host].join('');
options.widget_url = [Util.proto, 'reformal.ru/widget/', options.project_id, '?nhic=1&_=', Math.round(10000 * Math.random())].join('');
options.empty_gif_url =  [Util.proto, 'media.reformal.ru/widgets/v3/x.gif'].join('');
options.close_image_url = [Util.proto, 'media.reformal.ru/widgets/v3/close.png'].join('');
options.gradient_image_url = [Util.proto, 'media.reformal.ru/widgets/v3/', function() {
    switch (options.tab_orientation) {
        case 'left'        : return 'gl.png';
        case 'right'       : return 'gr.png';
        case 'top-left'    : return 'gt.png';
        case 'top-right'   : return 'gt.png';
        case 'bottom-left' : return 'gb.png';
        case 'bottom-right': return 'gb.png';
    }}()
].join('');

/* Prevent widget opening in IE<7 and IE in quirks mode */
if (!Util.supportsCssPositionFixed) {
    options.force_new_window = true;
}

/* Empty src attr will cause current page loading instead of image. Prevent this overload. */
if (!options.tab_image_url) {
    options.tab_image_url = options.empty_gif_url;
}

/* Normalize tab_image_url proto */
if (Util.isSsl) {
    options.tab_image_url = options.tab_image_ssl_url || function(url) {
        var parts = url.split('//');
        if (parts[0] == 'https:') return url;
        return 'https://' + parts[1]; 
    }(options.tab_image_url)
}

Tab = {
    tabImagePreloaded: false,
    tabImageHeight: 0,
    tabImageWidth: 0,
    show: function() {
        var tab, css_template, css_rules, onclick, onmouseover, onmouseout, indentUnit, indentValue, magrinCompensation;

        if (!this.tabImagePreloaded) {
            this.preloadTabImage();
            return;
        }

        indentUnit = /%/.test(options.tab_indent) ? '%' : 'px';
        indentValue = /\d+/.exec(options.tab_indent)[0];

        css_template = '#reformal_tab {display:block; font-size:0; background-color:{{tab_bg_color}} !important; line-height: 0; cursor: pointer; z-index:100001;';
        switch (options.tab_orientation) {
            case 'left':         css_template += 'left:0;'; break;
            case 'right':        css_template += 'right:0;'; break;
            case 'top-left':
            case 'bottom-left' : css_template += 'left:{{tab_indent}};'; break;
            case 'top-right'   :
            case 'bottom-right': css_template += 'right:{{tab_indent}};'; break;
        }

        if (indentUnit == '%') {
            magrinCompensation = this.tabImageHeight/2;
            if (!options.tab_is_custom) magrinCompensation += 10; // 10 for padding
            switch (options.tab_orientation) {
                case 'left':
                case 'right':        css_template += ['margin-top:', -magrinCompensation, 'px;'].join(''); break;
                case 'top-left':
                case 'bottom-left':  css_template += ['margin-left:', -magrinCompensation, 'px;'].join(''); break;
                case 'top-right':
                case 'bottom-right': css_template += ['margin-right:', -magrinCompensation, 'px;'].join(''); break;
            }
        }

        if (Util.supportsCssPositionFixed) {
            css_template += 'position:fixed;';
            switch (options.tab_orientation) {
                case 'left':        
                case 'right':        css_template += 'top:{{tab_indent}};'; break;
                case 'top-left':
                case 'top-right':    css_template += 'top:0;'; break;
                case 'bottom-left':
                case 'bottom-right': css_template += 'bottom:0;'; break;
            }
        } else {
            css_template += 'position:absolute;';
            switch (options.tab_orientation) {
                case 'left':
                case 'right':
                    if (indentUnit == '%')
                        css_template += 'top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + parseInt(document.documentElement.clientHeight || document.body.clientHeight)*{{tab_indent_value}}/100 + "px");';
                    else
                        css_template += 'top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + {{tab_indent_value}} + "px");';
                    break;
                case 'top-left':
                case 'top-right':    css_template += 'top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + "px");'; break;
                case 'bottom-left':
                case 'bottom-right': css_template += 'top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + parseInt(document.documentElement.clientHeight || document.body.clientHeight) - this.offsetHeight + "px");'; break;
            }
        }

        if (!options.tab_is_custom) {
            css_template += 'border:{{tab_border_width}}px solid {{tab_border_color}};';
            switch (options.tab_orientation) {
                case 'left'        : css_template += 'padding:10px 4px 10px 4px; border-left:0;   background: {{tab_bg_color}} url({{gradient_image_url}}) 0 0 repeat-y;    -webkit-border-radius:0 {{tab_border_radius}}px {{tab_border_radius}}px 0; -moz-border-radius:0 {{tab_border_radius}}px {{tab_border_radius}}px 0; border-radius:0 {{tab_border_radius}}px {{tab_border_radius}}px 0; -moz-box-shadow:1px 0 2px {{tab_shadow_color}};  -webkit-box-shadow:1px 0 2px {{tab_shadow_color}};  box-shadow:1px 0 2px {{tab_shadow_color}};'; break;
                case 'right'       : css_template += 'padding:10px 3px 10px 5px; border-right:0;  background: {{tab_bg_color}} url({{gradient_image_url}}) 100% 0 repeat-y; -webkit-border-radius:{{tab_border_radius}}px 0 0 {{tab_border_radius}}px; -moz-border-radius:{{tab_border_radius}}px 0 0 {{tab_border_radius}}px; border-radius:{{tab_border_radius}}px 0 0 {{tab_border_radius}}px; -moz-box-shadow:-1px 0 2px {{tab_shadow_color}}; -webkit-box-shadow:-1px 0 2px {{tab_shadow_color}}; box-shadow:-1px 0 2px {{tab_shadow_color}};'; break;
                case 'top-left'    :
                case 'top-right'   : css_template += 'padding:4px 10px 4px 10px; border-top:0;    background: {{tab_bg_color}} url({{gradient_image_url}}) 0 0 repeat-x;    -webkit-border-radius:0 0 {{tab_border_radius}}px {{tab_border_radius}}px; -moz-border-radius:0 0 {{tab_border_radius}}px {{tab_border_radius}}px; border-radius:0 0 {{tab_border_radius}}px {{tab_border_radius}}px; -moz-box-shadow:0 1px 2px {{tab_shadow_color}};  -webkit-box-shadow:0 1px 2px {{tab_shadow_color}};  box-shadow:0 1px 2px {{tab_shadow_color}};'; break;
                case 'bottom-left' : 
                case 'bottom-right': css_template += 'padding:5px 10px 3px 10px; border-bottom:0; background: {{tab_bg_color}} url({{gradient_image_url}}) 0 100% repeat-x; -webkit-border-radius:{{tab_border_radius}}px {{tab_border_radius}}px 0 0; -moz-border-radius:{{tab_border_radius}}px {{tab_border_radius}}px 0 0; border-radius:{{tab_border_radius}}px {{tab_border_radius}}px 0 0; -moz-box-shadow:0 -1px 2px {{tab_shadow_color}}; -webkit-box-shadow:0 -1px 2px {{tab_shadow_color}}; box-shadow:0 -1px 2px {{tab_shadow_color}};'; break;
            }
        } else {
            css_template += 'border: none;';
        }
        css_template += '}';

        if (!options.tab_is_custom) {
            css_template += '#reformal_tab:hover {';
            switch (options.tab_orientation) {
                case 'left'        : css_template += 'padding-left:6px;'; break;
                case 'right'       : css_template += 'padding-right:6px;'; break;
                case 'top-left':
                case 'top-right'   : css_template += 'padding-top:6px;'; break;
                case 'bottom-left' :
                case 'bottom-right': css_template += 'padding-bottom:6px;'; break;
            }
            css_template += '}';
        }

        css_template += '#reformal_tab img {border: none; padding:0; margin: 0;}';

        if (Util.ieVersion && Util.ieVersion < 7) {
            css_template += '#reformal_tab {display:inline-block; background-image: none;}';
            css_template += '#reformal_tab img {filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src="{{tab_image_url}}", sizingMethod="image");}';
        }

        css_rules = Util.renderTemplate(css_template, {
            tab_indent        : indentValue + indentUnit,
            tab_indent_value  : indentValue,
            tab_bg_color      : options.tab_bg_color,
            tab_image_url     : options.tab_image_url,
            tab_border_color  : options.tab_border_color,
            tab_border_radius : options.tab_border_radius,
            tab_shadow_color  : options.tab_shadow_color,
            tab_border_width  : options.tab_border_width,
            gradient_image_url: options.gradient_image_url
        })
        Util.includeCss(css_rules);

        onclick = [options.force_new_window ? "window.open('" + options.project_url + "')" : 'Reformal.widgetOpen()', 'return false;'].join(';'),
        onmouseover = "Reformal.widgetPreload();";
        onmouseout =  "Reformal.widgetAbortPreload();";

        if (options.demo_mode) {
            onclick = onmouseover = "return false;";
        }

        tab = document.createElement('a');
        tab.setAttribute('id', 'reformal_tab');
        tab.setAttribute('href', options.demo_mode ? '#' : options.project_url);
        tab.setAttribute('onclick', onclick);
        tab.setAttribute('onmouseover', onmouseover);
        tab.setAttribute('onmouseout', onmouseout);

        tab.innerHTML = Util.renderTemplate('<img src="{{tab_image_url}}" alt="" />', {
            tab_image_url: (Util.ieVersion && Util.ieVersion < 7) ? options.empty_gif_url : options.tab_image_url
        });
        document.body.insertBefore(tab, document.body.firstChild);
    },
    preloadTabImage: function() {
        var callback = function(imageObj) {
            imageObj.onload = function(){};
            if (Tab.tabImagePreloaded) {
                return false;
            }
            Tab.tabImagePreloaded = true;
            Tab.tabImageHeight = imageObj.height;
            Tab.tabImageWidth = imageObj.width;
            Tab.show();
        }
        var image = new Image();
        image.src = options.tab_image_url;
        if (image.complete) {
            callback(image);
        } else {
            image.onload = function() {
              callback(image);
            }
            image.onerror = function() {
                //silently pass
            }
        }
    }
}

var checkLink = function() {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') == -1) return;
    if (Util.isSsl) return;

    var nos = document.getElementsByTagName('noscript'),
        re = new RegExp('<\s*a[^>]*href[^>]*(reformal.ru|' + options.project_host + ')[^>]*>', 'i');
    for(var i = 0, length = nos.length; i < length; i++) {
        if (re.test(nos[i].textContent)) return;
    }

    var link,
        links = document.getElementsByTagName("a"),
        re = new RegExp('reformal.ru|' + options.project_host, 'i');
    for(var i = 0, length = links.length; i < length; i++) {
        link = links[i];
        if (link.id && link.id == 'reformal_tab') continue;
        if (re.test(link.href)) return;
    }

    var i = new Image();
    i.src = 'http://log.reformal.ru/bl.php?pid=' + options.project_id + '&url=' + window.location.href;
}

Widget = {
    hitCounted: false,
    preloaded: false,
    overleyElement: null,
    widgetElement: null,
    open: function() {
        if (!this.preloaded) {
            this.preload();
        }
        this.overleyElement.style.display = 'block';
        this.widgetElement.style.display = 'block';

        if (!this.hitCounted) {
            this.hitCounted = true;
            Util.logHit(1654);
        }
    },
    close: function() {
        this.overleyElement.style.display = 'none';
        this.widgetElement.style.display = 'none';
    },
    preload: function() {
        if (this.preloaded) {
            return;
        }

        var css_template = '\
            #reformal_widget-overlay {width:100%; height:100%; background:#000; position:fixed; top:0; left:0; z-index:100002;} \
            #reformal_widget-overlay {filter:progid:DXImageTransform.Microsoft.Alpha(opacity=60);-moz-opacity: 0.6;-khtml-opacity: 0.6;opacity: 0.6;} \
            #reformal_widget {position: fixed; z-index:100003; top:50%; left:50%; width:{{width}}px; height:{{height}}px; background:#ECECEC; margin: {{margin_top}}px 0 0 {{margin_left}}px; -webkit-border-radius: 6px; -moz-border-radius:  6px; border-radius:  6px;} \
            #reformal_widget {-webkit-box-shadow:0 0 15px #000; -moz-box-shadow: 0 0 15px #000; box-shadow:0 0 15px #000;} \
            #reformal_widget iframe {padding:0; margin:0; border:0;} \
            #reformal_widget #reformal_widget-close {display:block; width:34px; height:34px; background: url({{close_image_url}}) no-repeat 0 0; position:absolute; top:-17px; right:-17px; z-index:100004;}';

        if (!Util.supportsCssPositionFixed) {
            css_template += '\
                #reformal_widget-overlay {position: absolute; top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + "px");}\
                #reformal_widget {position: absolute; top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + parseInt(document.documentElement.clientHeight || document.body.clientHeight)/2 + "px");}';
        }
        var css_rules = Util.renderTemplate(css_template, {
            width          : options.widget_width,
            height         : options.widget_height,
            margin_left    : -options.widget_width/2,
            margin_top     : -options.widget_height/2,
            close_image_url: options.close_image_url
        });
        Util.includeCss(css_rules);

        this.overleyElement = document.createElement('div');
        this.overleyElement.setAttribute('id', 'reformal_widget-overlay');
        this.overleyElement.setAttribute('onclick', 'Reformal.widgetClose();');

        this.widgetElement = document.createElement('div');
        this.widgetElement.setAttribute('id', 'reformal_widget');
        this.widgetElement.innerHTML = ' \
            <a href="#" onclick="Reformal.widgetClose(); return false;" id="reformal_widget-close"></a> \
            <iframe src="' + options.widget_url + '" frameborder="0" scrolling="no" width="100%" height="100%"></iframe>';

        this.widgetElement.style.display = 'none';
        this.overleyElement.style.display = 'none';

        document.body.insertBefore(this.widgetElement, document.body.firstChild);
        document.body.insertBefore(this.overleyElement, document.body.firstChild);

        this.preloaded = true;

        try { checkLink(); } catch (err) { }
    }
}

if (options.show_tab) {
    Tab.show();
    if (Util.ieVersion !== null) {
        if (Util.isQuirksMode()) {
            Util.logHit(1657);
        } else {
            Util.logHit(1658);
        }
    }
}

var logTheBrowser = function() {
    if (Util.ieVersion !== null) {
        Util.logHit(1656);
    } else {
        Util.logHit(1655);
    }
}

var browserLogged = false;
var preloadTimeoutId = 0;

// Public methods
return {
    widgetOpen: function() {
        Widget.open();
    },
    widgetPreload: function() {
        if (!browserLogged) {
            browserLogged = true;
            logTheBrowser();
        }
        if (options.force_new_window) return;
        //if (Util.ieVersion !== null) return;
        /* Prevent preloading for accidental mouseover */;
        //preloadTimeoutId = setTimeout(function(){Widget.preload()}, 500);
    },
    widgetAbortPreload: function() {
        if (!preloadTimeoutId) return;
        clearTimeout(preloadTimeoutId);
    },
    widgetClose: function() {
        Widget.close();
    },
    tabShow: function() {
        Tab.show();
    }
}

})(reformalOptions)

}
