var http        = require('http');
var fs          = require('fs');
var async       = require('async');
var yaml        = require('js-yaml');

/**
 * Convert the YAML file produced by the Contentful Jekyl plugin to a JSON object
 */
function parseYaml(yamlFile){

    var imageURLs = [];

    try{
        var data = yaml.safeLoad(fs.readFileSync(yamlFile));
    } catch(err) {
        return null;
    }

    if(data.homePageImages[0].heroImage){
        var url = 'http:' + data.homePageImages[0].heroImage.url;
        imageURLs.push(url);
    } else {
        return null;
    }

    if(data.homePageImages[0].thumbnailImages && data.homePageImages[0].thumbnailImages.length > 0){
        for(var i = 0; i < data.homePageImages[0].thumbnailImages.length; i++){
            var url = 'http:' + data.homePageImages[0].thumbnailImages[i].url;
            imageURLs.push(url);
        }
        return imageURLs;
    } else {
        return null;
    }

}

/**
 * Download the image at the URL passed in using http.get
 */
function downloadImage(url, dest, callback){

    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response){
        response.pipe(file);
        file.on('finish', function(){
            file.close();
            callback();
        });
    });

}

/**
 * Loop over imageURLs array and asynchronously download all images to local file system
 */
function fetchImages(yamlLocation, imageDest){

    return new Promise(function(resolve, reject){

        var imageURLs = parseYaml(yamlLocation);
        if(imageURLs !== null){

            var i = 1;

            async.each(imageURLs, function(url, next){
                downloadImage(url, imageDest + '/home-image-' + (i++) + '.jpg', next);
            }, function(err){
                if(err){
                    reject('A file failed to download');
                } else {
                    resolve('All images downloaded');
                }
            });

        } else {
            reject('Valid URLs not found in array');
        }

    });

}

//module.exports = fetchImages;
fetchImages('./_data/contentful/spaces/posts.yaml', './assets/images/home/download').then(function(result){
    console.log(result);
}, function(error){
    console.log(error);
});
