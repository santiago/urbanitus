module Marketplace
  def shop_new(params)
    # wrong captcha
    return {:error=> "wrong captcha"} if params[:captcha]!=session[:captcha]
    # passwd and re don't match
    return {:error=> "passwords don't match"} if params[:password]!=params[:repassword]
    # email availability check
    return {:error=> "email already exists"} if email_check(params[:email])[:exists]
    # username availability check
    return {:error=> "username already exists"} if username_check(params[:username])[:exists]
    
  end
end
