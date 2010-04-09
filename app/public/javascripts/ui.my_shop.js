/** 
 * @description:
 * @author: Santiago Gaviria
 * @version:
 * @requires: 
 */
$.widget("ui.my_shop", {
	_init: function() {
	    var id= this.element.attr("id");
	    this.user= this.options.user;
	    this.shop_name= "";

	    if (id=="my-shop-new") this._open();
	    if (id=="my-shop") this._visit();
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

	    // terms of use checkbox
	    $("#my-shop-new-form .checkbox").checkbox()
		.bind("change", function(e,val) {
			$el.find(".terms-checkbox").val(val);
			accept_terms= val;
		    });

	    // highlight fields on click
	    $("#my-shop-new-form").find("input,textarea")
		.click(function() {
			$(this).select();
		    });

	    // if name changes ...
	    $("#my-shop-new-form input[name='name']").change(function() {
		    self.shop_name= $.trim($(this).val());
		    if (self.shop_name=="") {
			$(this).val("Nombre de tu tienda");
		    }
		});

	    var onSelect= function(event, queueID, fileObj) {
		return false;
	    };

	    var onComplete= function(event, queueID, fileObj) {
		var r= fileObj.filePath.replace(/\..+$/, function(m) {
			return "_thumb"+m;
		    });
		var img= $("<img/>").attr("src",r).addClass("logo");
		$el.find(".logo").replaceWith(img);
	    };

	    $el.find("#shop-logo-uploadify").uploadify({
		    'uploader': '/javascripts/thirdparty/jquery/uploadify/uploadify.swf',
		    'script': '/'+this.user+'/shop/logo',
		    'folder': '/images/shops/'+this.user,
		    'buttonImg': '/images/boton-browse.png',
		    'auto':true,
		    'width':70,
		    'height':30,
		    'multi':false,
		    'fileDesc': 'selecciona una imagen para tu logo',
		    'fileExt':'*.jpg;*.gif;*.png',
		    'sizeLimit':10000000,
		    'onSelect': onSelect,
		    'onComplete': onComplete
	    });



	    // post!
	    $("#my-shop-new-post").click(function() {
		    if (is_valid()) {
			$("#my-shop-new-form form").ajaxSubmit();
		    }
		});
	},
        _visit: function() {
	    $(window).trigger("shop-visit");
	}
    });