/** 
 * @returns:
 * @author:
 * @version:
 * @requires:
 */
$.widget("ui.category_select", {
	_init: function() {
	    var $el=this.element;
	    var breadcrumb=["Inicio"];
	    var id_path=[];
	    var render_breadcrumb= function() {
		var $ul=$("<ul></ul>");
		for (var i=0; i<breadcrumb.length; i++) {
		    if (breadcrumb.length > 1 && i != 0)
			$ul.append($("<li>&raquo;</li>").addClass("right-arrow"));
		    $ul.append($("<li></li>").html("<a>"+jQuery.trim(breadcrumb[i])+"</a>"));
		}
		return $ul;
	    };
	    
	    var callback=function(e) {
		$click= $(this);
		$el.find(".category-item a.selected").removeClass("selected");
		$click.addClass("selected");
		var url=$(this).find("a").attr("href");
		var $category_list=$el.find(".items");

		var name= $click.find("a").text();
		var id= $click.find("a").attr("href").replace(/\/categories\//,"");
		id_path.push(id);
		if ($click.hasClass("leaf")) {
		    var event=jQuery.Event("category_selected");
		    $el.trigger(event,[id,name,id_path]);
		} else {
		    $category_list.load(url+"/children .category-item", function(text) {
			    $el.find(".category-item").bind("click", callback);
			    breadcrumb.push($click.find("a").html());
			    $el.find(".breadcrumb").html(render_breadcrumb());
			});
		}
		e.preventDefault();
	    };
	    
	    $el.find(".category-item").click(callback);
	} // _init
});