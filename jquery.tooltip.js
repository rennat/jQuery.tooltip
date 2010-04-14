/*

jquery.tooltip.js

author      :Tanner Netterville
email       :tannern gmail
links       :http://www.tannern.com
             http://js.tannern.com
             http://github.com/rennat/jQuery.tooltip
description :A flexible jquery plugin for adding tooltips to elements. The aim
             of this plugin is not to plug and go; It is designed to speed up
             development of a custom tooltip.
             
             No CSS styles are applied directly by this script. Styles for
             tooltips should come from CSS and the functions passed into the
             options when calling $('#myElement').tooltip(options).
             
             You may specify the content text in the options or you can specify
             an attribute to use as the content text. You may also specify find
             as a jQuery selector that will be fed into .find() using the attr
             of the result as the content text. If no attr is specified the
             content text will be the .html() value for the element given
             tooltip or the results of find (if given)... this is confusing me;
             see the examples below.

=== Tooltip Generated HTML Structure ==========================================

    HTML:
        <div class="jtn-tooltip-container">
            <div class="jtn-tooltip-center">CONTENT STRING</div>
        </div>

=== Where content string comes from Examples ==================================
    
    HTML:
        
        <div id="A" title="My div">
            <a href="http://tannern.com" title="My link">My website</a>
        </div>
    
    Javascript:
        
        > $('#A').tooltip()
        = $('#A').html()
        = <a href="http://tannern.com" title="My Website">tannern.com</a>
        
        > $('#A').tooltip({content: 'Hi there!'});
        = Hi there!
        
        > $(#A').tooltip({attr: 'title'})
        = $(#A').attr('title')
        = My div
        
        > $(#A').tooltip({find: 'a'})
        = $(#A').find('a').html()
        = My website
        
        > $(#A').tooltip({find: 'a', attr: 'title'})
        = $(#A').find('a').attr('title')
        = My link
        
        > $(#A').tooltip({find: 'a', attr: 'href'})
        = $(#A').find('a').attr('href')
        = http://tannern.com

=== Options ===================================================================
    
    content
    - String
    - The content string of the tooltip.
    
    prefix
    - String
    - Applied to the beginning of the element class names for the tooltip
      elements. This allows multiple tooltip styles on one page.
    
    find
    - String
    - jQuery selector used in object.find() to select the child element of the
      object given tooltip that the content string will come from. Defaults to
      the object given tooltip. e.g. - a, img
    
    attr
    - String
    - Element attribute name used to populate the tooltip content string.
      Defaults to using jQuery's .html() method. e.g.- title, alt, href
    
    hover
    - Boolean
    - Should hovering over the tooltip but not the element make the tooltip
      stay shown?
    
    children
    - String Array
    - For each string in this array a div with the class name
      prefix + '-tooltip-' + child is appended to the tooltip container.
    
    onCreate
    - Function(container)
    - Called when the tooltip element is created. 'this' represents the element 
      given tooltip. Receives the argument container, which is the generated
      tooltip container.
    
    onResize
    - Function(event, container)
    - Called initially and when the window is resized. 'this' represents the
      element given tooltip. Receives the arguments event, the javascript
      event; container, which is the generated tooltip container.
    
    show
    hide
    - Function(event, container, callback)
    - Called when the tooltipped element hover starts and stops. 'this'
      represents the element given tooltip. Receives the arguments event, the
      javascript event; container, which is the generated tooltip container;
      and callback, which should be used as the animation complete function so
      that onShow and onHide are called.

*/

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
