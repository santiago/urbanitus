/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.checkbox", {
  _init: function() {
      var $el= this.element;
      this.state= $el.hasClass("checked");
      $el.click(function() {
	  $(this).toggleClass("checked");
	});
    },
    get: function() {
      return this.state;
    },
    set: function(state) {
      this.state= state;
    }
  });