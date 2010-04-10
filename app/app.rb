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
require 'lib/image'
require 'lib/marketplace'
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
  @body= haml :body
  haml :home
end

load 'resources/user.rb'
load 'resources/shop.rb'
load 'resources/marketplace.rb'
