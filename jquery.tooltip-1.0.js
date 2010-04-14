/* jquery.tooltip-1.0.js */
{
    jQuery.fn.tooltip = function(options) {
        var settings = jQuery.extend({
            content: false,
            prefix: 'jtn',
            find: false,
            attr: false,
            hover: false,
            children: new Array(),
            onCreate: function(container) {},
            onResize: function(event, container) {},
            onMouseMove: function(event, container) {},
            show: function(container, callback) {},
            hide: function(container, callback) {}
        }, options);
        return this.each(function() {
            var el = jQuery(this);
            var content = '';
            var container = jQuery('<div/>')
                .addClass(settings.prefix + '-tooltip-container')
                .appendTo(jQuery(this));
            var center = jQuery('<div/>')
                .addClass(settings.prefix + '-tooltip-center')
                .appendTo(container);
            
            function addChild(name) {
                jQuery('<div/>')
                    .addClass(settings.prefix + '-tooltip-' + name)
                    .appendTo(container);
            }
            for (var i = 0; i < settings.children.length; ++i) {
                addChild(settings.children[i]);
            }
            
            var found = jQuery(el);
            if (settings.content !== false) {
                content = settings.content;
            } else {
                if (settings.find) {
                    found = found.find(settings.find);
                    if (settings.attr === false) {
                        content = found.html();
                    }
                }
                if (settings.attr !== false) {
                    content = found.attr(settings.attr);
                }
            }
            center.append(content);
            
            if (settings.attr === 'title') {
                found.removeAttr('title');
            }
            
            if (!settings.hover) {
                container
                .mouseenter(function(e){
                    e.preventDefault();
                    return false;
                })
                .mousemove(function(e) {
                    var o = el.offset();
                    var h = el.outerHeight();
                    var w = el.outerWidth();
                    if (e.pageX > o.left + w
                    || e.pageX < o.left
                    || e.pageY > o.top + h
                    || e.pageY < o.top) {
                        settings.hide.call(el, e, container);
                    }
                });
            }
            
            settings.onCreate.call(el, container);
            settings.onResize.call(el, null, container);
            jQuery(window).resize(function(e) {
                settings.onResize.call(el, e, container);
            });
            el.mousemove(function(e) {
                settings.onMouseMove.call(el, e, container);
            });
            el.hover(function(e) {
                settings.show.call(el, e, container);
            }, function(e) {
                settings.hide.call(el, e, container);
            });
        });
    }
}
