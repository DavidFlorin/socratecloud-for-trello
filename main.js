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
			var totalQty = 0;
			var totalEstimated = 0;
			$target.find('.list-card:not(.placeholder)').each(function()
			{	
				var $title = $(this).find('a.list-card-title');
				if ($title.length == 0)
					return;
					
				log("# Calculate qty for: " + $title[0].innerText);
				if (this.card)
				{
					log("# already calculated");
					totalQty += this.card.qty;
					totalEstimated += this.card.estimated;
					return;
				}
				this.card = new card(this);
				log("# add new - " + this.card.qty);
				
				totalQty += this.card.qty;
				totalEstimated += this.card.estimated;
			});
			
			//get list element and create new list object
			var $el = $target.closest('.list');
			if (!$el[0].list)
				$el[0].list = new list($el[0]);
				
			$el[0].list.setTotals(totalQty, totalEstimated);
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
			//parse comments from activities
			parseComments($target);
		}
		else if ($target.hasClass('window-title-text'))
		{
			//log("Parse window-title-text: " + $target[0].innerText);
			parseWindowTitle($target[0]);
		}
		//parse comments from activities
		else if ($target.hasClass('js-list-actions'))
		{
			parseComments($target);
		}
		//comment change - except when click to edit
		else if ($target.hasClass('phenom-comment'))
		{
			if (!$target.hasClass('editing'))
				parseComments($target);
//			else
//			{
//				var $trg = $target;
//				$target.find(':submit').click(function(data, event ) {
//					//change text
//					$trg.find('textarea')[0].innerText = "fff";
//				});
//			}
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


var calculateAll = function()
{
	$('.list').each(function()
	{
		var totalQty = 0;
		var totalEstimated = 0;
		$(this).find('.list-card').each(function()
		{
			log("* Calculate qty for: " + $(this).find('a.list-card-title')[0].innerText);
			if (this.card)
			{
				log("* already calculated");
				totalQty += this.card.qty;
				totalEstimated += this.card.estimated;
				return;
			}
			this.card = new card(this);
			log("* add new - " + this.card.qty);	
			
			totalQty += this.card.qty;
			totalEstimated += this.card.estimated;
		});	
		
		//get list element and create new list object
		if (!this.list)
			this.list = new list(this);

		this.list.setTotals(totalQty, totalEstimated);
	});
};

/**
 * Parse Window Title when open a Trello card to edit
 * */
var parseWindowTitle = debounce(function(title)
{
	var text = title.innerText;
	log("Parse window-title-text: " + text);
	
	var parsedTitle = parseCardTitle(text);
	if (parsedTitle)
	{
		title.innerText = parsedTitle.title;	
		document.title = parsedTitle.title;
	}

}, 100, true);

var parseComments = debounce(function($target)
{
	if ($target.hasClass('phenom-comment'))
	{
		if (!$target[0].comment)
			$target[0].comment = new comment($target[0]);
		else if (!$target[0].comment.isBadgeVisible())
			$target[0].comment.calculate();
	}
	else
	{
		$($target.find('.phenom-comment')).each(function()
		{
			if (!this.comment)
				this.comment = new comment(this);
		});
	}
}, 100, true);

/**
 *  Parse Card Title and return qty, estimated qty and parsed title
 *  @return null if could not parse title or format title is wrong 
 * */
var parseCardTitle = function(titleText)
{
	var response = {qty:0, estimated:0, title:''};
	
	var index_from = titleText.indexOf('[');
	var index_to = titleText.indexOf(']');
		
	if (index_from == 0 && index_to >= 1)
	{
		var index = titleText.indexOf('/');
		if (index > index_from && index < index_to)
		{
			response.qty = new Number(titleText.substring(index_from + 1, index));	
			response.estimated = new Number(titleText.substring(index + 1, index_to));	
		}
		else
		{
			response.qty = new Number(titleText.substring(index_from + 1, index_to));	
		}

		if (isNaN(response.qty) || isNaN(response.estimated)) //invalid numbers
			return null;
			
		response.title = titleText.substring(index_to + 1).trim();
	}
	else
	{
		return null;
	}
	
	return response;
};