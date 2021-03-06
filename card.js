/**
 * Trello Card
 */
function card(el)
{
	this.qty = 0;
	this.estimated = 0;
	
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
		
		parsedTitle = parseCardTitle(titleText);
		
		if (parsedTitle)
		{
			this.qty = parsedTitle.qty;
			this.estimated = parsedTitle.estimated;
			//change title
			$title[0].innerText = parsedTitle.title;
		}
		else
		{
			this.qty = 0;
			this.estimated = 0;
		}
		
		$title.data('parsed-title', $title[0].innerText);
				
		show(this);
		
		//do not create new, new one is created in main.js
		var el = $el.closest('.list');
		if (el[0].list)
			el[0].list.calculate();
	};
	
	/**
	 * DOM change - add qty and estimated badge
	 * */
	var show = function(card)
	{
		if (card.qty == 0 && card.estimated == 0)
			$badge.remove();
		else
		{
			var text = ''+card.qty;
			var level = 'normal';
			if (card.estimated > 0)
			{
				if (card.estimated < card.qty)
					level = 'overhead';
				//else if ((card.qty / card.estimated)*100 >= 80)
				//	level = 'warning';

				text += ' / ' + card.estimated;
			}	
			
			//style and add to DOM
			$badge.attr('level', level).prependTo($el.find('.badges')).text(text);
		}
	};
	
	//calculate when instantiate
	this.calculate();
}
