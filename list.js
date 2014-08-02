/**
 * Trello Card List
 */
function list(el)
{
	this.totalQty = 0;
	this.totalEstimated = 0;
	
	var $total=$('<span class="list-total">'),
		$el = $(el);
	
	this.calculate = function()
	{
		var totalQty = 0;
		var totalEstimated = 0;
		$el.find('.list-card').each(function(){
			if (this.card)
			{
				totalQty += this.card.qty;
				totalEstimated += this.card.totalEstimated;
			}
		});
		this.totalQty = totalQty;
		this.totalEstimated = totalEstimated;
		
		show(this);
	};
	
	this.setTotals = function(totalQty, totalEstimated)
	{
		this.totalQty = totalQty;
		this.totalEstimated = totalEstimated;
		
		show(this);
	};
	
	/**
	 * DOM change - add list heder total qty and total estimated
	 * */
	var show = function(list)
	{
		$total.empty().appendTo($el.find('.list-header'));
		
		var text = '';
		var level = 'normal';
		if (list.totalQty > 0 || list.totalEstimated > 0)
		{
			text += list.totalQty;
			if (list.totalEstimated > 0)
			{
				if (list.totalEstimated < list.totalQty)
					level = 'overhead'; 
						
				text += ' / ' + list.totalEstimated;
			}
		}
				
		$total.attr('level', level).append('<div/>').text(text);
	};
}