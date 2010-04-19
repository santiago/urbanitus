{
    by_owner: {
	map: function(doc) {
	    emit(doc.owner,doc);
	}
    }
}