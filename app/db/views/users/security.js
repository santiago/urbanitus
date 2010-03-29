{
    by_email: {
	map: "function(doc) {
	    emit(doc.email, doc);
	}"
    },
    by_username: {
	map: "function(doc) {
	    emit(doc.username, doc);
	}"
    }
}