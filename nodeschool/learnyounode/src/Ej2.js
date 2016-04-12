//console.log("HELLO WORLD")

//console.log(process.argv).slice(2).reduce(
//	function() {

var result = process.argv.slice(2).reduce(function(previousValue, currentValue, currentIndex, array) {
  return parseInt(previousValue) + parseInt(currentValue);
});

console.log(result);
		