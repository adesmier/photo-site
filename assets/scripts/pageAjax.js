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

    $.getJSON(instagramURL).done(function(json){
        console.log(json);
        $.each(json.data, function(index, data){
            $.each(data.tags, function(index, tag){
                if(tag == hashtag){
                    $('<img>').attr({
                        src: data.images.thumbnail.url,
                        'data-altsrc': data.images.standard_resolution.url,
                        'data-height': data.images.standard_resolution.height,
                        'data-caption': "<a href='" + data.link + "' target='_blank'>" + data.caption.text + '</a>'
                    }).appendTo($thumbnails);
                    if(index == 0){
                        var $heroImage = $('<img>');

                        $spinner.show();
                        $projectWrapper.css({'height': data.images.standard_resolution.height});

                        $heroImage.on('load', function(){
                            $spinner.hide();
                            $projectImage.attr('src', $heroImage.attr('src'));
                        });

                        $heroImage.attr('src', data.images.standard_resolution.url);
                        $projectCaption.html("<a href='" + data.link + "' target='_blank'>" + data.caption.text + '</a>');
                    }
                }
            });
        });

    }).fail(function(jqxhr, textStatus, error){
        var err = textStatus + ', ' + error;
        console.log('Request Failed: ' + err);
    });

    $thumbnails.on('click', 'img', function(){

        var newHeroSrc = $(this).attr('data-altsrc');
        var newHeroCap = $(this).attr('data-caption');
        var newHeight = $(this).attr('data-height');

        //$spinner.show();
        $projectWrapper.add($spinner).css({'height': newHeight});
        $projectImage.attr('src', newHeroSrc);

        $projectImage.one('load', function(){
            //$spinner.hide();
        });

        $projectCaption.html(newHeroCap);

    });

});
