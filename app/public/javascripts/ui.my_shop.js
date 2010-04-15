/** 
 * @description:
 * @author: Santiago Gaviria
 * @version:
 * @requires: 
 */
$.widget("ui.my_shop", {
	_init: function() {
	    var self= this;

	    // attributes
	    this.user= this.options.user;
	    this.shop_name= "";
	    this.shop_description= "";
	    this.shop_website= "";
	    this.shop_logo= "";

	    if (this.element.hasClass("shop-new")) 
		this._open();
	    else
		this._visit();
	},
	_open: function() {
	    var $el= this.element;
	    var self= this;
	    var accept_terms= false;

	    var is_valid= function() {
		if (self.shop_name && accept_terms) {
		    return true;
		} else {
		    return false;
		}
	    };

	    this._prepare_form();

	    // terms of use checkbox
	    $("#my-shop-new-form .checkbox").checkbox()
		.bind("change", function(e,val) {
			$el.find(".terms-checkbox").val(val);
			accept_terms= val;
		    });

	    // post!
	    $("#my-shop-new-post").click(function() {
		    if (is_valid()) {
			$("#my-shop-new-form form").ajaxSubmit(function(html) {
				$el.html($(html).html());
				$el.removeClass("shop-new");
				self._visit();
			    });
		    }
		});
	},
        _visit: function() {
	    var $el= this.element;

	    $(window).trigger("shop-visit");
	    this._prepare_form();
	    $("#add-first-product").click(function() {
		    $.get("/shop/ui/product_form", function(html) {
			    $el.append($(html));
			    $el.find("#product-form").product_form();
			});
		});
	},
        _logo_uploadify: function() {
	    var $el= this.element;
	    var self= this;

	    var onSelect= function(event, queueID, fileObj) {
		return false;
	    };

	    var onComplete= function(event, queueID, fileObj) {
		var r= fileObj.filePath.replace(/\..+$/, function(m) {
			return "_thumb"+m;
		    });
		var img= $("<img/>").attr("src",r).addClass("logo");
		$el.find(".logo").replaceWith(img);
		$("#my-shop-new-form input[name='logo']").val(r);
	    };

	    $el.find("#shop-logo-uploadify").uploadify({
		    'uploader': '/javascripts/thirdparty/jquery/uploadify/uploadify.swf',
		    'script': '/'+self.user+'/shop/logo',
		    'folder': '/images/shops/'+self.user,
		    'buttonImg': '/images/boton-browse.png',
		    'auto':true,
		    'width':70,
		    'height':30,
		    'multi':false,
		    'fileDesc': 'selecciona una imagen para tu logo',
		    'fileExt':'*.jpg;*.gif;*.png',
		    'sizeLimit':10000000,
		    'onSelect': onSelect,
  		    'onComplete': onComplete,
  		    'queueID': "shop-logo-fileQueue"
			});
	},
	_prepare_form: function() {
	    var self= this;
	    this._logo_uploadify();
	    
	    // highlight fields on click
	    $("#my-shop-new-form").find("input,textarea")
		.focus(function() {
			$(this).select();
		    });
	    
	    // if name changes ...
	    $("#my-shop-new-form input[name='name']").change(function() {
		    self.shop_name= $.trim($(this).val());
		    if (self.shop_name=="") {
			$(this).val("Nombre de tu tienda");
		    }
		});

	    // if description changes ...
	    $("#my-shop-new-form textarea[name='description']").change(function() {
		    self.shop_description= $.trim($(this).val());
		    if (self.shop_description=="") {
			$(this).val("Descripcion");
		    }
		});

	    // if website changes ...
	    $("#my-shop-new-form input[name='website']").change(function() {
		    self.shop_website= $.trim($(this).val());
		    if (self.shop_website=="") {
			$(this).val("sitio web de tu tienda o negocio");
		    }
		});
	},
        _open_product_form: function() {
	}
    });