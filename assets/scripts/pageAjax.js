$(function () {

    $('#nav-list a').bind('click', function(){

        var pageToLoad = $(this).attr('href')+' #main-content';

        $('#main-content').hide('fast', loadContent);

        $('#site-title').append('<span id="load">LOADING...</span>');
        $('#load').fadeIn('normal');

        function loadContent(){
            $('#main-content').load(pageToLoad, '', showNewContent);
        }

        function showNewContent(){
            $('#main-content').show('normal', hideLoader);
        }

        function hideLoader(){
            $('#load').fadeOut('normal');
        }

        return false;

    });



});
