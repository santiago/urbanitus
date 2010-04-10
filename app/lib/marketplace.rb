module Marketplace
  def shop_new(params)
    # user already has a shop
    shop= shop_get_by_owner(params[:owner])
    return {:error=> "user already have a shop"} unless shop.empty?
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

  def shop_get_by_owner(owner)
    r=query_view(:shops,:getter,:by_owner,{"key"=>"\"#{owner}\""})
    result= r.empty? ? r : r[0]["value"]
    result.delete "_id" unless r.empty?
    result.delete "_rev" unless r.empty?
    result
  end
end
