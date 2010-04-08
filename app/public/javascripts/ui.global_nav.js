$.widget("ui.marketplace_browser", {
	_init: function() {
	    var self= this;
	    $("#marketplace-title").click(function() {
		    self.expand();
		}).hide();
	},
	collapse: function() {
	    var $el= this.element;
	    $el.trigger("marketplace-browser-collapse");
	    $el.find(".marketplace-list").hide();
	    $el.find("#marketplace-title").show();
	},
        expand: function() {
	    var $el= this.element;
	    $el.trigger("marketplace-browser-expand");
	    $el.find(".marketplace-list").show();
	    $el.find("#marketplace-title").hide();
	}
    });

$.widget("ui.global_nav", {
	_init: function() {
	    $("#marketplace-browser").marketplace_browser()
		.bind("marketplace-browser-expand", function() {
			$("#my-shop-nav").remove();
			$(window).trigger("my-shop-leave");
			$(window).trigger("marketplace-visit");
		    });

	    // when shop-open 
	    $(window).bind("my-shop-open", function() {
		    $("#marketplace-browser")
			.marketplace_browser("collapse");
		    // load my-shop-nav
		    $.get("/shop/ui/nav", function(html) {
			    $("#marketplace-browser").after(html);
			});
		});
	}

    });