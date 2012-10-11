
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
        $('#date').scroller({
            preset: 'date',
            theme: 'ios',
            display: 'inline',
            mode: 'scroller',
            dateOrder: 'D ddMyy',
			dateFormat: 'dd/mm/yy'
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
	
	inEditNameChanged = false;
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

DateDetail.prototype.setDateBLocked = function(newDateLocked) {
    this.dateBLocked = newDateLocked;
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
    setNameField(detail.getName());
    setDateInButton("#editDateA", "#lockAImg", detail.getDateA(), detail.isDateALocked());
	setDateInButton("#editDateB", "#lockBImg", detail.getDateB(), detail.isDateBLocked());
	
	// Wire delete event button
	$("div#datePanel a#deleteButton").off("click").on("click", 
	   function() {
	       deleteDate(groupIndex, detailIndex);
	   }
    );
	
	// Wire edit note button
	$("div.toolbar a#noteButton").off("click").on("click",
	   function() {
	   	   editNote(detail);
	   } 
	);
	
	// Wire edit name input handler
	$("div#datePanel fieldset div input#dateName").off("change").on("change",
	   function() {
	   	   onEditNameChanged(groupIndex, detailIndex);
	   } 
	);

    // Wire edit date A button
    $("div#datePanel fieldset div table tr td a#editDateA").off("click").on("click",
	   function() {
	   	   editDateA(detail); // inline this
	   } 
	);

    // Wire edit date B button
    $("div#datePanel fieldset div table tr td a#editDateB").off("click").on("click",
	   function() {
	   	   editDateB(detail); // inline this
	   } 
	);

    // Wire lock date A button
    $("div#datePanel a#toggleLockA").off("click").on("click",
       function() {
           toggleLockA(detail); // inline this
       } 
    );

    // Wire lock date B button
    $("div#datePanel a#toggleLockB").off("click").on("click",
       function() {
           toggleLockB(detail); // inline this
       } 
    );
	
	showNoteButton();
}

function setDateInButton(buttonSelector, lockSelector, dateStr, locked) {
	if (locked) {
        $(buttonSelector).html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Today&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		
        $(lockSelector).attr("src", "54-lock.png");
	} else {
	    var date = jQuery.scroller.parseDate("dd/mm/yy", dateStr);
	    var newDateLongStr = jQuery.scroller.formatDate("d M yy", date);
	    $(buttonSelector).html(newDateLongStr);

        $(lockSelector).attr("src", "54-lock-grey.png");
	}
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
	$("div#datePanel").attr("title", name); // this sets the title of the page when it is not active
	$("div h1#pageTitle").html(name); // need to explicitly set the toolbar title when page is active
	$("form#noteDialog h1").html(name) // remind user of name when editing note
}

function onEditNameChanged(groupIndex, detailIndex)
{
	// This function sets the name field back if it's bad, which triggers a
	// re-entrant call here - which can be ignored.
	if (inEditNameChanged) {
		return;
	}
	inEditNameChanged = true;
	var detail = getDetail(groupIndex, detailIndex);
	var newName = $("div#datePanel fieldset div input#dateName").val();
	if (newName.length == 0) {
		alert("The name cannot be empty");
		setNameField(detail.getName());
	} else {
		var duplicate = false;
		for (var grIndex = 0; !duplicate && grIndex < groupedDates.length; grIndex++) {
			var group = groupedDates[grIndex];
			for (var deIndex = 0; !duplicate && deIndex < group.length; deIndex++) {
				var thisDetail = group[deIndex];
				if (thisDetail != detail) {
					if (newName == thisDetail.getName()) {
						duplicate = true;
					}
				}
			}
		}
		if (duplicate) {
			alert("The name cannot be a duplicate of another entry");
			setNameField(detail.getName());
		} else {
			detail.setName(newName);
			setNameTitleOnDatePanel(newName);
			constructDates(groupIndex); // for when we go back, want to see the new name in the list
		}
	}
	inEditNameChanged = false;
}

function editNote(detail) {
	$("form#noteDialog fieldset textarea#note").attr("value", detail.getNote());

    // Wire the ok button
	$("form#noteDialog fieldset a#noteOkButton").off("click").on("click",
		function() {
	        var newNote = $("form#noteDialog fieldset textarea#note").val();
	        detail.setNote(newNote);
	    } 
	);

	iui.showPageById("noteDialog");
}

function computeDiff(detail) {
//    alert("compute diff");	
}

function editDateA(detail) {
	editDate(
	    "A",
		detail,
  	    detail.getDateA(),
	    function(newDateStr) {
	   	    detail.setDateA(newDateStr);
			detail.setDateALocked(false);
	    },
		"#editDateA",
		"#lockAImg"
	);
}

function editDateB(detail) {
    editDate(
	    "B",
		detail,
        detail.getDateB(),
        function(newDateStr) {
            detail.setDateB(newDateStr);
			detail.setDateBLocked(false);
        },
        "#editDateB",
		"#lockBImg"
    );
}

function editDate(aOrB, detail, startDateStr, setDateFn, buttonSelector, lockSelector) {
	$("form#dateDialog h1").html("Choose Date " + aOrB); 
	
    var date = jQuery.scroller.parseDate("dd/mm/yy", startDateStr);
    
    $('#date').scroller('setDate', date, false, null);

    // Wire the ok button
    $("form#dateDialog fieldset a#dateOkButton").off("click").on("click", 
        function() {
	        var newDate = $('#date').scroller('getDate');
	        var newDateStr = jQuery.scroller.formatDate("dd/mm/yy", newDate);
	        setDateFn(newDateStr);
	        setDateInButton(buttonSelector, lockSelector, newDateStr, false);
	        
            computeDiff(detail);
	    }
	);

    iui.showPageById("dateDialog");
}

function toggleLockA(detail) {
    toggleLock(
	    detail,
		detail.getDateA(),
        detail.isDateALocked(),
        function(newLockState) {
            detail.setDateALocked(newLockState);
        },
		"#editDateA",
        "#lockAImg"
    );
}

function toggleLockB(detail) {
    toggleLock(
	    detail,
		detail.getDateB(),
        detail.isDateBLocked(),
        function(newLockState) {
            detail.setDateBLocked(newLockState);
        },
        "#editDateB",
        "#lockBImg"
    );
}

function toggleLock(detail, startDateStr, startLockState, setLockStateFn, buttonSelector, lockSelector) {
    var todayDateStr = startDateStr == "" ? jQuery.scroller.formatDate("dd/mm/yy", new Date()) : startDateStr;
	setDateInButton(buttonSelector, lockSelector, todayDateStr, !startLockState);
	setLockStateFn(!startLockState);

    computeDiff(detail);
}
