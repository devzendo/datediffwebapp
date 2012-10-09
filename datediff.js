
var groups = [];

function startup()
{
	initMobiscroller();
	loadData();
	showGroups();
	
}

function initMobiscroller()
{
    $(function(){
        $('#i').scroller({
            preset: 'date',
            theme: 'ios',
            display: 'inline',
            mode: 'scroller',
            dateOrder: 'mmD ddyy'
        }); 
	});
}

function loadData()
{
    groups = [ 
	   "Birthdays", "CV Durations", "Accommodation", "Business",
        "Alive since", "Another", "Yet another", "More", "Endless", 
	   "Dates I forget","Embarrassing", "Isn't it?"
    ];
	groupedDates = [
	   /* Birthdays */ [ 
	       "Matt", 
		   "Angela", 
		   "Natasha", 
		   "Hannah", 
		   "Thomas"
	   ],
	   /* CV Durations */ [
	       "Known C",
		   "Known C++",
		   "Known Perl",
		   "Known UNIX" 
	   ],
	   /* Accommodation */ [
	       "Porthill",
		   "Alsagers Bank",
		   "Wolstanton",
		   "Keele",
		   "Westlands"
	   ],
	   /* Business */ [
	       "Synchro",
		   "Keele",
		   "Enigma",
		   "Inspired",
		   "Resilient"
	   ],
	   // etc, etc
	];	
}

// -----------------------------------------------------------------------------

function DateDetail(name, note, dateA, dateB, dateALocked, dateBLocked) {
	this.name = name;
	this.note = note;
	this.dateA = dateA;
	this.dateB = dateB;
	this.dateALocked = dateALocked;
	this.dateBLocked = dateBLocked;
}

DateDetail.prototype.setName = function(newName) {
	this.name = newName;
}

DateDetail.prototype.getName = function() {
    return this.name;
}

DateDetail.prototype.setNote = function(newNote) {
    this.note = newNote;
}

DateDetail.prototype.getNote = function() {
    return this.note;
}

DateDetail.prototype.setDateA = function(newDate) {
    this.dateA = newDate;
}

DateDetail.prototype.getDateA = function() {
    return this.dateA;
}

DateDetail.prototype.setDateB = function(newDate) {
    this.dateB = newDate;
}

DateDetail.prototype.getDateB = function() {
    return this.dateB;
}

DateDetail.prototype.setDateALocked = function(newDateLocked) {
    this.dateALocked = newDateLocked;
}

DateDetail.prototype.isDateALocked = function() {
    return this.dateALocked;
}

DateDetail.prototype.setDateALocked = function(newDateLocked) {
    this.dateALocked = newDateLocked;
}

DateDetail.prototype.isDateBLocked = function() {
    return this.dateBLocked;
}

// -----------------------------------------------------------------------------

function showGroups()
{
   	var newGrHtml = '<li class="arrow">' + 
	   groups.map(function(item, indx){
           return '<a href="#dates" onClick="showDates(' + indx + ')" >' + item + '</a>';
       }).join("") +
	   '</li>'; 
	$("ul#groups").find("li.arrow").replaceWith(newGrHtml);
	hideNoteButton();
	showPrefsButton();
}

function deleteGroup(groupIndex)
{
	alert("deleting group " + groupIndex);
}

function deleteDate(groupIndex, dateIndex)
{
    alert("deleting group " + groupIndex + " date " + dateIndex);
}

function showDates(groupIndex)
{
	hideNoteButton();
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
	$("div#datePanel a#deleteButton").click(function() {deleteDate(groupIndex, dateIndex)});
	showNoteButton();
}

function showPrefsButton()
{
    $("div.toolbar a#prefsButton").fadeIn();
}

function hidePrefsButton()
{
	$("div.toolbar a#prefsButton").hide();
}

function showNoteButton()
{
	$("div.toolbar a#noteButton").fadeIn();
}

function hideNoteButton()
{
    $("div.toolbar a#noteButton").hide();
}
