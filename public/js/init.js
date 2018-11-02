(function($){
	$(function(){
		$('.button-collapse').sideNav();
  });
})(jQuery);
$(document).ready(function() {
	$('select').material_select();
	$('input[type=range]').val(0);
});
$(document).ready(function(){
	$('.modal').modal();
});
$("#ranking-filter-select").change(function() {
	switch ($(this).val()) {
		case "switch_cubes":
			window.location.replace("/scout/teamranking?filter=switch_cubes");
			break;
		case "scale_cubes":
			window.location.replace("/scout/teamranking?filter=scale_cubes");
			break;
		case "exchange_cubes":
			window.location.replace("/scout/teamranking?filter=exchange_cubes");
			break;
		case "climb":
			window.location.replace("/scout/teamranking?filter=climb");
			break;
		case "lift":
			window.location.replace("/scout/teamranking?filter=lift");
			break;
		case "speed":
			window.location.replace("/scout/teamranking?filter=speed");
			break;
		case "":
			window.location.replace("/scout/teamranking");
			break;
		default:
			window.location.replace("/scout/teamranking");
			break;
	}
});

$(".increment_number_minus_button").click(function() {
	var element_for = $(this).data("for");
	$('input[name="' + element_for + '"]').val(parseInt($('input[name="' + element_for + '"]').val()) - 1);
});

$(".increment_number_plus_button").click(function() {
	var element_for = $(this).data("for");
	$('input[name="' + element_for + '"]').val(parseInt($('input[name="' + element_for + '"]').val()) + 1);
});