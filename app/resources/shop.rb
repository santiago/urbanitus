# left navigation for anonymous
get "/shop/ui/nav" do
  haml :my_shop_nav
end

# left navigation for "my shop"
get "/:user/shop/ui/nav" do
  haml :shop_nav if params[:user]==session["user"]["username"]
end
