
var groups = [];

function startup()
{
	initMobiscroller();
	loadData();
	drawGroups();
	drawFavourites();
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
	var grBday = new Group("Birthdays");
	grBday.addDetails([ 
           new DateDetail("Matt", "Matt's Note", "22/02/1969", "", false, true, true), 
           new DateDetail("Bob", "Bob's note", "15/03/1986", "", false, true, false), 
           new DateDetail("Steve", "Not born yet", "", "23/11/2015", true, false, true), 
           new DateDetail("Kristin", "Lived in Sweden", "14/01/1987", "23/12/2004", false, false, false),  
           new DateDetail("Today", "This is today", "", "", true, true, false),
       ]);
	var grCv = new Group("CV Durations");
	grCv.addDetails([
           new DateDetail("Known C", "", "01/01/1989", "", false, true, false),
           new DateDetail("Known C++", "", "01/01/1991", "", false, true, true),
           new DateDetail("Known Perl", "", "01/01/1993", "", false, true, true),
           new DateDetail("Known UNIX", "", "01/01/1989", "", false, true, false), 
       ]);
    groups = [ 
	   grBday, grCv
    ];
	
	inEditNameChanged = false;
}

// -----------------------------------------------------------------------------
function Group(name) {
	this.name = name;
	this.details = [];
}

Group.prototype.getName = function() {
	return this.name;
}

Group.prototype.setName = function(newName) {
    this.name = newName;
}

Group.prototype.getDetails = function() {
    return this.details;
}

Group.prototype.addDetail = function(newDetail) {
    this.details.push(newDetail);
	// TODO sort?
	return this.details.length - 1;
}

Group.prototype.addDetails = function(newDetails) {
	var groupDetails = this.details;
	newDetails.forEach(function(detail, index) {
	    groupDetails.push(detail);
	});
}

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

function DiffComputer(dateStrA, dateALocked, dateStrB, dateBLocked, todayFullDate) {
	this.todayDateStr = jQuery.scroller.formatDate("dd/mm/yy", todayFullDate || new Date());
	var usedDateAStr = dateALocked || dateStrA.length == 0 ? this.todayDateStr : dateStrA;
	var usedDateBStr = dateBLocked || dateStrB.length == 0 ? this.todayDateStr : dateStrB;
	var dateAComponents = this._dateStrToComponents(usedDateAStr);
	var dateBComponents = this._dateStrToComponents(usedDateBStr);
	
	var todayDateTime = this._dateStrToDate(this.todayDateStr).getTime();
	
    var dateATime = this._dateStrToDate(usedDateAStr).getTime();
	this.dateAInDaysSinceEpoch = this._msToDays(dateATime);
    var dateBTime = this._dateStrToDate(usedDateBStr).getTime();
	this.dateBInDaysSinceEpoch = this._msToDays(dateBTime);

    var daysInMonth = 0;
    if (this.dateAInDaysSinceEpoch > this.dateBInDaysSinceEpoch) {
		this.diffDays = dateAComponents[0] - dateBComponents[0];
		this.diffMonths = dateAComponents[1] - dateBComponents[1];
		this.diffYears = dateAComponents[2] - dateBComponents[2];
		daysInMonth = this._daysInMonth(dateBComponents[1], dateBComponents[2]);
	} else {
        this.diffDays = dateBComponents[0] - dateAComponents[0];
        this.diffMonths = dateBComponents[1] - dateAComponents[1];
		this.diffYears = dateBComponents[2] - dateAComponents[2];
		daysInMonth = this._daysInMonth(dateAComponents[1], dateAComponents[2]);
	}
	// ensure all differences are positive
	if (this.diffDays < 0) {
		this.diffMonths --;
		this.diffDays += daysInMonth;
	}
	if (this.diffMonths < 0) {
		this.diffYears --;
		this.diffMonths += 12;
	}	
	
	var diffMs = Math.abs(dateATime - dateBTime);
	this.diffTotalDays = this._msToDays(diffMs);
	
	if (dateATime == todayDateTime && dateBTime == todayDateTime) {
		this.indicator = '-';
	} else if (dateATime <= todayDateTime && dateBTime <= todayDateTime) {
		this.indicator = '<';
	} else if (dateATime >= todayDateTime && dateBTime >= todayDateTime) {
		this.indicator = '>';
	} else {
		this.indicator = '-';
	}
}

DiffComputer.prototype._msToDays = function(ms) {
    var diffS = ms / 1000;
    var diffM = diffS / 60;
    var diffH = diffM / 60;
    return diffH / 24;
}

DiffComputer.prototype._daysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate();
}

DiffComputer.prototype._dateStrToComponents = function(dateStr) {
    var dateR = new RegExp("^(\\d{2})/(\\d{2})/(\\d{4})$");
    var dateParts = dateR.exec(dateStr);
	return new Array(parseInt(dateParts[1], 10), parseInt(dateParts[2], 10), parseInt(dateParts[3], 10));
}

