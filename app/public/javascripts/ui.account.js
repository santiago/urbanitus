$.widget("ui.account",{
	_init: function() {
	    this.ui= {
		signin: "#sign-in"
	    };

	    $(this.ui.signin).sign_in();

	    var my_shop_open= function() {
		$("#shop-open").click(function() {
			$(this).unbind().hide();
			if ($("#me").length==1) {
			    $(window).trigger("my-shop-open");
			} else {
			}
		    });
	    };
	    my_shop_open();

	    $(window).bind("my-shop-leave", function() {
		    $("#shop-open").show();
		    my_shop_open();
		});
	}
    });