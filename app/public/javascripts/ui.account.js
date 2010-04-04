$.widget("ui.account",{
	_init: function() {
	    this.ui= {
		signin: "#sign-in"
	    };

	    $(this.ui.signin).sign_in();

	    $(window).bind("logged_in", function(e,login) {
		    $.get("/"+login.username+"/me", function(html) {
			    $("#sign-in")
				.replaceWith(html);
			});
		});
	}
    });