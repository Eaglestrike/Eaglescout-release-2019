(function($){
	$(function(){
		$('.button-collapse').sideNav();
  });
})(jQuery);
$(document).ready(function() {
	$('select').material_select();
	$('input[type=range]').val(0);
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