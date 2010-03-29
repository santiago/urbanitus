$.widget("ui.sign_in", {
	_init: function() {
	    $("#login").click(function(e) {
		    $(window).click();
		    $(this).ghost_dialog({
			    width:300,
				chulito: "top",
				layout: "#layouts .ghost-dialog",
				content: $("#layouts #login-form").clone(),
				color: "negro",
				class: "login",
				pos:140
				});
		    e.stopPropagation();
		});
	    $("#sign-up").click(function(e) {
		    $("#terms-of-use").hide();
		    $(window).click();
		    $(this).ghost_dialog({
			    width:300,
				chulito: "top",
				layout: "#layouts .ghost-dialog",
				content: $("#sign-up-form").clone(),
				color: "negro",
				class: "sign-up",
				pos:100
				});
		    $("#sign-up-form").find(".terms .checkbox").checkbox();
		    $("#sign-up-form").find(".terms a").click(function(e){
			    $("#sign-up").ghost_dialog("height",420);
			    $("#terms-of-use").show();
			    e.preventDefault();
			});
		    e.stopPropagation();
		});
	    $(window).click(function() {
		    $("#login,#sign-up").ghost_dialog("close");
		});
	}
    });
jQuery(document).ready(function($) {
	$("#sign-in").sign_in();
    });