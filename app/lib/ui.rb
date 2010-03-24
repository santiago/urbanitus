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
    def ui_components
      assets= Assets.new
      assets.lib = ["jquery"]
      assets.css_link = ["/javascripts/thirdparty/jquery/ui/cupertino/ui.all.css",
                         "/javascripts/thirdparty/jquery/jgrowl/jquery.jgrowl.css",
                         "home"]
      assets.js_tag = ["thirdparty/strophe/strophe.min",
                       "thirdparty/strophe/basic",
                       "home"]
      assets.jquery_plugin= ["ui/ui.core", "ui/ui.draggable", "ui/ui.resizable", "ui/ui.dialog", "jgrowl/jquery.jgrowl_minimized", "meerkat/meerkat-1.0"]
      assets

      components=[]
      UI::Components.instance_methods.each do |c|
        components << c
      end
      [assets, {:components=> components}]
    end
  end

  module DesignHelpers  
    #
    # given some assets and a component's tpl
    # render the component as a standalone web page 
    # => 
    def design(tpl)
      @session={}
      assets,locals = send(tpl)
      @head = haml_head tpl, assets
      @component = haml tpl.to_sym, :locals =>locals
      haml :standalone
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
