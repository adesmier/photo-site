$(function () {

    $('#nav-list a').bind('click', function(){

        var pageToLoad = $(this).attr('href') + '#main-content';
        console.log(pageToLoad);

        $('#main-content').hide('fast', loadContent);

        //$('#site-title').append('<span id="load">LOADING...</span>');
        //$('#load').fadeIn('normal');

        function loadContent(){
            $('#main-content').load(pageToLoad, '', showNewContent);
        }

        function showNewContent(){
            $('#main-content').show('normal');
        }

        //function hideLoader(){
        //    $('#load').fadeOut('normal');
        //}

        return false;

    });



});
