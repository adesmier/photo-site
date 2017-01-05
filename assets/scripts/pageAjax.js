/*
Used on project pages - makes an API call to instagram to GET images tagged with the project name
*/

$(function () {

    //used for checking whether cached version of json response has expired
    function insertExpiresDate(json){
        var date = new Date();
        date.setDate(date.getDate() + 1);//24 hour expires time
        var jsonDate = date.toJSON();

        var dateObj = {'date': jsonDate};
        json['expires'] = dateObj;
        return json;
    }

    //make ajax call to Instagram with specified URL
    function instagramAjaxRequest(url){
        $.getJSON(url).done(function(json){

            //catch all errors returned from instagram api
            if(json.meta.code != 200 && json.meta.error_message){
                //TODO: Handle error better!
                console.log('There was an error in the Json ' + json.meta.error_message);
            } else {
                if(json.data && json.data.length > 0){
                    json = insertExpiresDate(json);
                    //store reponse in local storage
                    window.localStorage.setItem('instagramResponse', JSON.stringify(json));
                    applyImagestoPage(json);
                }
            }

        }).fail(function(jqxhr, textStatus, error){
            var err = textStatus + ', ' + error;
            //TODO: Handle error better!
            console.log('Request failed with error: ' + err);
        });
    }

    //parse through returned json and apply thumbnails to project page
    function applyImagestoPage(json){
        $.each(json.data, function(dataIndex, data){

            if(data.tags && data.tags.length > 0){

                $.each(data.tags, function(tagIndex, tag){

                    if(tag == hashtag){

                        //image for thumbnails in nav area
                        var $image = $('<img>').attr({
                            src: data.images.thumbnail.url,
                            'data-altsrc': data.images.standard_resolution.url,
                            'data-height': data.images.standard_resolution.height,
                            'data-caption': "<a href='" + data.link + "' target='_blank'>" + data.caption.text + '</a>'
                        });
                        $image.appendTo($thumbnails);

                        //images used for lightbox modal
                        var $lightboxImage = $('<img>').attr({
                            src: '//:0',
                            'data-altsrc': data.images.standard_resolution.url,
                            'data-caption': "<a href='" + data.link + "' target='_blank'>" + data.caption.text + '</a>'
                        });
                        $lightboxImage.appendTo($lightbox.find('#lightbox-content'));

                        //set the initial hero image
                        if(!projImageSet){

                            var $heroImage = $('<img>');

                            $spinner.show();
                            $projectWrapper.css({'height': data.images.standard_resolution.height});

                            $heroImage.on('load', function(){
                                $spinner.hide();
                                $projectImage.attr('src', $heroImage.attr('src'));
                            });

                            $heroImage.attr('src', data.images.standard_resolution.url);
                            $projectCaption.html("<a href='" + data.link + "' target='_blank'>" + data.caption.text + '</a>');

                            projImageSet = true;
                        }

                    }

                });

            }

        });
    }

    //set hero image based on alt-src value of clicked thumbnail
    function setHeroImage($heroImage, newHeight, newHeroCap, newHeroSrc){

        //display spinner if image takes longer than 500ms to load
        var timer = setTimeout(function(){
            $spinner.fadeIn();
        }, 500);

        //load image into jQuery image object and display only when done
        $heroImage.on('load', function(){

            $projectWrapper.css({'height': newHeight});
            $projectImage.attr('src', $heroImage.attr('src'));

            $spinner.css({'height': newHeight});
            $projectCaption.html(newHeroCap);

            clearTimeout(timer);
            $spinner.fadeOut();

        });

        $heroImage.attr('src', newHeroSrc);

    };

    /************************END OF FUNCTION DEFINITIONS****************************/

    //TODO: api url needs abfuscating
    var instagramURL = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=463968932.80d302d.ecba28686c2e407dbec4f387fe63dfad&callback=?';

    //jQuery variables
    var $lightbox = $('#lightbox');
    var $projectWrapper = $('#project-wrapper');
    var $spinner = $projectWrapper.children('#loading-spinner');
    var $projectImage = $projectWrapper.children('img');
    var $projectCaption = $projectWrapper.children('figcaption');
    var $thumbnailWrapper = $('#thumbnail-wrapper');
    var $thumbnails = $thumbnailWrapper.children('#thumbnails');

    //project name to compare to hastags
    var hashtag = $thumbnailWrapper.children('h3').text().toLowerCase();
    var projImageSet = false;



    //first check is json response exists in clients local storage
    if(window.localStorage.getItem('instagramResponse') === null){
        instagramAjaxRequest(instagramURL);
    } else {
        //json exists now check if it's expired
        var storedJson = JSON.parse(window.localStorage.getItem('instagramResponse'));
        var storedDate = Date.parse(storedJson.expires.date);

        var date = new Date();
        date.setDate(date.getDate());//24 hour expires time
        var currentDate = Date.parse(date.toJSON());

        if(storedDate <= currentDate){ //expired so remove storage and make call
            window.localStorage.removeItem('instagramResponse');
            instagramAjaxRequest(instagramURL);
        } else { //valid so use stored json
            applyImagestoPage(storedJson);
        }
    }



    //MAIN JQUERY EVENT: User clicks on thumbnail image
    $thumbnails.on('click', 'img', function(){

        var curHeroSrc = $projectImage.attr('src');
        var newHeroSrc = $(this).attr('data-altsrc');


        //return if clicked thumbnail is already displayed
        if(curHeroSrc == newHeroSrc){
            if(window.innerWidth <= 477){
                $lightbox.css('display', 'block');
            }
            return;
        } else if(window.innerWidth <= 477){ //display lightbox if window width small enough
            $lightbox.css('display', 'block');
        }

        var newHeroCap = $(this).attr('data-caption');
        var newHeight = $(this).attr('data-height');
        var $heroImage = $('<img>');

        setHeroImage($heroImage, newHeight, newHeroCap, newHeroSrc);

    });

});
