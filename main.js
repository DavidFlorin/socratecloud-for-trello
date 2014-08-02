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
		//log("Mutation: " + mutation.target.className);
		
		var $target = $(mutation.target);
		
		if ($target.hasClass('list-cards'))
		{
			var total = 0;
			$target.find('.list-card:not(.placeholder)').each(function()
			{	
				var $title = $(this).find('a.list-card-title');
				if ($title.length == 0)
					return;
					
				log("# Calculate qty for: " + $title[0].innerText);
				if (this.card)
				{
					log("# already calculated");
					total += this.card.qty;
					return;
				}
				this.card = new card(this);
				log("# add new - " + this.card.qty);
				
				total += this.card.qty;
			});
			
			//get list element and create new list object
			var $el = $target.closest('.list');
			if (!$el[0].list)
				$el[0].list = new list($el[0]);
				
			$el[0].list.setTotal(total);
		} 
		else if ($target.hasClass('list-card-title'))
		{
			log("Cart title changed: " + $target[0].innerText);
			
			var $el = $target.closest('.list-card');
			if ($el.length == 1)
			{
				if (!$el[0].card)
					$el[0].card = new card($el[0]);
				else
					$el[0].card.calculate();
			}
		}
		//Parse title in detail card
		else if ($target.hasClass('window-wrapper'))
		{
			var $title = $target.find('.window-title-text');
			if ($title.length > 0)
			{
				//log("Parse window-wrapper: " + $title[0].innerText);
				parseWindowTitle($title[0]);
			}
		}
		else if ($target.hasClass('window-title-text'))
		{
			//log("Parse window-title-text: " + $target[0].innerText);
			parseWindowTitle($target[0]);
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
				total += this.card.qty;
				return;
			}
			this.card = new card(this);
			log("* add new - " + this.card.qty);	
			
			total += this.card.qty;
		});	
		
		//get list element and create new list object
		if (!this.list)
			this.list = new list(this);

		this.list.setTotal(total);
	});
};

var parseWindowTitle = debounce(function(title)
{
	var text = title.innerText;
	log("Parse window-title-text: " + text);
	
	var index_from = text.indexOf('[');
	var index_to = text.indexOf(']', index_from);
	
	if (index_from == 0 && index_to >= 1)
	{
		var qty = new Number(text.substring(1, index_to));
		
		if (!isNaN(qty))
			title.innerText = text.substring(index_to + 1).trim();
	}
}, 100, true);

var getQtyFromTitle = function(titleText)
{
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
};
