# left navigation for anonymous
get "/shop/ui/nav" do
  haml :my_shop_nav
end

# user's shop or my-shop component
# if user has not a shop, show my-shop-create
# else show my-shop
get "/:user/shop" do
  if params[:user]==session["user"]["username"]
    if session["user"]["my-shop"]
    else
      haml :my_shop_new
    end
  end
end

# create / open shop for :user
post "/:user/shop" do
  if params[:user]==session["user"]["username"]
    shop_new(params)
  end
end


# left navigation for "my shop"
get "/:user/shop/ui/nav" do
  haml :shop_nav if params[:user]==session["user"]["username"]
end
