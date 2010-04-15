function find_position(obj) {
  var curleft = curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return [curleft,curtop];
}

$.widget("ui.dropbox", {
  _init: function() {
      var self= this;
      var $el= this.element;
      var pos=find_position(this.element.get(0));
      pos= this.options.position;

      var name= this.options.name;
      
      // HTML parts
      //      this.$container= $("<div/>").addClass("dropbox-container");
      this.$list= $("<ul/>").addClass("dropbox-list").hide();
      this.$item= $("<li/>").addClass("dropbox-item").css("display","block");
      this.$content= $("<p/>").attr("class","dropbox-content").text(this.options.name);
      this.$input= $("<input name=\""+name+"\" type=\"hidden\" />").attr("id", name+"-edit");

      for (var i=0; i < this.options.options.length; i++) {
	var $li= this.$item.clone();
	$li.click(function(e) {
	    var value= $(this).text();
	    self.$content.text(value);
	    self.$list.slideUp();
	    var $input= $el.find("#"+name+"-edit").val(value).change();
	    $el.trigger("dropbox-change", [self.options.name, value]);
	    e.stopPropagation();
	  });
	$li.hover(function() {
	    $(this).css("color", "#000");
	    $(this).css("font-size", "14px");
	  },
	  function() {
	    $(this).css("color", "#999");
	    $(this).css("font-size", "14px");
	  });
	$li.append("<p/>").text(this.options.options[i].label);
	this.$list.append($li);
      }

      $el
	.append(this.$content)
	.append(this.$list)
	.append(this.$input);
      
      this.$input= $el.find(name+"-edit");

      $el.click(function(e) {
	  self.element.css("opacity",1);
	  self.$list.slideDown();
	});

      $el.addClass("dropbox");
	//	    .css("background","#FFF")
      if (this.options.position) {
	this.$container.css("position","relative")
	$el
	  .css("position","absolute")
	  .css("left",pos[0])
	  .css("top",pos[1])
	  .css("z-index",9000);
      }
      // add dropbox-container to wrap this element's parent
      /*      var $container= this.element.closest(".dropbox-container");
      if ($container.attr("class")==undefined) {
	this.element.parent().wrap(this.$container);
      }
      $container= this.element.closest(".dropbox-container");
      $container.append(this.element);*/
    },
    reset: function() {
      this.element.find("#"+this.options.name+"-edit").val("").change();
      this.$content.text(this.options.name);
    }
  });

$.widget("ui.eip_field", {
  _init: function() {
      var self= this;
      var $el= this.element;
      var id= this.options.name;
      var label= this.options.label;

      var types= {
        text:$("<input class='oeip-edit' id=\""+id+"-edit\" type=\"text\"/>").attr("name", id),
        textarea:$("<textarea class='oeip-edit' id=\""+id+"-edit\"/>").attr("name", id)
      };

      this.$input_el= (function(types,selected) {
	  var input_type= types["text"];
	  for(type in types) {
	    if (selected==type)
	      input_type= types[selected];
	  }
	  return input_type.hide();
	})(types,this.options.type);

      // HTML parts
      this.$span= $("<span/>");
      this.$label= $("<p/>").attr("class", "oeip-label").text(label);
      this.$content= $("<p/>")
	.attr("class", "oeip-content")
	.text(this.options.empty_text);
      
      this.$input_el.blur(function() {
	  $(this).hide();
	  var content= $.trim($(this).val());
	  if (typeof self.options.change=="function") self.options.change(id,label,content);
	  if (content == "") content = self.options.empty_text;
	  self.$content.text(content).show();
	});

      this.$input_el.keydown(function(e) {
	  if(e.keyCode == 13 && self.options.type != "textarea") {
	    $(this).blur();
	  }
	});

      $el
	.append(this.$label)
	.append(this.$span.append(this.$content).append(this.$input_el));
      
      $el.click(function(e) {
	  self.$input_el.show().focus();
	  self.$content.hide();
	});
    },
  _set: function() {
    },
  reset: function() {
      this.$input_el.val("");
      this.$input_el.blur();
    }
  });

$.widget("ui.dropdown", {
  _init: function() {
      var $el= this.element;
      var height= $el.find("li.selected").height();

      $el.find("li:not(.selected)").css({height:0});
      $el.find("li.selected").toggle(function() {
	  $el.find("li:not(.selected)").animate({height:height});
	},
	function() {
	  $el.find("li:not(.selected)").animate({height:0});
	});

    }
  });

$.widget("ui.user", {
  _init: function() {
      var self= this;
      var $el= this.element;
      if ($el.css("position") != "absolute") $el.css({position:"relative"});

      $el.append($("#layouts .ghost-dialog").clone().hide());
      $el.find(".ghost-dialog").css("position","absolute");
      $el.find(".ghost-dialog .content").append($("#layouts .message-dialog").clone());
      $el.find(".ghost-dialog .content").css("position", "relative");
      $el.click(function() {
	  // set width
	  $el.find(".ghost-dialog").show();
	  self.width(self.options.width);
	});

      $el.find(".ghost-dialog .message-dialog textarea").autoResize(/*{
	  // On resize:
	onResize : function() {
	    $(this).css({opacity:0.8});
	  },
	    // After resize:
	    animateCallback : function() {
	    $(this).css({opacity:1});
	  },
	    // Quite slow animation:
	    animateDuration : 150,
	    // More extra space:
	    extraSpace : 40
	    }*/);
    },
    width: function(width) {
      var $el= this.element;
      var center_chulito= false;

      var top_chulito= parseInt($el.find(".ghost-dialog .t-c-center")
				.css("width").replace("px",""));

      var right_chulito= parseInt($el.find(".ghost-dialog .m-r-right")
				.css("width").replace("px",""));

      var bottom_chulito= parseInt($el.find(".ghost-dialog .b-c-center")
				.css("width").replace("px",""));

      var left_chulito= parseInt($el.find(".ghost-dialog .m-l-center")
				.css("width").replace("px",""));

      
      var left= $el.find(".ghost-dialog .mid-left").width();
      var right= $el.find(".ghost-dialog .mid-right").width();
      var x_remain= width-left-right;
      var remain_top= x_remain-top_chulito;
      var remain_bottom= x_remain-bottom_chulito;

      var top_left= ((remain_top%2==0) ? (remain_top)/2 : Math.floor((remain_top)/2)+1);
      var top_right= (top_left%2==0) ? top_left : top_left-1;
      var bottom_left= ((remain_bottom%2==0) ? (remain_bottom)/2 : Math.floor(remain_bottom/2)+1);
      var bottom_right= (bottom_left%2==0) ? bottom_left : bottom_left-1;

      var center= top_left+top_right+top_chulito;

      //      alert(chulito_width);

      $el.find(".ghost-dialog").width(width+"px");
      if (center_chulito) {
	if ($el.find(".ghost-dialog").hasClass("top-chulito")) {
	  $el.find(".ghost-dialog").find(".t-c-left").width(top_left+"px");
	  $el.find(".ghost-dialog").find(".t-c-right").width(top_right+"px");
	}
      }

      $el.find(".ghost-dialog").find(".b-c-left").width(bottom_left+"px");
      $el.find(".ghost-dialog").find(".b-c-right").width(bottom_right+"px");

      $el.find(".ghost-dialog").find(".content").width(center+"px");

    }
  });
