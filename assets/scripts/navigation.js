$(function () {

    $('#projects-nav').bind('click', function () {
        $(this).find('ul').slideToggle();
    });

    $('#menu-icon').bind('click', function(){
        $(this).children('div').toggleClass('change');
        $(this).siblings('#nav-list').slideToggle('slow', function(){
            //var style = $(this).attr('style');
            if($(this).attr('style') === "display: none;"){
                $(this).attr('style', '');
            }
        });
    });





});
