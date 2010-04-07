# left navigation for anonymous
get "/shop/ui/nav" do
  haml :my_shop_nav
end

# user's shop or my-shop component
# if user has not a shop, show my-shop-create
# else show my-shop
get "/:user/shop" do
  if session["user"]["my-shop"]
  else
    haml :my_shop_new
  end
end

# left navigation for "my shop"
get "/:user/shop/ui/nav" do
  haml :shop_nav if params[:user]==session["user"]["username"]
end
