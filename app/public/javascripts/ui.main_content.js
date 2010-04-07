$.widget("ui.main_content", {
	_init: function() {
	    var $el= this.element;
	    var user= this.options.username;
	    $(window).bind("my-shop-open", function() {
		    $el.load("/"+user+"/shop");
		});
	}
    });