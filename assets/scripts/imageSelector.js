/*
Home Page usage only - enables swapping of images between hero and thumbnail sizes
*/

$(function () {

    $('#small-image .inner-gradient').on('click', function(){

        var clickedSrc = $(this).attr('data-imgsrc');
        var finalSrc = '';

        $('#large-image img').each(function(){

            var replacementSrc = $(this).attr('src');

            if($(this).hasClass('active-image')){
                $(this).removeClass('active-image');
                finalSrc = replacementSrc;
            }

            if(replacementSrc === clickedSrc){
                $(this).addClass('active-image');
            }

        });

        $(this).attr('data-imgsrc', finalSrc);
        $(this).next().attr('src', finalSrc);

    });


})
