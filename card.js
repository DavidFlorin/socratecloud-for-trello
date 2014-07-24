/**
 * Trello Card
 */
function card(el)
{
	this.$el = $(el);
	
	this.calculate = function()
	{
		$title = this.$el.find('a.list-card-title');
		//log("Calculate qty for: " + $title[0].innerText);
		
	};
	
	//calculte when instantiate
	this.calculate();
}