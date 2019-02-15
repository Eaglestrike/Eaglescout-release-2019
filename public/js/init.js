(function($){
	$(function(){
		$('.button-collapse').sideNav();
  });
})(jQuery);
$(document).ready(function() {
	$('select').material_select();
});
$(document).ready(function(){
	$('.modal').modal();
});
$("#ranking-filter-select").change(function() {
	if ($(this).val() == "") {
		window.location.replace("/scout/teamranking");
	} else {
		window.location.replace("/scout/teamranking?filter=" + $(this).val());
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