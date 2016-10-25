$(function () {

    var $largeImage = $('#large-image img');

    $('#small-image img').bind('click', function(event){

        var largeImgSrc = $largeImage.attr('src');
        var largeImgAltSrc = $largeImage.attr('data-altsrc');

        $largeImage.attr('src', $(this).attr('data-altsrc'));
        $largeImage.attr('data-altsrc', $(this).attr('src'));

        $(this).attr('src', largeImgAltSrc);
        $(this).attr('data-altsrc', largeImgSrc);

    });

})
