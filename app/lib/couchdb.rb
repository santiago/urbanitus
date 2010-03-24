module CouchDBHelpers
  


#  COUCHDB_SERVER= 'http://190.71.157.42:5984'
#  COUCHDB_SERVER= 'http://192.168.2.243:5984'
  COUCHDB_SERVER= 'http://localhost:5984' 

  def get_document(db,id)
    RestClient.get couchdb_doc_url(db,id)
  end

  def post_database(db, data)
    RestClient.post "#{COUCHDB_SERVER}/#{db}", data.to_json
  end

  def post_doc(db, data)
    if defined? options
      RestClient.post couchdb_db_url(db), data
    else
      post_database(db,data)
    end
  end

  def update_doc(db, doc_id, data)
    data.merge!({:id => doc_id})
    post_db(db, data)
  end

  def post_db(db, data)
    post_doc(db, data)
  end

  def query_view(db,design,view,params)
    r=RestClient.get couchdb_view_url(db,design,view,params)
    data=JSON.parse r
    if data["rows"].empty?
      "no data"
    else
      data
    end
  end

  private
  def couchdb_db_url(db)
    "#{options.couchdb_server}/#{db.to_s}"
  end
  
  def couchdb_view_url(db,design,view,params={})
    url="#{options.couchdb_server}/#{db.to_s}/_design/#{design.to_s}/_view/#{view.to_s}"
    unless params.empty?
      query="?"
      params.each { |k,v| query << "#{k}=#{v}&" }
      query=query.gsub(/&$/,'')
      url << query
    end
    URI.escape(url)
  end
  
  def couchdb_doc_url(db,id)
    "#{options.couchdb_server}/#{db.to_s}/#{id}"
  end
end
