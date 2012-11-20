
var groups = [];

function startup()
{
    inEditNameChanged = false;

	initMobiscroller();
	loadData();
	drawGroups();
	drawFavourites();
	wireGlobalHandlers();
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
			dateFormat: 'dd/mm/yy',
			endYear: new Date().getFullYear() + 100
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
           new DateDetail("Today", "This is today", "", "", true, true, false)
       ]);
	var grCv = new Group("CV Durations");
	grCv.addDetails([
           new DateDetail("Known C", "", "01/01/1989", "", false, true, false),
           new DateDetail("Known C++", "", "01/01/1991", "", false, true, true),
           new DateDetail("Known Perl", "", "01/01/1993", "", false, true, true),
           new DateDetail("Known UNIX", "", "01/01/1989", "", false, true, false) 
       ]);
    groups = [ 
       grBday, grCv
    ];
}

// -----------------------------------------------------------------------------

function storageSaveGroups() {
	
}

function storageLoadGroups() {
    
}

// -----------------------------------------------------------------------------

function deleteAll() {
	groups = [];
    storageSaveGroups();    
}

function getDetail(groupIndex, detailIndex) {
    return groups[groupIndex].getDetails()[detailIndex];
}

function deleteDetail(groupIndex, detailIndex) {
	getGroup(groupIndex).getDetails().splice(detailIndex, 1);
    storageSaveGroups();	
}

function getGroup(groupIndex) {
	return groups[groupIndex];
}

function createGroup(newName) {
    groups.push(new Group(newName));
    groups.sort(orderByName);
	storageSaveGroups();
}

function deleteGroup(groupIndex) {
    groups.splice(groupIndex, 1);
	storageSaveGroups();
}


function Group(name) {
	this.name = name;
	this.details = [];
}

Group.prototype.getName = function() {
	return this.name;
};

Group.prototype.setName = function(newName) {
    this.name = newName;
	storageSaveGroups();
};

Group.prototype.getDetails = function() {
    return this.details;
};

Group.prototype.addDetail = function(newDetail) {
    this.details.push(newDetail);
	storageSaveGroups();
	return this.details.length - 1;
};

Group.prototype.addDetails = function(newDetails) {
	var groupDetails = this.details;
	newDetails.forEach(function(detail, index) {
        groupDetails.push(detail);
	});
	storageSaveGroups();
};

Group.prototype.numDetails = function() {
	return this.details.length;
};

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
	storageSaveGroups();
};

DateDetail.prototype.getName = function() {
    return this.name;
};

DateDetail.prototype.setNote = function(newNote) {
    this.note = newNote;
	storageSaveGroups();
};

DateDetail.prototype.getNote = function() {
    return this.note;
};

DateDetail.prototype.hasNote = function() {
    return this.note !== "";
};

DateDetail.prototype.setDateA = function(newDate) {
    this.dateA = newDate;
	storageSaveGroups();
};

DateDetail.prototype.getDateA = function() {
    return this.dateA;
};

DateDetail.prototype.setDateB = function(newDate) {
    this.dateB = newDate;
	storageSaveGroups();
};

DateDetail.prototype.getDateB = function() {
    return this.dateB;
};

DateDetail.prototype.setDateALocked = function(newDateLocked) {
    this.dateALocked = newDateLocked;
	storageSaveGroups();
};

DateDetail.prototype.isDateALocked = function() {
    return this.dateALocked;
};

DateDetail.prototype.setDateBLocked = function(newDateLocked) {
    this.dateBLocked = newDateLocked;
	storageSaveGroups();
};

DateDetail.prototype.isDateBLocked = function() {
    return this.dateBLocked;
};

DateDetail.prototype.setIsFavourite = function(newIsFavourite) {
    this.isFav = newIsFavourite;
	storageSaveGroups();
};

DateDetail.prototype.isFavourite = function() {
    return this.isFav;
};

// -----------------------------------------------------------------------------

