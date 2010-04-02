$.widget("ui.ghost_dialog", {
  _init: function() {
      var self= this;
      var $el= this.element.parent();
      var class= this.options.class ? $.trim(this.options.class) : "";
      this.dialog= ".ghost-dialog."+class;

      if ($el.css("position") != "absolute") $el.css({position:"relative"});

      this._layout= this.options.layout;
      $el.append($(this._layout).clone().addClass(class).hide());

      this.width= this.options.width-48;

      this.chulito= this.options.chulito; // top, right, bottom, left

      // position chulito
      this.clear_chulito();
      $el.find(this.dialog).addClass(this.chulito+"-chulito");
      // set color
      $el.find(this.dialog).addClass(this.options.color);
      // set custom class
      $el.find(this.dialog).addClass(class);

      $el.find(this.dialog).css("position","absolute");

      self.render(self.options.width);

      $el.find(this.dialog+" .close-dialog").click(function() { self.close() });

      // we want nothing to happen
      // when the dialog is clicked
      $el.find(this.dialog).click(function(e) {
	      e.stopPropagation();
	  });
    },
    close: function() {
      var $el= this.element.parent();
      $el.find(this.dialog).fadeOut(function() {$(this).remove();});
      this.destroy();
    },
    clear_chulito: function() {
      var $el= this.element.parent();
      $el.find(this.dialog).removeClass("top-chulito right-chulito bottom-chulito left-chulito");
    },
    content: function(content) {
      var $el= this.element.parent();
      $el.find(this.dialog+" .content").css("position", "relative");
      $el.find(this.dialog+" .content").html(content);
    },
    height: function(val) {
      var $el= this.element.parent();
      var left_chulito_height= $el.find(this.dialog+" .m-l-center").height();
      //var right_chulito_width= $el.find(this.dialog+" .m-r-center").width();

      // max position the chulito may have
      // according to given width
      var max_left_pos= val-left_chulito_height;
      //var max_right_pos= this.width-bottom_chulito_width;
      var left_top_height= 0;//pos;
      var left_bottom_height= Math.abs(max_left_pos-0);
      //      var left_bottom_height= pos;
      //var right_width= Math.abs(max_bottom_pos-pos);

      var height= left_top_height+left_chulito_height+left_bottom_height;
      if (this.chulito=="left" || this.chulito=="right") {
	$el.find(this.dialog+" .b-c-left").width(bottom_left_width);
	$el.find(this.dialog+" .b-c-right").width(bottom_right_width);
	$el.find(this.dialog+" .t-c-left").width(top_left_width);
	$el.find(this.dialog+" .t-c-right").width(top_right_width);
	$el.find(this.dialog+" .content").width(width);
      } else {
	$el.find(this.dialog+" .m-l-left").height(left_top_height);
	$el.find(this.dialog+" .m-l-right").height(left_bottom_height);
	$el.find(this.dialog+" .m-r-left").height(left_top_height);
	$el.find(this.dialog+" .m-r-right").height(left_bottom_height);
	$el.find(this.dialog+" .content").height(height);
      }
    },
    move_chulito: function(pos) {
      var $el= this.element.parent();

      var bottom_chulito_width= $el.find(this.dialog+" .b-c-center").width();
      var top_chulito_width= $el.find(this.dialog+" .t-c-center").width();

      // max position the chulito may have
      // according to given width
      var max_top_pos= this.width-top_chulito_width;
      var max_bottom_pos= this.width-bottom_chulito_width;
      var top_left_width= pos;
      var top_right_width= Math.abs(max_top_pos-pos);
      var bottom_left_width= pos;
      var bottom_right_width= Math.abs(max_bottom_pos-pos);

      var width= top_left_width+top_chulito_width+top_right_width;
      if (this.chulito=="bottom" || this.chulito=="top") {
	$el.find(this.dialog+" .b-c-left").width(bottom_left_width);
	$el.find(this.dialog+" .b-c-right").width(bottom_right_width);
	$el.find(this.dialog+" .t-c-left").width(top_left_width);
	$el.find(this.dialog+" .t-c-right").width(top_right_width);
	$el.find(this.dialog+" .content").width(width);
      }
    },
    render: function(width,height) {
      var $el= this.element.parent();
      $el.find(this.dialog).fadeIn();
      $el.find(this.dialog).width((width)+"px");
      this.move_chulito(this.options.pos);
      this.height(this.options.height);
      this.content(this.options.content);
      this.options.after_render($el.find(this.dialog));
    }
  });

$.ui.ghost_dialog.defaults= $.extend({},{height:200,width:200,pos:0,after_render:function(){}});