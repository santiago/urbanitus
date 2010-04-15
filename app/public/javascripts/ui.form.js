$.widget("ui.form", {
  _init: function() {
    var self = this;
    var $el= this.element;

    this.fields= (function(_fields) {
	    var fields=[];
  	  for (f in _fields) {
	      fields.push("[name="+f+"]");
	    }
  	  return fields.join(","); // selector for all fields
    })(this.options.fields);

    $el.validate({
    	rules:this.options.rules,
    	messages:this.options.messages
    });
    $el.validate().form();
  },
  submit: function(callback) {
    if (this.validate()) {
    	this.element.ajaxSubmit({
  	    success: callback
	    });
    }
  },
  validate: function () {
      return this.element.validate().form();
    },
  reset: function() {
      //alert(this.fields);
      this.element.find(this.fields).val("");
    }
});
$.extend($.ui.form, {
  getter:"validate"
});