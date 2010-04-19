module Marketplace
  module Shop
    def has_shop?(username)
      !shop_find_by_owner(username).nil?
    end

    def shop_new(params)
      # user already has a shop
      shop= shop_find_by_owner(params[:owner])
      return {:error=> "user already have a shop"} unless shop.nil?
      # no name given for shop
      return {:error=> "no name given for shop"} if !params[:name] || params[:name]==""
      # terms of use not accepted
      return {:error=> "terms of use not accepted"} if params[:terms]!="true"
      
      shop={
        "name" => params[:name],
        "owner" => params[:owner]
      }
      shop["description"]=params[:description] if params[:description] && params[:description]!=""
      shop["logo"]=params[:logo] if params[:logo] && params[:logo]!=""
      
      r=JSON.parse post_db(:shops, shop.to_json)
    end
    
    def shop_find_by_owner(owner)
      r=query_view(:shops,:getter,:by_owner,{"key"=>"\"#{owner}\""})
      result= r.empty? ? nil : r[0]["value"]
      result.delete "_id" unless r.empty?
      result.delete "_rev" unless r.empty?
      result
    end

    def has_catalog?(shop)
      shop_get_products(shop)
    end

    def shop_get_products(shop)
    end
  end

  module Category
    def category_find_by_id_path(id_path)
      r=query_view(:categories,:getter,:by_id_path,{"key"=>"#{id_path}"})
      result= r.empty? ? nil : r[0]["value"]
      result.delete "_id" unless r.empty?
      result.delete "_rev" unless r.empty?
      result
    end

    def category_exists?(id_path)
      !category_find_by_id_path(id_path).nil?
    end
  end

  module Product
    def product_find_by_owner(owner)
      r=query_view(:products,:getter,:by_owner,{"key"=>"\"#{owner}\""})
    end

    def product_new(product)
      # =>
      # validations
      # =>
      # has valid category
      return {:error=>"wrong category"} unless category_exists?(product["category"])
      # price is a number
      # has valid condition
      # has an image
      #return {:error=>"no image given for product"} if !product["image_link"] || product["image_link"].empty? || product["image_link"]==""
      product["category"]= JSON.parse product["category"]
      r=JSON.parse post_db(:products, product.to_json)
    end
  end
end
