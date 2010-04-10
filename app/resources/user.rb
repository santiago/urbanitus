# GET login
get '/login' do
  haml :login
end

# POST login
post '/login' do
  user=login(params[:username],params[:password])
  unless user.empty?
    session["user"]=user

    shop= shop_get_by_owner(params[:username])
    session["user"]["has_shop"]= shop unless shop.empty?
  end
  user.to_json
end

# GET logout
get '/logout' do
  session["user"]=nil
  redirect "/"
end

# POST signup
post '/signup' do
  r= signup params
  if (r==true)
    haml :signup_success
  else
    "Oops, something wrong just happened: #{r[:error]}"
  end
end

# GET signup:email_check
get '/signup/email_check' do
  email_check(params[:email]).to_json
end

# GET signup:username_check
get '/signup/username_check' do
  username_check(params[:username]).to_json
end

#
# user-specific
#

# top component to control
# and access to user's stuff
get "/:user/me" do
  haml :me if session["user"]["username"]==params[:user]
end
