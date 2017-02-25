//-------------------------------------------------
//Menu
//-------------------------------------------------

// $("#LeftMenu").load("menu.html");


//-------------------------------------------------
//標題toggle
//-------------------------------------------------

$('.tile-header h1').click(function() {
	$(this).parent().parent('.tile').toggleClass('minimized');
	return false;
});

$('.question').click(function() {
	$(this).parent().next('.tile-header h4').slideToggle(200);
	return false;
});

// $('.openAll').click(function() {
// 	$('.tile').toggleClass('minimized');
// 	// $('.first').removeClass('minimized');
// 	return false;
// });

$('.openAll').click(function() {
	$('.main .tile').removeClass('minimized');
	$('.openAll').addClass('hide');
	$('.closeAll').removeClass('hide').addClass('show');
	return false;
});

$('.closeAll').click(function() {
	$('.main .tile').addClass('minimized');
	$('.closeAll').removeClass('show').addClass('hide');
	$('.openAll').removeClass('hide');
	return false;
});
