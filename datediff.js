
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
	       new DateDetail("Matt", "Matt's Note", "22/02/1969", "", false, true), 
		   new DateDetail("Bob", "Bob's note", "15/03/1986", "", false, true), 
		   new DateDetail("Steve", "Not born yet", "", "23/11/2015", true, false), 
		   new DateDetail("Kristin", "Lived in Sweden", "14/01/1987", "23/12/2004", false, false),  
		   new DateDetail("Today", "This is today", "", "", true, true),
	   ],
	   /* CV Durations */ [
	       new DateDetail("Known C", "", "01/01/1989", "", false, true),
		   new DateDetail("Known C++", "", "01/01/1991", "", false, true),
		   new DateDetail("Known Perl", "", "01/01/1993", "", false, true),
		   new DateDetail("Known UNIX", "", "01/01/1989", "", false, true), 
	   ],
	   /* Accommodation */ [
	       "Porthill",
		   "Alsagers Bank",
		   "Wolstanton",
		   "Keele",
		   "Westlands",
	   ],
	   /* Business */ [
	       "Synchro",
		   "Keele",
		   "Enigma",
		   "Inspired",
		   "Resilient",
	   ],
	   // etc, etc
	];
	currGroup = 0;
	currDetail = 0;	
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
	currGroup = groupIndex;
	hideNoteButton();
	hidePrefsButton();
    var newHtml = '<li class="arrow">' + 
       groupedDates[groupIndex].map(function(item, indx){
           return '<a href="#datePanel" onClick="showDate(' + groupIndex + ',' + indx + ')" >' + item.getName() + '</a>';
       }).join("") +
       '</li>'; 
    $("ul#dates").find("li.arrow").replaceWith(newHtml);
    $("ul#dates").attr("title", groups[groupIndex]);
}

function showDate(groupIndex, detailIndex)
{
	currDetail = detailIndex;
	hidePrefsButton();
	var detail = groupedDates[groupIndex][detailIndex]
    $("div#datePanel").attr("title", detail.getName());
	// TODO store the detail as a hidden object in the form?
	$("div#datePanel fieldset div input#dateName").attr("value", detail.getName());
	$("div#datePanel a#deleteButton").click(function() {deleteDate(groupIndex, detailIndex)});
	$("div.toolbar a#noteButton").click(function() {editNote(detail)});
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

function editNote(detail) {
	//alert("editing note '" + detail.getNote() + "'");
	$("form#noteDialog fieldset textarea#note").attr("value", detail.getNote());
	iui.showPageById("noteDialog");
	// TODO do stuff on ok, cancel
}
