
var groups = [];

function startup()
{
	loadData();
	showGroups();
}

function loadData()
{
    groups = [ 
	   "Birthdays", "CV Durations", "Accommodation", "Business",
        "Alive since", "Another", "Yet another", "More", "Endless", 
	   "Dates I forget","Embarrassing", "Isn't it?"
    ];
	groupedDates = [
	   /* Birthdays */ [ "Matt", "Angela", "Natasha", "Hannah", "Thomas"],
	   /* CV Durations */ [ "Known C", "Known C++", "Known Perl", "Known UNIX" ],
	   /* Accommodation */ [ "Porthill", "Alsagers Bank", "Wolstanton", "Keele", "Westlands"],
	   /* Business */ [ "Synchro", "Keele", "Enigma", "Inspired", "Resilient"],
	   // etc, etc
	];	
}

function showGroups()
{
	showPrefsButton();
   	var newGrHtml = '<li class="arrow">' + 
	   groups.map(function(item, indx){
           return '<a href="#dates" onClick="showDates(' + indx + ')" >' + item + '</a>';
       }).join("") +
	   '</li>'; 
	$("ul#groups").find("li.arrow").replaceWith(newGrHtml);
}

function showDates(groupIndex)
{
	hidePrefsButton();
    var newHtml = '<li class="arrow">' + 
       groupedDates[groupIndex].map(function(item, indx){
           return '<a href="#datePanel" onClick="showDate(' + groupIndex + ',' + indx + ')" >' + item + '</a>';
       }).join("") +
       '</li>'; 
    $("ul#dates").find("li.arrow").replaceWith(newHtml);
    $("ul#dates").attr("title", groups[groupIndex]);
}

function showDate(groupIndex, dateIndex)
{
	hidePrefsButton();
	var title = groupedDates[groupIndex][dateIndex]
    $("div#datePanel").attr("title", title);
	$("div#datePanel fieldset div input#dateName").attr("value", title);
}

function showPrefsButton()
{
    $("div.toolbar a#prefsButton").fadeIn(); //css({color:"#993300", fontWeight:"bold"}); //visibility="visible";
}

function hidePrefsButton()
{
	$("div.toolbar a#prefsButton").fadeOut(); //css({color:"#003399", fontWeight:"bold"}); //visibility="hidden";
}
