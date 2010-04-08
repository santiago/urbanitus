$.widget("ui.my_shop", {
	_init: function() {
	    var id= this.element.attr("id");
	    if (id=="my-shop-new") this._open();
	    if (id=="my-shop") this._visit();
	},
	_open: function() {
	    $("#my-shop-new-form .checkbox").checkbox();
	    $("#my-shop-new-post").click(function() {
		    $("#my-shop-new-form form").ajaxSubmit();
		});
	},
        _visit: function() {
	    $(window).trigger("shop-visit");
	}
    });