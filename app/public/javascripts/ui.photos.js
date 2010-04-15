/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.photos", {
  _init: function() {
      var self= this;
      var $el= this.element;
      this.files= [];

      // HTML parts
      this.$showcase= $el.find(".photos");
      this.$uploader= $el.find(".uploader");
      this.$controls= $el.find(".photos-control");
      
      // display photos showcase
      this.$controls.find(".show").click(function() {
	  self.$uploader.hide();
	  self.$showcase.slideDown();
	});
      // display photos uploader
      this.$controls.find(".new").click(function() {
	  self.$showcase.hide();
	  self.$uploader.slideDown();
	});
      
      var onSelect= function(event, queueID, fileObj) {
	self.files.push(fileObj.name);
	self.element.trigger("photo-select", [fileObj.name, self.files]);
      };

      var onSelectOnce= function(event, data) {
	if (data.fileCount > 0) {
	  $el.find(".empty").hide();
	}
      };
      var onCancel= function(event,queueID,fileObj,data) {
	if (data.fileCount == 0) {
	  $el.find(".empty").show();
	}	
      };

      var onAllComplete= function(e, data) {
	$el.trigger("complete", [self.files, data]);
	self._callback(self.files,data);
	$el.find(".empty").show();
      };

      $el.find("#uploadify").uploadify({
    	  'uploader': '/javascripts/thirdparty/jquery/uploadify/uploadify.swf',
	      'script': '/products/images',
	      'folder': '/images/products',
	      'cancelImg': '/images/boton-cerrar-rojo.png',
	      'buttonImg': '/images/boton-buscar-negro.png',
	      'width':92,
	      'height':19,
	      'multi':true,
	      //'auto':true,
	      'fileDesc': 'fileDesc goes here',
	      'fileExt':'*.jpg;*.gif;*.png',
	      'sizeLimit':10000000,
	      'queueID': "fileQueue",
        'onSelect': onSelect,
	      'onSelectOnce': onSelectOnce,
	      'onCancel': onCancel,
	      'onAllComplete': onAllComplete
     	});
    },
    folder: function(folder_name) {
      this.element.find("#uploadify").uploadifySettings("folder", folder_name);
    },
    upload: function(callback) {
      this._callback= callback;
      this.element.find("#uploadify").uploadifyUpload();
    },
    _callback: function() {
      alert("duh!");
    },
    reset: function() {
      this.element.find("#uploadify").uploadifyClear();
    }
  });