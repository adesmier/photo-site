require 'yaml'
require 'psych'
require 'httparty'

#read in YAML file into a variable
contentfulData = begin
  YAML.load(File.open("_data/contentful/spaces/posts.yaml"))
rescue ArgumentError => e
  puts "Could not parse YAML: #{e.message}"
end

#total number of projects
num_of_projects = contentfulData['projects'].length

#grab all media (last 5000 images) from Instragram account via API
instaAPIUrl = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=463968932.80d302d.ecba28686c2e407dbec4f387fe63dfad&count=5000'
instaResponse = HTTParty.get(instaAPIUrl)

#count variables
projects_counter = 0


begin
    title_slug = contentfulData['projects'][projects_counter]['title'].downcase.gsub(' ', '-')
    hashtag = contentfulData['projects'][projects_counter]['hashtag']
    filename = title_slug + ".md"

    data_counter = 0

    File.open("_projects/#{filename}", "w") do |f|
        f.puts '---'
        f.puts "layout: project"
        f.puts "title: #{contentfulData['projects'][projects_counter]['title']}"
        f.puts "description: #{contentfulData['projects'][projects_counter]['description']}"
        f.puts "images:"

        begin
            tag_counter = 0
            begin
                if instaResponse['data'][data_counter]['tags'][tag_counter] == hashtag
                    f.puts "    image_#{data_counter}:"
                    f.puts "        size_large: " + instaResponse['data'][data_counter]['images']['standard_resolution']['url']
                    f.puts "        size_small: " + instaResponse['data'][data_counter]['images']['thumbnail']['url']
                    f.puts "        link: " + "\"" + instaResponse['data'][data_counter]['link'].tr('\\', '') + "\""
                    f.puts "        caption: " + "\"" + instaResponse['data'][data_counter]['caption']['text'] + "\""
                end
                tag_counter+=1
            end while tag_counter < instaResponse['data'][data_counter]['tags'].length
            data_counter+=1
        end while data_counter < instaResponse['data'].length


        f.puts '---'

    end

    projects_counter+=1
end while projects_counter < num_of_projects
