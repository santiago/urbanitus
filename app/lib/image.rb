module Image_Manipulation
  require 'rubygems'
  require 'RMagick'
  require 'ftools'
  
  def thumb_me(file, dir, scale_to)
    img= Magick::Image.read "#{dir}/#{file}"
    width= img[0].columns.to_f
    height= img[0].rows.to_f
    format= "png"

    if file =~ /[A-Za-z0-9]+\.(jpg|png|gif)$/
      format= $1
    end

    if width > height
      thumb_width= scale_to
      thumb_height= scale_to*(height/width)
      thumb= img[0].scale(thumb_width, thumb_height)
      thumb.write "#{dir}/#{file.split(".")[0]}_thumb.#{format}"
      return true
    else
      thumb= img[0].scale(scale_to*(width/height), scale_to)
      thumb.write "#{dir}/#{file.split(".")[0]}_thumb.#{format}"
      return true
    end
    false
  end
  
  def scale_files_on_dir(dir)
    dir = ARGV[0] || "./"
  
    files = `ls #{dir}`.split("\n")
    files.each do |file|
      if file =~ /[A-Za-z0-9]+\.(jpg|png|gif)$/
        scale(file, $1, dir)
      end
    end
  end
end