function DiffComputer(dateStrA, dateALocked, dateStrB, dateBLocked, todayFullDate) {
	this.todayDateStr = jQuery.scroller.formatDate("dd/mm/yy", todayFullDate || new Date());
	var usedDateAStr = dateALocked || dateStrA.length === 0 ? this.todayDateStr : dateStrA;
	var usedDateBStr = dateBLocked || dateStrB.length === 0 ? this.todayDateStr : dateStrB;
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
};

DiffComputer.prototype._daysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate();
};

DiffComputer.prototype._dateStrToComponents = function(dateStr) {
    var dateR = new RegExp("^(\\d{2})/(\\d{2})/(\\d{4})$");
    var dateParts = dateR.exec(dateStr);
	return new Array(parseInt(dateParts[1], 10), parseInt(dateParts[2], 10), parseInt(dateParts[3], 10));
};

DiffComputer.prototype._dateStrToDate = function(dateStr) {
	var dateComponents = this._dateStrToComponents(dateStr);
    return new Date(Date.UTC(dateComponents[2], dateComponents[1] - 1, dateComponents[0], 0, 0, 0));
};

// today as a dateStr dd/mm/yyyy
DiffComputer.prototype._getToday = function() {
	return this.todayDateStr;
};

DiffComputer.prototype.getYears = function() {
	return this.diffYears;
};

DiffComputer.prototype.getMonths = function() {
    return this.diffMonths;
};

DiffComputer.prototype.getDays = function() {
    return this.diffDays;
};

DiffComputer.prototype.getTotalDays = function() {
    return this.diffTotalDays;
};

DiffComputer.prototype.getIndicator = function() {
    return this.indicator;
};

// -----------------------------------------------------------------------------

function setTitle(text) {
	$("h1#pageTitle").empty().append(text);
}

function disableBack() {
    $("a#backButton").hide("slow");
}

function enableBack() {
    $("a#backButton").show("slow");
}

// -----------------------------------------------------------------------------

function wireGlobalHandlers() {
   $("a#deleteAllDataButton").off("click").on("click", 
        function() {
            confirmDeleteAll();
        }
    );
}

function confirmDeleteAll() {
    if (confirm("Are you sure you want to delete all data?")) {
        deleteAll();
        //
        drawGroups();
        drawFavourites();
        iui.showPageById("storage");
    }
}

function inlineFavIcon(detail) {
    return detail.isFavourite() ? ' &nbsp;&nbsp; <img style="position: relative; top: -2px;" src="28-star-yellow.png">' : ''; 
}

function inlineNoteIcon(detail) {
    return detail.hasNote() ? ' &nbsp;&nbsp; <img src="14-tag-blue.png">' : ''; 
}

function drawFavourites() {
    var favs = [];

    groups.forEach(function(group, groupIndex){
        group.getDetails().forEach(function(detail, detailIndex){
            if (detail.isFavourite()) {
                var noteIcon = inlineNoteIcon(detail); 
                var favIcon = inlineFavIcon(detail); 
                var detailString = detailSummary(detail);
                var txt = "</br><h5>" + detailString + "</h5>"; 
                favs.push('<li><a href="#datePanel" onClick="showDate(' + groupIndex + ',' + detailIndex + ')" >' + detail.getName() + favIcon + noteIcon + txt + '</a></li>');
            }
        });
    });
    
	if (favs.length === 0) {
		favs.push("<li><a href=\"#helpFav\">(No Favourites)</a></li>");
	}

    var newGrFavHtml = "<li id=\"groupsLi\"><a href=\"#groups\">Groups</a></li>" + favs.join("");
    $("div#home ul#groupsAndFavs").empty().append(newGrFavHtml);
}

// -----------------------------------------------------------------------------

function drawGroups() {
    var newGrHtml = "";

    if (groups.length === 0) {
        newGrHtml = "<li><a href=\"#helpGroups\">(No Groups)</a></li>";
    } else {
        newGrHtml = groups.map(function(group, indx){
            return '<li><a href="#dates" onClick="showDates(' + indx + ')" >' + group.getName() + '</a></li>';
        }).join(""); 
	}
	
    $("div#groups").find("ul").replaceWith("<ul>" + newGrHtml + "</ul>");
}

