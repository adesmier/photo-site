$(function () {

    var instagramURL = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=463968932.80d302d.ecba28686c2e407dbec4f387fe63dfad&count=5000&callback=?';
    var hashtag = $('#thumbnail-wrapper').children('h3').text().toLowerCase();

    $.getJSON(instagramURL).done(function(json){

        $.each(json.data, function(i, data){
            $.each(data.tags, function(i, tag){
                if(tag == hashtag){
                    $('<img>').attr({
                        src: data.images.thumbnail.url,
                        'data-altsrc': data.images.standard_resolution.url,
                        'data-caption': "<a href='" + data.link + "' target='_blank'>" + data.caption.text + '</a>'
                    }).appendTo( "#thumbnails" );
                    if(i == 0){
                        $('#project-wrapper').children('img').attr('src', data.images.standard_resolution.url);
                        $('#project-wrapper').children('figcaption').html("<a href='" + data.link + "' target='_blank'>" + data.caption.text + '</a>');
                    }
                }
            });
        });

    }).fail(function(jqxhr, textStatus, error){
        var err = textStatus + ', ' + error;
        console.log('Request Failed: ' + err);
    });




});
