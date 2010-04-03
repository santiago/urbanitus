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
    if session["user"]==nil
      login_couchdb(username,password)
    else
      {"user"=>"already logged in"}
    end
  end

  def email_check(email)
    email_check_couchdb(email)
  end

  def username_check(username)
    username_check_couchdb(username)
  end

  def email_check_couchdb(email)
    r=query_view(:users,:security,:by_email,{"key"=>"\"#{email}\""}) 
    r.empty? ? {:exists=>false} : {:exists=>true}
  end
  
  def username_check_couchdb(username)
    r=query_view(:users,:security,:by_username,{"key"=>"\"#{username}\""})
    r.empty? ? {:exists=>false} : {:exists=>true}
  end

  # [] means failed login: user not found
  #
  # {:} means successful login
  def login_couchdb(username,password)
    r=query_view(:users,:security,:login,{"key"=>"[\"#{username}\",\"#{password}\"]"})
    r.empty? ? r : r[0]["value"]
  end

  def signup(params)
    # wrong captcha
    return {:error=> "wrong captcha"} if params[:captcha]!=session[:captcha]
    # passwd and re don't match
    return {:error=> "passwords don't match"} if params[:password]!=params[:repassword]
    # email availability check
    return {:error=> "email already exists"} if email_check(params[:email])[:exists]
    # username availability check
    return {:error=> "username already exists"} if username_check(params[:username])[:exists]
    
    # if everything goes ok
    # save the new user
    user={
      "username"=> params[:username],
      "email"=> params[:email],
      "password"=> params[:password]
    }
    r=JSON.parse post_db(:users, user.to_json)
    # something could go wrong talkin 
    # to couchdb, capture exception
    if r["ok"]
      # trigger side-events for signup
      session["user"]["id"]= r["id"]
      session["user"]["username"]= user["username"]
      session["user"]["email"]= user["email"]
      r["ok"]
    else
      # something went wrong within
      # couchdb transaction
      {:error => r["reason"]}
    end
  end
end
