$.widget("ui.main_content", {
	_init: function() {
	    var $el= this.element;
	    // when: my-shop-open
	    $(window).bind("my-shop-open", function() {
		    var user= $("#account").account("username");
		    $el.load("/"+user+"/shop");
		});
	    // when: marketplace-visit
	    $(window).bind("marketplace-visit", function() {
		    $el.load("/marketplace/ui/results");
		});
	}
    });