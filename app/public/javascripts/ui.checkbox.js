/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.checkbox", {
  _init: function() {
      var $el= this.element;
      var self= this;
      $el.click(function() {
	  $(this).toggleClass("checked");
	  $(this).trigger("change", $el.hasClass("checked"));
	});
    }
  });