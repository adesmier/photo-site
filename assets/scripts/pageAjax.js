/*
Used on project pages - makes an API call to instagram to GET images tagged with project name
*/

$(function () {

    var instagramURL = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=463968932.80d302d.ecba28686c2e407dbec4f387fe63dfad&callback=?';
    var $projectWrapper = $('#project-wrapper');
    var $spinner = $projectWrapper.children('#loading-spinner');
    var $projectImage = $projectWrapper.children('img');
    var $projectCaption = $projectWrapper.children('figcaption');

    var $thumbnailWrapper = $('#thumbnail-wrapper');
    var $thumbnails = $thumbnailWrapper.children('#thumbnails');
    var hashtag = $thumbnailWrapper.children('h3').text().toLowerCase();
    var projImageSet = false;

    $.getJSON(instagramURL).done(function(json){
        console.log(json);
        $.each(json.data, function(dataIndex, data){
            $.each(data.tags, function(tagIndex, tag){
                if(tag == hashtag){
                    $('<img>').attr({
                        src: data.images.thumbnail.url,
                        'data-altsrc': data.images.standard_resolution.url,
                        'data-height': data.images.standard_resolution.height,
                        'data-loaded': 0,
                        'data-caption': "<a href='" + data.link + "' target='_blank'>" + data.caption.text + '</a>'
                    }).appendTo($thumbnails);
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
        });

    }).fail(function(jqxhr, textStatus, error){
        var err = textStatus + ', ' + error;
        console.log('Request Failed: ' + err);
    });

    $thumbnails.on('click', 'img', function(){

        var curHeroSrc = $projectImage.attr('src');
        var newHeroSrc = $(this).attr('data-altsrc');

        if(curHeroSrc == newHeroSrc){
            return;
        }

        var newHeroCap = $(this).attr('data-caption');
        var newHeight = $(this).attr('data-height');
        var $heroImage = $('<img>');

        if($(this).attr('data-loaded') == 0){
            $spinner.fadeIn();
        }

        $heroImage.on('load', function(){

            $spinner.fadeOut();
            $projectWrapper.css({'height': newHeight});

            $projectImage.attr('src', $heroImage.attr('src'));

            $spinner.css({'height': newHeight});
            $projectCaption.html(newHeroCap);

        });

        $heroImage.attr('src', newHeroSrc);
        $(this).attr('data-loaded', 1);


    });

});
