/**
 * Trello Card
 */
function card(el)
{
	this.qty = 0;
	
	var $badge=$('<div class="badge badge-qty">'),
		$el = $(el);
	
	this.calculate = function()
	{
		var $title = $el.find('a.list-card-title');
		
		if(!$title[0])
		{
			this.qty = 0;
			return;
		}
		var parsedTitle = $title.data('parsed-title');				
		var titleText = $title[0].innerText;
		
		//nothing changed
		if (parsedTitle == titleText)
			return;
		
		var index_from = titleText.indexOf('(');
		var index_to = titleText.indexOf(')', index_from);
		
		if (index_from >= 0 && index_to >= 1)
		{
			this.qty = new Number(titleText.substring(1, index_to));
			
			if (isNaN(this.qty)) //invalid number
			{
				this.qty = 0;
				//do not change title
			}
			else
			{
				$title[0].innerText = titleText.substring(index_to + 1).trim();
			}
		}
		else
		{
			this.qty = 0;
		}
		
		$title.data('parsed-title', $title[0].innerText);
				
		show(this);
		
		//do not create new, new one is created in main.js
		var el = $el.closest('.list');
		if (el[0].list)
			el[0].list.calculate();
	};
	
	var show = function(card)
	{
		if (card.qty == 0)
			$badge.remove();
		else
			$badge.prependTo($el.find('.badges')).text(''+card.qty);
	};
	
	//calculte when instantiate
	this.calculate();
}
