/**
 * 
 */
debug = true;

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
}

var getU = function() {
	console.log("Get users!!!!!!!!!");
	return "User Tst - !123!!!!!!!!!";
}

//Entry Point - start changes listener
var recalcTotalsObserver = new MutationObserver(function(mutations)
{	
	//if (debug)
	//	console.log("");
	//recalculate();
	debounce(getU, 500, true);
});
recalcTotalsObserver.observe(document.body, {childList: true, characterData: true, attributes: false, subtree: true});

//var recalculate = debounce(getUsers, 500, true);

function getUsers() {
	console.log("Get users");
	return "User Tst - !123";
}



