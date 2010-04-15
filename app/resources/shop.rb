# finders
get "/shop/by_owner" do
  shop_find_by_owner(params[:owner])
end

# left navigation for anonymous
get "/shop/ui/nav" do
  haml :my_shop_nav
end

# product-form
get "/shop/ui/product_form" do
  haml :product_form
end


# user's shop or my-shop component
# if user has not a shop, show my-shop-create
# else show my-shop
get "/:user/shop" do
  #session["user"]["has_shop"]=nil
  if params[:user]==session["user"]["username"]
    if session["user"]["has_shop"]
      shop= shop_find_by_owner(params[:user])
      haml :my_shop, :locals => {:shop => shop}
    else
      haml :my_shop, :locals => {:shop => {}}
    end
  end
end

get "/:user/shop.json" do
  if params[:user]==session["user"]["username"]
    shop_get_by_owner(params[:user]).to_json
  end
end

# create / open shop for :user
post "/:user/shop" do
  if params[:user]==session["user"]["username"]
    params.merge! ({:has_shop => session["user"]["has_shop"],
                    :owner => session["user"]["username"]})
    post= shop_new(params)
    unless post[:error]
      session["user"]["has_shop"]= post["id"]
      shop= shop_get_by_owner(params[:user])
      haml :my_shop, :locals => {:shop => shop}
    else
      post.to_json
    end
  end
end

# update logo image
post '/:user/shop/logo' do
  datafile = params[:Filedata]
  userdir = File.join("public","images","shops",params[:user])#, params[:folder].gsub(/\//,""))
  FileUtils.mkdir_p(userdir)
  filename = File.join(userdir, datafile[:filename])
  
  #  "#{datafile[:tempfile].inspect}\n"
  File.open(filename, 'wb') do |file|
    file.write(datafile[:tempfile].read)
  end
  
  # create logo thumb
  if thumb_me(datafile[:filename], userdir, 80)
#    return {:my_shop=>{:logo=>userdir.gsub(/^\/public/,"")}}.to_json
  end

  {:error=>"failed saving logo image"}
  "wrote to #{filename}\n"
end

# left navigation for "my shop"
get "/:user/shop/ui/nav" do
  haml :shop_nav if params[:user]==session["user"]["username"]
end

