
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
	// TODO define a better model with groupedDates being members of groups
	// rather than two separate arrays
    groups = [ 
	   "Birthdays", "CV Durations"
    ];
	groupedDates = [
	   /* Birthdays */ [ 
	       new DateDetail("Matt", "Matt's Note", "22/02/1969", "", false, true, true), 
		   new DateDetail("Bob", "Bob's note", "15/03/1986", "", false, true, false), 
		   new DateDetail("Steve", "Not born yet", "", "23/11/2015", true, false, true), 
		   new DateDetail("Kristin", "Lived in Sweden", "14/01/1987", "23/12/2004", false, false, false),  
		   new DateDetail("Today", "This is today", "", "", true, true, false),
	   ],
	   /* CV Durations */ [
	       new DateDetail("Known C", "", "01/01/1989", "", false, true, false),
		   new DateDetail("Known C++", "", "01/01/1991", "", false, true, true),
		   new DateDetail("Known Perl", "", "01/01/1993", "", false, true, true),
		   new DateDetail("Known UNIX", "", "01/01/1989", "", false, true, false), 
	   ],
	   // etc, etc
	];
	currGroup = 0; // TODO these can go
	currDetail = 0;	
	
	inEditNameChanged = false;
}

// -----------------------------------------------------------------------------

function DateDetail(name, note, dateA, dateB, dateALocked, dateBLocked, isFavourite) {
	this.name = name;
	this.note = note;
	this.dateA = dateA;
	this.dateB = dateB;
	this.dateALocked = dateALocked;
	this.dateBLocked = dateBLocked;
	this.isFav = isFavourite;
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

DateDetail.prototype.setIsFavourite = function(newIsFavourite) {
    this.isFav = newIsFavourite;
}

DateDetail.prototype.isFavourite = function() {
    return this.isFav;
}

// -----------------------------------------------------------------------------

function showGroups()
{
   	var newGrHtml = '<ul>' + 
	   groups.map(function(item, indx){
           return '<li><a href="#dates" onClick="showDates(' + indx + ')" >' + item + '</a></li>';
       }).join("") +
	   '</ul>'; 
	$("div#groups").find("ul").replaceWith(newGrHtml);
}

function newGroup()
{
   $("form#groupNameDialog fieldset textarea#name").attr("value", "");

    // Wire the ok button
    $("form#groupNameDialog fieldset a#groupNameOkButton").off("click").on("click",
        function() {
            var newName = $("form#groupNameDialog fieldset textarea#name").val();
		    if (newName.length == 0) {
		        alert("The name cannot be empty");
		    } else {
		        var duplicate = false;
		        for (var grIndex = 0; !duplicate && grIndex < groups.length; grIndex++) {
                    if (newName == groups[grIndex]) {
                        duplicate = true;
		            }
		        }
		        if (duplicate) {
		            alert("The name cannot be a duplicate of another group");
					// TODO: BUG: need to stop the dialog going away
		        } else {
					createGroup(newName);
					showGroups();
					iui.showPageById("groups");
		        }
		    }
        } 
    );

    iui.showPageById("groupNameDialog");
}

function createGroup(newName) 
{
    groups.push(newName);
	groupedDates.push([]);
	// TODO a better model where dates are elements of their group, then I can
	// do...
	// groups.sort()	
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
	constructDates(groupIndex);
    $("ul#dates").attr("title", groups[groupIndex]);
}

function constructDates(groupIndex)
{
    var newHtml = '<ul>' + 
       groupedDates[groupIndex].map(function(item, indx){
           return '<li><a href="#datePanel" onClick="showDate(' + groupIndex + ',' + indx + ')" >' + item.getName() + '</a></li>';
       }).join("") +
       '</ul>'; 
    $("div#dates").find("ul").replaceWith(newHtml);	
}

function showDate(groupIndex, detailIndex)
{
	currDetail = detailIndex;
	var detail = getDetail(groupIndex, detailIndex);
    setNameTitleOnDatePanel(detail.getName());
    setNameField(detail.getName());
    setDateInButton("#editDateA", "#lockAImg", detail.getDateA(), detail.isDateALocked());
	setDateInButton("#editDateB", "#lockBImg", detail.getDateB(), detail.isDateBLocked());
	setNoteIcon(detail.getNote());
	setFavIcon(detail.isFavourite());
	
	// Wire delete event button
	$("div#datePanel a#deleteButton").off("click").on("click", 
	   function() {
	       deleteDate(groupIndex, detailIndex);
	   }
    );
	
	// Wire edit note icon
    $("a#editNoteIcon").off("click").on("click",
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
}

function setNoteIcon(note) {
	if (note == "") {
		$("img#noteImg").attr("src", "14-tag.png");
	} else {
		$("img#noteImg").attr("src", "14-tag-blue.png");
	}
}

function setFavIcon(isFavourite) {
    if (isFavourite) {
        $("img#favImg").attr("src", "28-star-yellow.png");
    } else {
        $("img#favImg").attr("src", "28-star.png");
    }
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

function onShowDatePanel()
{
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
			setNoteIcon(newNote);
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
