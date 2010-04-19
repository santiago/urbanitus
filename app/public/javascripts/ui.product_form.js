/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.category_field", {
  _init: function() {
      var $el= this.element;
      var self= this;
      this._value= "";

      $el.prepend($("<input name=\"category\" type=\"hidden\"/>").attr("id","category-edit"));

      this.$button= $el.find(".category-btn");
      this.$list= $el.find(".category-list").hide();
      
      // open product list
      this.$button.click(function(e) {
    	  //	  $(this).hide();
	      self.$list.slideToggle();
	    });
      // close product list
      this.$list.click(function(e) {
	    //	  $(this).slideUp(function() {self.$button.show();});
	    });
      // odds taint
      this.$list.find(".items li:odd").addClass("odd");

      // category select
      $el.category_select();

      $el.bind("category_selected", function(e,id,name,id_path) {
  	  var val= $.trim(name);
	  $el.find("input[name=category]").val($.toJSON(id_path)).change();
          self.$list.slideUp();
          self.$button.find(".label").text(val);
      });
  },
  reset: function() {
    this.element.find("input[name=category]").val("").change();
    this.$button.find(".label").text("category");
  }
});


/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.price_field", {
   _init: function() {
      var self= this;
      var $el= this.element;
      this.value= "";
      
      this.match= function() {
        var currency_regex=/^([0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)?|\.[0-9]+)$/;
      };
	
      $el.eip_field({name:"price",
	      label:"$",
	      empty_text:"precio"
	    });
    }
  });

/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.condition_field", {
  _init: function() {
      var self= this;
      var $el= this.element;

      $el.dropbox({
	name: "condition",
	options: [{label:"nuevo",value:"nuevo"},
		  {label:"usado",value:"usado"},
		  {label:"reparado",value:"reparado"}]
	    });
    },
      reset: function() {
      this.element.dropbox("reset");
    }
});

/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.images_field", {
	_init: function() {
	    var self= this;
	    var $el= this.element;
	    this.images=[];
	    this.reset();
	    
	    // bind for externdinamically calling reset
	    this.element.bind("reset",function() {this.reset()});
	    
	},
	reset: function() {
	    this.element.val("");
	},
	add: function(url) {
	    this.images.push(url);
	    this.element.val($.toJSON(this.images));
	}
});

/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.product_form", {
  _init: function() {
    var $el= this.element;
    // HTML parts
    this.$post_item= $el.find(".post-item");
    this.$post_item_content= this.$post_item.find(".post-item-content");
    this.$publish_btn= this.$post_item.find(".publish-btn");
    
    var $images_field= $el.find("#post-item-form input[name=image_link]").images_field();
    
    // photos showcase
    this.$photos= $el.find(".photos-container").photos()
	// when a photo is selected, set image-field
	.bind("photo-select", function(e,filename,queue) {
		$images_field.images_field("add", "http://assets.tengoantojo.com/images/products/santiago/"+filename);
	    });
    
    // > >
    //   post item form fields
    // > >
    // select category
    var $category_field= $el.find(".right-container .field.category").category_field();
    // name field
    var $name_field= $el.find(".bottom-container .field.name").eip_field({name:"name",
									  label:"",
									  empty_text:"nombre del producto"});
    // description field
    var $description_field= $el.find(".bottom-container .field.description").eip_field({
	    name:"description",
	    label:"",
	    empty_text:"descripción",
	    type:"textarea"
	});
    // price field
    var $price_field= $el.find(".right-container .field.price").price_field();
    // condition dropdown
    var $condition_field= $el.find(".right-container .field.condition").condition_field();
    // google checkbox
    var $google_checkbox= $el.find(".google .checkbox").checkbox();
    
    $("#post-item-form").form({
	    name:"post-item-form",
		fields: {
		    category:$category_field,
		    name:$name_field,
		    price:$price_field,
		    condition:$condition_field,
		    google:$google_checkbox,
		    description:$description_field,
		    image_link:$images_field
		},
		rules: {
		    category: "required",
		    name: "required",
		    description: "required",
		    condition: "required",
		    price: { "required": true, number: true}
	        },
		messages: {
		    category: {
		        required: "*",
			hidden: "debes elegir una categor&iacute;a"
		    },
		    name: {
		        required: "*",
			hidden:"debes escribir un nombre"},
		    description:{
		        required: "*",
			hidden: "debes escribir una descripci&oacute;n"},
		    condition: {
			required: "*",
			hidden:"debes elegir una condici&oacute;n"},
		    google: "",
		    price: {
		        required: "*",
			hidden:"debes escribir un precio"}
		    },
  		    submitHandler: function() {
			alert("submitted");
		    }
		});
	    
    // validate condition
    $condition_field.find("#condition-edit").change(function() {
	    $("#post-item-form").validate().element("#condition-edit");
	});
    // validate category
    $category_field.find("#category-edit").change(function() {
	    $("#post-item-form").validate().element("#category-edit");
	});

    // post item
    this.$publish_btn.click(function(e) {
	    $("#post-item-form").form("submit", function(responseText, statusText, xhr, $form) {
		    $el.trigger("product-posted");
		});
	});
    
	} // _init
    });



/*
		    var new_product_id= responseText; // autoid for just created product
		    // reload product list after (successful?) post
		    $el.find(".product-list").product_list("load", function() {
			    // upload photos after loading
			    $el.find(".photos-container")
				.photos("folder", responseText)
				.photos("upload", function(files,data) {
					self.$add_product_btn.click();
					var $product= $el.find(".product-list #"+new_product_id);
					$product.find(".product-image img")
					    .attr("src","http://assets.tengoantojo.com/images/products/santiago/"+files[0]+query_string());
				    });
				    });*/
