{
    by_id_path: {
	map: function(doc) {
	    emit(doc.id_path, doc);
	}
    }
}