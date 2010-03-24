module Security
  require 'digest/sha1'
  require 'base64'
  include CouchDBHelpers

  class User
    attr_accessor :_id,:username,:email,:name,:lastname,:password
    def initialize(o)
      @_id= o.delete :id
      @username= o.delete :username
      @password= o.delete :password
      @email= o.delete :email
      @name= o.delete :name
      @lastname= o.delete :lastname
    end
  end

  def login(username,password)
    login_couchdb(username,password)
  end

  def login_couchdb(username,password)
    r= query_view(:users,:crud,:by_email,{"key"=>"\"#{username}\""})
    user= nil    
    user_data= r["rows"][0]["value"]
    if user_data["email"]==username && user_data["password"]==password
      user= {
        "id"=> user_data["_id"],
        "name"=> user_data["name"],
        "lastname"=> user_data["last_name"],
        "email"=> user_data["email"],
        "password"=> user_data["password"]
      }
    end
    user
  end

  def signup(username,password,captcha)
    r= query_view(:users,:security,:password_by_email,{:key=>username})
    if r["rows"][0].empty?
      {"error"=>"User already exists with the given email"}
    else
      user={
        "email"=> username,
        "password"=> password
      }
      post_db(:users, user.to_json)
      # trigger side-events for signup
    end
  end
end