function setGroupNameField(name) {
	$("form#groupNameDialog fieldset textarea#name").attr("value", name);
} 

function newGroup() {
    setGroupNameField("");

    // Wire the ok button
    $("form#groupNameDialog fieldset a#groupNameOkButton").off("click").on("click",
        function() {
            var newName = $("form#groupNameDialog fieldset textarea#name").val();
            if (newName.length === 0) {
                alert("The name cannot be empty");
            } else {
                var duplicate = false;
                for (var grIndex = 0; !duplicate && grIndex < groups.length; grIndex++) {
                    if (newName == getGroup(grIndex).getName()) {
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

function renameGroup(groupIndex, doneFn) {
	var origName = getGroup(groupIndex).getName();
    setGroupNameField(origName);

    // Wire the ok button
    $("form#groupNameDialog fieldset a#groupNameOkButton").off("click").on("click",
        function() {
            var newName = $("form#groupNameDialog fieldset textarea#name").val();
            if (newName.length === 0) {
                alert("The name cannot be empty");
				setGroupNameField(origName);
            } else {
                var duplicate = false;
                for (var grIndex = 0; !duplicate && grIndex < groups.length; grIndex++) {
                    if (newName == getGroup(grIndex).getName()) {
                        duplicate = true;
                    }
                }
                if (duplicate) {
                    alert("The name cannot be a duplicate of another group");
					setGroupNameField(origName);
                    // TODO: BUG: need to stop the dialog going away
                } else {
					getGroup(groupIndex).setName(newName);
					drawGroupNameInDatesPage(groupIndex);
					doneFn();
                }
            }
        } 
    );

    iui.showPageById("groupNameDialog");
}

function newDate(groupIndex) {
	var newDateDetail = new DateDetail("", "", "", "", true, true, false);
	var newDateIndex = getGroup(groupIndex).addDetail(newDateDetail);
	
	showDate(groupIndex, newDateIndex);

	iui.showPageById("datePanel");
    setTitle("Name?");
	disableBack();
}

function orderByName(a,b) {
	return a.getName().localeCompare(b.getName());
}

function confirmDeleteGroup(groupIndex) {
	var prompt = "";
	var num = getGroup(groupIndex).numDetails();
	if (num > 0) {
		prompt = (num == 1 ? "There is 1 event" : "There are " + num + " events") +
            " in the group '" + getGroup(groupIndex).getName() + "'. "; 
	}
	prompt += "Are you sure you want to delete this group?";
	if (confirm(prompt)) {
		deleteGroup(groupIndex);
		//
		drawGroups();
		drawFavourites();
		iui.showPageById("groups");
	}
}

function confirmDeleteDate(groupIndex, dateIndex) {
    if (confirm("Are you sure you want to delete this event?")) {
		deleteDetail(groupIndex, dateIndex);
		showDates(groupIndex);
		drawFavourites();
        iui.showPageById("dates");
	} 
}

function drawGroupNameInDatesPage(groupIndex) {
	var name = getGroup(groupIndex).getName();
    $("div#dates").attr("title", name);
	// if the dates page is shown already, the pageTitle has been set, and
	// I don't know how to refresh it other than...
	setTitle(name);
}

function showDates(groupIndex) {
	drawDates(groupIndex);
	drawGroupNameInDatesPage(groupIndex);
	
    // Wire new event button
    $("div#dates a#newDateButton").off("click").on("click", 
       function() {
          newDate(groupIndex);
       }
    );
    // Wire delete group button
    $("div#dates a#deleteGroupButton").off("click").on("click", 
       function() {
          confirmDeleteGroup(groupIndex);
       }
    );
    // Wire rename group button
    $("div#dates a#renameGroupButton").off("click").on("click", 
       function() {
          renameGroup(groupIndex, 
              function() {
                  groups.sort(orderByName);
                  drawGroups();
              }
          );
       }
    );
}

function drawDates(groupIndex) {
    var groupDetails = getGroup(groupIndex).getDetails();
    var newHtml = "";
    if (groupDetails.length === 0) {
		newHtml = "<li><a href=\"#helpEvents\">(No Events)</a></li>";
	}
	else {
		newHtml = groupDetails.map(function(detail, indx){
            var noteIcon = inlineNoteIcon(detail); 
            var favIcon = inlineFavIcon(detail);
			var detailString = detailSummary(detail);
			var txt = "</br><h5>" + detailString + "</h5>"; 
			return '<li><a href="#datePanel" onClick="showDate(' + groupIndex + ',' + indx + ')" >' + detail.getName() + favIcon + noteIcon + txt + '</a></li>';
		}).join("");
	}
    $("div#dates").find("ul").replaceWith("<ul>" + newHtml + "</ul>");	
}

function showDate(groupIndex, detailIndex) {
	var detail = getDetail(groupIndex, detailIndex);
    setNameTitleOnDatePanel(detail.getName());
    setNameField(detail.getName());
	computeDiff(detail);
    setDateInButton("#editDateA", "#lockAImg", detail.getDateA(), detail.isDateALocked());
	setDateInButton("#editDateB", "#lockBImg", detail.getDateB(), detail.isDateBLocked());
	setNoteIcon(detail.getNote());
	setFavIcon(detail.isFavourite());
	
	var refreshFn = function() {
        drawDates(groupIndex);
        drawFavourites();
    };

	// Wire delete event button
	$("div#datePanel a#deleteEventButton").off("click").on("click", 
        function() {
            confirmDeleteDate(groupIndex, detailIndex);
        }
    );
	
	// Wire edit note icon
    $("a#editNoteIcon").off("click").on("click",
        function() {
            editNote(detail, refreshFn);
        } 
    );
	
    // Wire toggle favourite icon
    $("a#toggleFavIcon").off("click").on("click",
        function() {
            toggleFavourite(detail, refreshFn);
        } 
    );

	// Wire edit name input handler
	$("div#datePanel fieldset div input#dateName").off("change").on("change",
        function() {
            onEditNameChanged(groupIndex, detailIndex, 
				function(newName) {
                    getGroup(groupIndex).getDetails().sort(orderByName);
                    drawDates(groupIndex); // for when we go back, want to see the new name in the list
                    enableBack();
				});
        } 
	);

    // Wire edit date A button
    $("div#datePanel fieldset div table tr td a#editDateA").off("click").on("click",
        function() {
            editDate("A", detail, detail.getDateA(), function(newDateStr){
                detail.setDateA(newDateStr);
                detail.setDateALocked(false);
            }, refreshFn, "#editDateA", "#lockAImg");
        } 
	);

    // Wire edit date B button
    $("div#datePanel fieldset div table tr td a#editDateB").off("click").on("click",
        function() {
            editDate("B", detail, detail.getDateB(), function(newDateStr){
                detail.setDateB(newDateStr);
                detail.setDateBLocked(false);
            }, refreshFn, "#editDateB", "#lockBImg");
		}
	);

    // Wire lock date A button
    $("div#datePanel a#toggleLockA").off("click").on("click",
        function() {
            toggleLock(detail, detail.getDateA(), detail.isDateALocked(), function(newLockState){
                detail.setDateALocked(newLockState);
            }, refreshFn, "#editDateA", "#lockAImg");
        } 
    );

    // Wire lock date B button
    $("div#datePanel a#toggleLockB").off("click").on("click",
        function() {
            toggleLock(detail, detail.getDateB(), detail.isDateBLocked(), function(newLockState){
                detail.setDateBLocked(newLockState);
            }, refreshFn, "#editDateB", "#lockBImg");
        } 
    );
	
	enableBack();
}

function setNoteIcon(note) {
	if (note === "") {
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

function setNameField(name) {
   $("div#datePanel fieldset div input#dateName").attr("value", name);
}

function setNameTitleOnDatePanel(name) {
	$("div#datePanel").attr("title", name); // this sets the title of the page when it is not active
	$("div h1#pageTitle").html(name); // need to explicitly set the toolbar title when page is active
	$("form#noteDialog h1").html(name); // remind user of name when editing note
}

function onEditNameChanged(groupIndex, detailIndex, doneFn) {
	// This function sets the name field back if it's bad, which triggers a
	// re-entrant call here - which can be ignored.
	if (inEditNameChanged) {
		return;
	}
	inEditNameChanged = true;
	var detail = getDetail(groupIndex, detailIndex);
	var newName = $("div#datePanel fieldset div input#dateName").val();
	if (newName.length === 0) {
		alert("The name cannot be empty");
		setNameField(detail.getName());
	} else {
		var duplicate = false;
		for (var grIndex = 0; !duplicate && grIndex < groups.length; grIndex++) {
			var details = getGroup(grIndex).getDetails();
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
			doneFn();
		}
	}
	inEditNameChanged = false;
}

function editNote(detail, doneFn) {
	$("form#noteDialog fieldset textarea#note").attr("value", detail.getNote());

    // Wire the ok button
	$("form#noteDialog fieldset a#noteOkButton").off("click").on("click",
		function() {
            var newNote = $("form#noteDialog fieldset textarea#note").val();
            detail.setNote(newNote);
			setNoteIcon(newNote);
			doneFn();
        } 
	);

	iui.showPageById("noteDialog");
}

function toggleFavourite(detail, doneFn) {
	detail.setIsFavourite(!detail.isFavourite());
	setFavIcon(detail.isFavourite());
	doneFn();
}

function detailSummary(detail) {
	var comp = new DiffComputer(detail.getDateA(), detail.isDateALocked(), detail.getDateB(), detail.isDateBLocked());
    var y = comp.getYears();
    var m = comp.getMonths();
    var d = comp.getDays();
    var td = comp.getTotalDays();
    var details = [pluralise(y, "year"), pluralise(m, "month"), pluralise(d, "day"), pluralise(td, "total day")];
    return jQuery.grep(details, function(elem, indx) { return elem !== ""; }).join(", ");
}

function pluralise(num, noun) {
    if (num === 0) {
        return "";
    } else {
        if (num == 1) {
            return "" + num + " " + noun;
        } else {
            return "" + num + " " + noun + "s";
        }
    }
}

function computeDiff(detail) {
    var comp = new DiffComputer(detail.getDateA(), detail.isDateALocked(), detail.getDateB(), detail.isDateBLocked());
    var y = comp.getYears();
	var m = comp.getMonths();
	var d = comp.getDays();
	var td = comp.getTotalDays();
	$("td#numYears").html(y);
	$("td#numMonths").html(m);
	$("td#numDays").html(d);
	$("th#numTotalDays").html(td);	
}


function editDate(aOrB, detail, startDateStr, setDateFn, drawGroupFn, buttonSelector, lockSelector) {
	$("form#dateDialog h1").html("Choose Date " + aOrB); 
	
    var date = jQuery.scroller.parseDate("dd/mm/yy", startDateStr);
    
    $('#date').scroller('setDate', date, false, null);

    // Wire the ok button
    $("form#dateDialog fieldset a#dateOkButton").off("click").on("click", 
        function() {
            var newDate = $('#date').scroller('getDate');
            var newDateStr = jQuery.scroller.formatDate("dd/mm/yy", newDate);
            setDateFn(newDateStr);
			drawFavourites();
			drawGroupFn();
            setDateInButton(buttonSelector, lockSelector, newDateStr, false);

            computeDiff(detail);
        }
	);

    iui.showPageById("dateDialog");
}

function toggleLock(detail, startDateStr, startLockState, setLockStateFn, drawGroupFn, buttonSelector, lockSelector) {
    var todayDateStr = startDateStr === "" ? jQuery.scroller.formatDate("dd/mm/yy", new Date()) : startDateStr;
	setDateInButton(buttonSelector, lockSelector, todayDateStr, !startLockState);
	setLockStateFn(!startLockState);
	drawGroupFn();

    computeDiff(detail);
}
