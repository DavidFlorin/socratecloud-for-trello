/**
 * Trello Card
 */
function card(el)
{
	this.$el = $(el);
	this.qty = 0;
	
	var $badge=$('<div class="badge badge-points point-count"/>');
	
	this.calculate = function()
	{
		$title = this.$el.find('a.list-card-title');
		
		if(!$title[0])
		{
			this.points = 0;
			return;
		}
		
		var titleText = $title[0].innerText;
		
		if (titleText.indexOf('(') >= 0 && titleText.indexOf(')') >= 1)
		{
			this.qty = new Number(titleText.substring(1, titleText.indexOf(')')));
			$title[0].innerText = titleText.substring(titleText.indexOf(')') + 1).trim();
		}
		else
		{
			this.points = 0;
			return;			
		}
		
		this.show();
	};
	
	this.show = function()
	{
		$badge.prependTo(this.$el.find('.badges')).text(''+this.qty);
	};
	
	//calculte when instantiate
	this.calculate();
}