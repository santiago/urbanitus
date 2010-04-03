require 'sinatra'
require 'haml'
require 'sass'

require 'rest_client'
require 'uri'
require 'json'

require 'lib/couchdb'
require 'lib/security'
require 'lib/assets_helpers'
require 'lib/ui'
require 'lib/helper'

enable :sessions

configure :development do
  set :couchdb_server, 'http://localhost:5984'
  set :error_log_url, 'http://localhost:5984/errors'
end

# set sinatra's variables
set :app_file, __FILE__
set :root, File.dirname(__FILE__)


get '/screen.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :screen
end

def _post_error(msg)
  RestClient.post options.error_log_url, {:path=>request.path_info,:msg=>msg}.to_json
end

get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass "stylesheets/#{params[:name]}".to_sym
end

get '/' do
  session[:captcha]="c4pTcH4"
#  session["user"]= nil

  showcase_products= []
  3.times do |t|
    showcase_products << {:image_link=>"/images/gatito.png", :name=> "Producto de rub-ris #{t}"}
  end

  shop_results= []
  5.times do |t|
    shop_results << {
      :image_link => "/images/gatito.png",
      :presence => "online",
      :name => "La Tienda de rub-ris #{t}",
      :description => "La tienda de rub-ris es reconocida por su 
tradicion milenaria como la mejor tienda de los Universos. En esta tienda
encontraras todo lo que necesitas para cualquier cosa y algo mas",
      :showcase_products => showcase_products
    }
  end
  @body= haml :body, :locals => {:shop_results => shop_results}
  haml :home
end

get '/:user/shop' do
  if session[:user][:object].has_shop
    session[:user]
    return haml :shop, :locals => {:shop => shop}
  end
end

load 'resources/user.rb'
