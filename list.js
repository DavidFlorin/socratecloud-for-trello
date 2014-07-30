/**
 * Trello Card List
 */
function list(el)
{
	this.total = 0;
	
	var $total=$('<span class="list-total">'),
		$el = $(el);
	
	this.calculate = function()
	{
		var sum = 0;
		$el.find('.list-card').each(function(){
			if (this.card)
				sum += this.card.qty;
		});
		this.total = sum;
		
		show(this);
	};
	
	this.setTotal = function(total)
	{
		this.total = total;
		show(this);
	};

	var show = function(list)
	{
		$total.empty().appendTo($el.find('.list-title,.list-header'));
		$total.append('<div/>').text(list.total > 0 ? list.total : '');
	};
}