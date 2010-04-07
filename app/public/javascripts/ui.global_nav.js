$.widget("ui.marketplace_browser", {
	_init: function() {
	    var self= this;
	    $("#marketplace-title").click(function() {
		    self.expand();
		}).hide();
	},
	collapse: function() {
	    var $el= this.element;
	    $el.trigger("marketplace_browser_collapse");
	    $el.find(".marketplace-list").hide();
	    $el.find("#marketplace-title").show();
	},
        expand: function() {
	    var $el= this.element;
	    $el.trigger("marketplace_browser_expand");
	    $el.find(".marketplace-list").show();
	    $el.find("#marketplace-title").hide();
	}
    });

$.widget("ui.global_nav", {
	_init: function() {
	    $("#my-shop-nav").hide();
	    $("#marketplace-browser").marketplace_browser();

	    // when shop-open 
	    $(window).bind("shop-open", function() {
		    $("#marketplace-browser")
			.marketplace_browser("collapse");
		    // load my-shop-nav
		    $.get("/shop/ui/nav", function(html) {
			    $("#marketplace-browser").after(html);
			});
		});
	}

    });