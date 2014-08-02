/**
 * Trello Card
 */
function card(el)
{
	this.qty = 0;
	this.total = 0;
	
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
		
		var index_from = titleText.indexOf('[');
		var index_to = titleText.indexOf(']', index_from);
		
		if (index_from == 0 && index_to >= 1)
		{
			var index = titleText.indexOf('/');
			if (index > index_from && index < index_to)
			{
				this.qty = new Number(titleText.substring(index_from + 1, index));	
				this.total = new Number(titleText.substring(index + 1, index_to));	
			}
			else
			{
				this.qty = new Number(titleText.substring(index_from + 1, index_to));	
			}
			
			if (isNaN(this.qty) || isNaN(this.total)) //invalid numbers
				this.qty = 0;
			else
				$title[0].innerText = titleText.substring(index_to + 1).trim();
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
		if (card.qty == 0 && card.total == 0)
			$badge.remove();
		else
		{
			var text = ''+card.qty;
			if (card.total > 0)
				text += ' / ' + card.total;
				
			$badge.prependTo($el.find('.badges')).text(text);
		}
	};
	
	//calculte when instantiate
	this.calculate();
}
