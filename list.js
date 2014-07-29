/**
 * Trello Card List
 */
function list(el)
{
	this.$el = $(el);
	this.total = 0;
	
	var $total=$('<span class="list-total">');

	this.show = function()
	{
		$total.empty().appendTo(this.$el.find('.list-title,.list-header'));
		$total.append('<div/>').text(this.total > 0 ? this.total : '');
	};
}