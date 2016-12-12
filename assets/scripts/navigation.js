/*
Used on all pages - expand Projects menu field and responsive menu icon
*/

$(function () {

    $('#projects-nav').on('click', function () {
        $(this).find('ul').slideToggle();
    });

    $('#menu-icon').on('click', function(){
        $(this).children('div').toggleClass('change');
        $(this).siblings('#nav-list').slideToggle('slow', function(){
            if($(this).attr('style') === "display: none;"){
                $(this).attr('style', '');
            }
        });
    });

});
