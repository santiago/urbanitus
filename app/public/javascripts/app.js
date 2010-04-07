jQuery(document).ready(function() {
	$("#account").account();
	$("#main-left").global_nav();
	$("#main-content").main_content({
		username: $("#account").account("username")
	    });
    });