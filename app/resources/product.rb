#
# POST new product
#
post "/:user/shop/products" do
  if session['user']['username']==params[:user]
    item= params['product']
    item= {
      'title'=> params[:name],
      'description' => params[:description],
      'item_type' => "products",
      'item_language' => 'es',
      'price' => params[:price],
      'condition' => params[:condition],
      'category' => params[:category],
      'image_link' => params[:image_link]||"",
      'category_path'=> ""
    }
    product_new(item)
  end
end
