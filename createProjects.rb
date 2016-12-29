require 'yaml'
require 'psych'

#read in YAML file into a variable
contentfulData = begin
  YAML.load(File.open("_data/contentful/spaces/posts.yaml"))
rescue ArgumentError => e
  puts "Could not parse YAML: #{e.message}"
end

#total number of projects
num_of_projects = contentfulData['projects'].length

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
        f.puts '---'
    end

    projects_counter+=1
end while projects_counter < num_of_projects
