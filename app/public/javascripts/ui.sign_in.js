$.widget("ui.field", {
    _init: function() {
        this._valid= false;
	this.options.init(this);
    },
    valid: function(value) {
        this._valid= value;
        this.element.trigger("after_validate");
    },
    is_valid: function() {
	return this._valid;
    }
});
$.extend($.ui.field, {getter:"is_valid"});


$.widget("ui.sign_up_form", {
  _init: function() {
    var $el= this.element;
    var self= this;

    this.fields=[]; // array of ui.field
    this.button= this.element.find("button");

    // check that email and username are
    // available
    var validation_icon= function(ctx,is_valid,clear) {
	$(ctx).closest(".field")
	       .find(".check")
	       .removeClass("fail ok");

	if (clear) {
	    return false;
	}

	if (is_valid) {
	    $(ctx).closest(".field")
		.find(".check").addClass("ok");
	} else {
	    $(ctx).closest(".field")
	        .find(".check").addClass("fail");
	}
    };

    var validation_message= function(ctx,message) {
	if (message.length > 0) {
	    $(ctx).closest(".field")
	    .find(".error").html(message).show();
	} else {
	    $(ctx).closest(".field").find(".error").hide();
	}
    };


    // email field
    var $email_field= $el.find(".email.field input").field({
	init: function($ui) {
	    // on blur
	    $ui.element.blur(function() {
		var self= this;
		var regex= /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
		var val= $.trim($(this).val());
		var message="";
		// queda pendiente la validacion de formato.
		// parece q hay un problema con la regex
		if (!val.match(regex) && val!="") {
		    var url="/signup/email_check?email="+val;
		    $.getJSON(url, function(data) {
    		         $ui.valid(!data.exists);
			 if (data.exists) message= "email ya tiene una cuenta";
			 validation_message(self,message);
			 validation_icon(self,!data.exists);
			});
		} else {
		    $ui.valid(false);
		    message= "email no es v&aacute;lido";
		    validation_message(self,message);
		    validation_icon(self,false);
		}
		});
	    // on keydown
	    $ui.element.keydown(function() {
		  if (!$ui.is_valid()) {
		      validation_icon(this,"",true);
		      validation_message(this,"");
		  }
		});
	    }

	});
    this.add_field($email_field);

    // username field
    var $username_field= $el.find(".username.field input").field({
	init: function($ui) {
	    // on blur
	    $ui.element.blur(function() {
		var self= this;
		var val= $.trim($(this).val());
		var message="";
		if (val.length > 5) {
		    var url="/signup/username_check?username="+val;
		    $.getJSON(url, function(data) {
   		         $ui.valid(!data.exists);
			 if (data.exists) message= "alias ya existe, escoge otro";
			 validation_message(self,message);
			 validation_icon(self,!data.exists);
			});
		} else {
		    $ui.valid(false);
		    message= "debe tener entre 6 y 25 caracteres";
		    validation_message(self,message);
		    validation_icon(self,false);
		}
		});
	    // on keydown
	    $ui.element.keydown(function() {
  	          if (!$ui.is_valid()) {
		      validation_icon(this,"",true);
		      validation_message(this,"");
		  }
		});
	    }

	});
    this.add_field($username_field);

    // password
    var $password_field= $el.find(".password.field input").field({
	init: function($ui) {
	    // on blur
	    $ui.element.blur(function() {
		var self= this;
		var val= $.trim($(this).val());
		var message= "";
		if(val.length > 7) {
		    $ui.valid(true);
		    $el.find(".repassword.field input").attr("disabled",false);
		} else {
		    message= "la contrase&ntilde;a debe tener al menos 8 caracteres";	
		    $ui.valid(false);
		    validation_icon(self,false);
		    validation_message(self,message);
		}
	    });

	    $ui.element.keyup(function() {
		if($(this).val().length > 7) {
		    $el.find(".repassword.field input").attr("disabled",false);
		    validation_icon(this,true);
		    validation_message(this,"");
		} else {
		    $el.find(".repassword.field input").attr("disabled",true);
		}
	    });
         }
    });
    this.add_field($password_field);

    // repassword field
    var $repassword_field= $el.find(".repassword.field input").field({
	init: function($ui) {
	    // on blur
	    $ui.element.keyup(function() {
		var is_valid= false;
		var val= $.trim($(this).val());
		var message= "";
		if(val==$el.find(".password.field input").val() && val!="") {
		    is_valid=true;
		} else {
		    message= "las contrase&ntilde;as no coinciden";
		}

		$ui.valid(is_valid);
		validation_icon(this,is_valid);
		validation_message(this,message);
	    });
        }
    });
    this.add_field($repassword_field);

    // checkbox for terms  of use
    var $terms_field= $el.find(".terms .checkbox").field({
	init: function($ui) {
	    $ui.element.checkbox().bind("change", function(e,state) {
		    $ui.valid(state);
		});
	}
    });
    this.add_field($terms_field);

    // click on "terms of use"
    $el.find(".terms a").click(function(e){
	    $("#sign-up").ghost_dialog("height",420);
	    $("#terms-of-use").show();
	    e.preventDefault();
	});
    // sign up!
    $el.find("#post-sign-up").click(function() {
	    if (self.validate()) {
		$("#sign-up-form form").ajaxSubmit(function(html) {
		    $el.replaceWith(html);
		});
	    }
	});
  }, // _init
  validate: function() {
    for (var i=0;i<this.fields.length;i++) {
	if (!this.fields[i].field("is_valid")) {
	    this.button.attr("disabled", true);
	    return false;
	}
    }

    this.button.attr("disabled", false);
    return true;
  },
  add_field: function(field) {
    var self= this;
    this.fields.push(field);
    // bind to field's 'after_validate'
    field.bind("after_validate", function() {
	    self.validate();
	});
  }

});
$.widget("ui.sign_in", {
	_init: function() {
	    $("#login").click(function(e) {
		    $(window).click();
		    $(this).ghost_dialog({
			    width:300,
				height:100,
				chulito: "top",
				layout: "#layouts .ghost-dialog",
				content: $("#layouts #login-form").clone(),
				color: "negro",
				class: "login",
				pos:140
				});
		    // click to login
		    $("#post-login").click(function() {
			    $("#login-form form").ajaxSubmit({
				    success: function(data) {
					var login= $.evalJSON(data);
					if (login.error) {
					    $("#login-form")
						.prepend(
							 $("<p/>")
							 .addClass("error")
							 .text(login.error)
							 );
					    return true;
					}
					if (login=="") {
					    $("#login-form").find(".error")
						.html("alias, email o contrase&ntilde;a incorrectos")
						.show();
					    return true;
					}
					if (login.username) {
					    $(window).trigger("logged_in", [login]);
					}
					return false;
				    }
				});
			});
		    e.stopPropagation();
		});
	    $("#sign-up").click(function(e) {
		    $("#terms-of-use").hide();
		    //$(window).click();
		    $(this).ghost_dialog({
			    width:300,
				height:250,
				chulito: "top",
				layout: "#layouts .ghost-dialog",
				content: $("#sign-up-form").clone(),
				color: "negro",
				class: "sign-up",
				pos:100
				});
		    
		    $("#sign-up-form").sign_up_form();

		    e.stopPropagation();
		});
	    $(window).click(function() {
		    $("#login,#sign-up").ghost_dialog("close");
		});
	    $("#get-shop").click(function() {
		    $(window).trigger("shop_open");
		});
	}
    });

/*
    $(window).click(function(e) {
	    var $div= $("<div/>");
	    for (k in e) {
		var $p= $("<p/>");
		$p.html(k+":"+e);
		$div.append($p)
		    .css({position:"absolute"
				,top:0
				,left:0
				,border: "1px solid #000"
				,width: 200
				,height: 200});
	    }
	    $("#main").append($div);
	});

*/