/**
 * 
 */
function log(msg) {
	console.log(msg);
};

// Thanks @unscriptable - http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
var debounce = function (func, threshold, execAsap) {
    var timeout = null;
    return function debounced () {
    	var obj = this, args = arguments;
		function delayed () {
			if (!execAsap)
				func.apply(obj, args);
			timeout = null; 
		};

		if (timeout)
			clearTimeout(timeout);
		else if (execAsap)
			func.apply(obj, args);

		timeout = setTimeout(delayed, threshold || 100);
	};
};

//Entry Point - start changes listener
var recalcTotalsObserver = new MutationObserver(function(mutations)
{	
	$.each(mutations, function(index, mutation)
	{
		//if (mutation.addedNodes.length > 0)
		//	log("**");
		var $target = $(mutation.target);
		
		if ($target.hasClass('list-cards'))
		{
			var total = 0;
			$target.find('.list-card').each(function(){
				log("# Calculate qty for: " + $(this).find('a.list-card-title')[0].innerText);
				if (this.card)
				{
					log("# already calculated");
					return;
				}
				this.card = new card(this);
				log("# add new - " + this.card.qty);
				
				total += this.card.qty;
			});
			
			//get list element and create new list object
			var el = $target.closest('.list');
			if (!el.list)
				el.list = new list(el);
				
			el.list.total = total;
			el.list.show();
		} 
		else if ($target.hasClass('list-card-title'))
		{
			log("Cart title changed: " + $target[0].innerText);
			log($target.closest('.list-card')[0].card);
		}
	});

});

recalcTotalsObserver.observe(document.body, {childList: true, characterData: true, attributes: false, subtree: true});

//Entry Point 
$(function()
{
	setTimeout(function(){
		log("Calculate All");
		calculateAll();
		log("All calculated!");
	});
});

function calculateAll()
{
	$('.list').each(function()
	{
		var total = 0;
		$(this).find('.list-card').each(function()
		{
			log("* Calculate qty for: " + $(this).find('a.list-card-title')[0].innerText);
			if (this.card)
			{
				log("* already calculated");
				return;
			}
			this.card = new card(this);
			log("* add new - " + this.card.qty);	
			
			total += this.card.qty;
		});	
		
		//get list element and create new list object
		if (!this.list)
			this.list = new list(this);

		this.list.total = total;
		this.list.show();
	});
};
