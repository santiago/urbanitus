#
# module contains helpers for producing UI
# components
#
module UI
  # dynamically guess what helpers have been called
  # by creating accessor methods at runtime
  class Assets
    def initialize
      # instance variables are pushed to iv_array when
      # their respective writers are called
      @iv_array = []

      AssetsHelpers.instance_methods.each do |meth|
        self.class.send(:attr_reader, meth)
        iv_writer = lambda { |x|
          @iv_array = @iv_array | [meth]
          instance_variable_set("@#{meth}", x)
        }
        self.class.send(:define_method, "#{meth}=", iv_writer)
      end
    end

    # returns helpers that've been called only.
    def helpers
      @iv_array
    end
  end

  # generates head tag using HAML
  def haml_head(title, assets)
    head = ""
    head << "%head\n"
    head << "  %title #{title}\n"
    head << "  %meta{\"http-equiv\"=>\"Content-Type\", :content=>\"text/html;charset=utf-8\"}"
    assets.helpers.each do |lib|
      lib.gsub!(/@/, "")
      assets.send(lib).each {|path| head << "  #{send(lib, path)}\n"}
    end
    haml head
  end

  module Components
    def marketplace_results
      assets= Assets.new

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
      [assets, {:shop_results=>shop_results}]
    end

    def signin
      assets= jquery_ui_with_styles
      assets.js_tag << "ui.checkbox"
      assets.js_tag << "ui.ghost_dialog"
      assets.js_tag << "ui.sign_in"
      [assets, {:selector=> "#sign-in",
                :layouts => [:ghost_dialog,:signin_forms]}]
    end

    def ghost_dialog
      assets= jquery_ui_with_styles
      assets.js_tag << "ui.ghost_dialog"
      assets
    end

    def ui_components
      assets= Assets.new
      components=[]
      UI::Components.instance_methods.each do |c|
        components << c
      end
      [assets, {:components=> components}]
    end

    private
    def jquery_ui_with_styles
      assets= Assets.new 
      assets.css_link= ["styles"]
      assets.lib= ["jquery"]
      assets.jquery_plugin= ["ui/ui.core"]
      assets.js_tag= []
      assets
    end
  end

  module DesignHelpers  
    # =>
    # given some assets and a component's tpl
    # render the component as a standalone web page 
    # => 
    def design(tpl)
      assets,locals = send(tpl)
      head = haml_head tpl, assets
      layouts= locals.delete(:layouts)
      component = haml tpl.to_sym, :locals =>locals
      haml :standalone, :locals => {:head=>head, 
        :component => component, :layouts=> layouts,
        :selector=> locals.delete(:selector)}
    end
    
    # => 
    # embed an ui component to a tpl
    # => 
    def embed(tpl)
      assets,locals = send(tpl)
      haml tpl.to_sym, :locals=>locals
    end
  end
end

# delivers a single UI component as an isolated
# fully-functional standalone application
get '/design/:component' do
  design params[:component]
end

# delivers component's HTML
get '/ui/:component' do
  assets,locals = send(params[:component])
  haml params[:component].to_sym, :locals => locals
end
