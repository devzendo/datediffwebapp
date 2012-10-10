
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
	   "Birthdays", "CV Durations"
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
	   // etc, etc
	];
	currGroup = 0;
	currDetail = 0;	
	
	currDeleteEventFunction = null;
	currEditNoteFunction = null;
	currChangeNameFunction = null;
	currNoteEditOkFunction = null;
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
	constructDates(groupIndex);
    $("ul#dates").attr("title", groups[groupIndex]);
}

function constructDates(groupIndex)
{
    var newHtml = '<li class="arrow">' + 
       groupedDates[groupIndex].map(function(item, indx){
           return '<a href="#datePanel" onClick="showDate(' + groupIndex + ',' + indx + ')" >' + item.getName() + '</a>';
       }).join("") +
       '</li>'; 
    $("ul#dates").find("li.arrow").replaceWith(newHtml);	
}

function showDate(groupIndex, detailIndex)
{
	currDetail = detailIndex;
	hidePrefsButton();
	var detail = getDetail(groupIndex, detailIndex);
    setNameTitleOnDatePanel(detail.getName());
	// TODO store the detail as a hidden object in the form?
    setNameField(detail.getName());
	
	// Wire delete event button
	if (currDeleteEventFunction != null) {
		$("div#datePanel a#deleteButton").unbind("click", currDeleteEventFunction);
	}
	currDeleteEventFunction = function() {deleteDate(groupIndex, detailIndex)};
	$("div#datePanel a#deleteButton").click(currDeleteEventFunction);
	
	// Wire edit note button
	if (currEditNoteFunction != null) {
		$("div.toolbar a#noteButton").unbind("click", currEditNoteFunction);
	}
	currEditNoteFunction = function() {editNote(detail)};
	$("div.toolbar a#noteButton").click(currEditNoteFunction);
	
	// Wire edit name input handler
	if (currChangeNameFunction != null) {
		$("div#datePanel fieldset div input#dateName").unbind("change", currChangeNameFunction);
	}
	currChangeNameFunction = function() {onEditNameChanged(groupIndex, detailIndex)};
    $("div#datePanel fieldset div input#dateName").change(currChangeNameFunction);
	
	showNoteButton();
}

function getDetail(groupIndex, detailIndex)
{
	return groupedDates[groupIndex][detailIndex];
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

function onShowDatePanel()
{
	showNoteButton();
}

function setNameField(name) {
   $("div#datePanel fieldset div input#dateName").attr("value", name);
}

function setNameTitleOnDatePanel(name) {
	$("div#datePanel").attr("title", name);
}

function onEditNameChanged(groupIndex, detailIndex)
{
	var detail = getDetail(groupIndex, detailIndex);
	var newName = $("div#datePanel fieldset div input#dateName").val();
	if (newName.length == 0) {
		alert("The name cannot be empty");
		//setNameField(detail.getName());
	} else {
		var duplicate = false;
		for (var grIndex = 0; !duplicate && grIndex < groupedDates.length; grIndex++) {
			var group = groupedDates[grIndex];
			for (var deIndex = 0; !duplicate && deIndex < group.length; deIndex++) {
				var thisDetail = group[deIndex];
				if (thisDetail != detail) {
					if (detail.getName() == thisDetail.getName()) {
						duplicate = true;
						break;
					}
				}
			}
		}
		if (duplicate) {
			alert("The name cannot be a duplicate of another entry");
			//setNameField(detail.getName());
		} else {
			detail.setName(newName);
			//setNameTitleOnDatePanel(newName);
			constructDates(groupIndex); // for when we go back, want to see the new name in the list
		}
	}
}

function editNote(detail) {
	$("form#noteDialog fieldset textarea#note").attr("value", detail.getNote());

    // Wire the ok button
    if (currNoteEditOkFunction != null) {
		$("form#noteDialog fieldset a#noteOkButton").unbind("click", currNoteEditOkFunction);
	}
	currNoteEditOkFunction = function() {
        var newNote = $("form#noteDialog fieldset textarea#note").val();
        detail.setNote(newNote);
    };
	$("form#noteDialog fieldset a#noteOkButton").click(currNoteEditOkFunction);

	iui.showPageById("noteDialog");
}
