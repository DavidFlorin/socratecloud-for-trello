/**
 *  Trello card comment
 */
function comment(el)
{
	this.qty = 5;
	
	var $badge=$('<div class="badge badge-qty hide-on-edit" level="normal">'),
		$el = $(el);
	
	this.calculate = function()
	{
		var p = $el.find('p')[0];
		var text = p.innerText;
		
		log("--> calculate qty for comment: " + text);
		
		var index_from = text.indexOf('[');
		var index_to = text.indexOf(']');
		
		if (index_from == 0 && index_to >= 1)
		{
			//get qty
			this.qty = new Number(text.substring(index_from + 1, index_to));
			
			//update text
			p.innerText = text.substring(index_to + 1).trim();
			
			if (isNaN(this.qty))
				this.qty = 0;
		}
		else
		{
			this.qty = 0;
		}
		show(this);
	};
	
	this.isBadgeVisible = function()
	{
		return $badge.is(':visible');
	};
	
	var show = function(comment)
	{
		if (comment.qty == 0)
			$badge.hide();
		else
			$badge.insertAfter($el.find('.phenom-desc')).text(''+comment.qty).show();
	};
	
	//calculate when instantiate
	this.calculate();
}