$(window).load(function() { 
	$("#status").fadeOut(); // will first fade out the loading animation
	$("#preloader").delay(100).fadeOut("slow"); // will fade out the white DIV that covers the website.
});


$( document ).ready(function() {
    
    $('.back-to-top-badge, .back-to-top').click(function() {
		$('#content').animate({
			scrollTop:0
		}, 500, 'easeInOutQuad');
		return false;
	});
    
    //Show Back To Home When Scrolling
        
    $(document).on('scroll', '#content', function () {
		alert(":");
        var total_scroll_height = $('#content')[0].scrollHeight
        var inside_header = ($(this).scrollTop() <= 150);
        var passed_header = ($(this).scrollTop() >= 0); //250
        var footer_reached = ($(this).scrollTop() >= (total_scroll_height - ($(window).height() +100 )));
        
        if (inside_header == true) {
            $('.back-to-top-badge').removeClass('back-to-top-badge-visible');
        } else if (passed_header == true)  {
            $('.back-to-top-badge').addClass('back-to-top-badge-visible');
        } 
        if (footer_reached == true){            
            $('.back-to-top-badge').removeClass('back-to-top-badge-visible');
        }
    });
    
	$(".swipebox").swipebox({
		useCSS : true, 
		hideBarsDelay : 3000 // 0 to always show caption and action bar
	});
    
    //Sidebar Activation for pages with proper functions
    
	
      
    
});



