DiffComputer.prototype._dateStrToDate = function(dateStr) {
	var dateComponents = this._dateStrToComponents(dateStr);
    return new Date(Date.UTC(dateComponents[2], dateComponents[1] - 1, dateComponents[0], 0, 0, 0));
}

// today as a dateStr dd/mm/yyyy
DiffComputer.prototype._getToday = function() {
	return this.todayDateStr;
}

DiffComputer.prototype.getYears = function() {
	return this.diffYears;
}

DiffComputer.prototype.getMonths = function() {
    return this.diffMonths;
}

DiffComputer.prototype.getDays = function() {
    return this.diffDays;
}

DiffComputer.prototype.getTotalDays = function() {
    return this.diffTotalDays;
}

DiffComputer.prototype.getIndicator = function() {
    return this.indicator;
}

// -----------------------------------------------------------------------------

function drawFavourites() {
    var favs = [];

    groups.forEach(function(group, groupIndex){
        group.getDetails().forEach(function(detail, detailIndex){
            if (detail.isFavourite()) {
                favs.push('<li><a href="#datePanel" onClick="showDate(' + groupIndex + ',' + detailIndex + ')" >' + detail.getName() + '</a></li>');
            }
        });
    });
    
	if (favs.length == 0) {
		favs.push("<li><a href=\"#helpFav\">(No Favourites)</a></li>");
	}

    var newGrFavHtml = "<li id=\"groupsLi\"><a href=\"#groups\">Groups</a></li>" + favs.join("");
    $("div#home ul#groupsAndFavs").empty().append(newGrFavHtml);
}

function drawGroups()
{
    var newGrHtml = '<ul>' + 
        groups.map(function(group, indx){
            return '<li><a href="#dates" onClick="showDates(' + indx + ')" >' + group.getName() + '</a></li>';
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
                    if (newName == groups[grIndex].getName()) {
                        duplicate = true;
		            }
		        }
		        if (duplicate) {
		            alert("The name cannot be a duplicate of another group");
					// TODO: BUG: need to stop the dialog going away
		        } else {
					createGroup(newName);
					drawGroups();
		        }
		    }
        } 
    );

    iui.showPageById("groupNameDialog");
}

function newDate(groupIndex)
{
	var newDate = new DateDetail("", "", "", "", true, true, false);
	var newDateIndex = groups[groupIndex].addDetail(newDate);
	
	showDate(groupIndex, newDateIndex);
	
	// TODO: BUG should focus on name field, disable back until entered.
	
	iui.showPageById("datePanel");
}

function orderByName(a,b) {
	return a.getName().localeCompare(b.getName());
}

// TODO should be in the model?
function createGroup(newName) 
{
    groups.push(new Group(newName));
	groups.sort(orderByName);
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
	drawDates(groupIndex);
    $("ul#dates").attr("title", groups[groupIndex].getName());
	
    // Wire new event button
    $("div#dates a#newDateButton").off("click").on("click", 
       function() {
          newDate(groupIndex);
       }
    );
}

function drawDates(groupIndex)
{
    var newHtml = '<ul>' + 
       groups[groupIndex].getDetails().map(function(detail, indx){
           return '<li><a href="#datePanel" onClick="showDate(' + groupIndex + ',' + indx + ')" >' + detail.getName() + '</a></li>';
       }).join("") +
       '</ul>'; 
    $("div#dates").find("ul").replaceWith(newHtml);	
}

function showDate(groupIndex, detailIndex)
{
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
	
    // Wire toggle favourite icon
    $("a#toggleFavIcon").off("click").on("click",
       function() {
           toggleFavourite(detail);
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
	return groups[groupIndex].getDetails()[detailIndex];
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
		for (var grIndex = 0; !duplicate && grIndex < groups.length; grIndex++) {
			var details = groups[grIndex].getDetails();
			for (var deIndex = 0; !duplicate && deIndex < details.length; deIndex++) {
				var thisDetail = details[deIndex];
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
			drawDates(groupIndex); // for when we go back, want to see the new name in the list
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

function toggleFavourite(detail) {
	detail.setIsFavourite(!detail.isFavourite());
	setFavIcon(detail.isFavourite());
	drawFavourites();
}


function computeDiff(detail) {
    var comp = new DiffComputer(detail.getDateA(), detail.isDateALocked(), detail.getDateB(), detail.isDateBLocked());
    var y = comp.getYears();
	var m = comp.getMonths();
	var d = comp.getDays();
	var td = comp.getTotalDays();
	$("td#numYears").attr("value", y);
	$("td#numMonths").attr("value", m);
	$("td#numDays").attr("value", d);
	$("td#numTotalDays").attr("value", td);	
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
