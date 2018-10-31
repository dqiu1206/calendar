//global variables
var isCategory = false;
var loggedIn = false;
var currentMonth = new Month(2017, 9);
//add Event Listeners to all buttons
document.getElementById("login_btn").addEventListener("click", loginAjax, false);
document.getElementById("register_btn").addEventListener("click", registerAjax, false);
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false);
document.getElementById("addEvent").addEventListener("click", addEvent, false);
document.getElementById("editEvent").addEventListener("click", editEvent, false);
document.getElementById("deleteEvent").addEventListener("click", deleteEvent, false);
document.getElementById("select_category_btn").addEventListener("click",selectCat,false);
document.getElementById("deselect_category").addEventListener("click",unselectCat,false);
document.getElementById("myTable").addEventListener("click", showCreate,false);
document.getElementById("share_btn").addEventListener("click",shareWithUser,false);
document.addEventListener("DOMContentLoaded",logoutAjax,false);
document.addEventListener("DOMContentLoaded", updateCalendar, false);
document.getElementById("next_month_btn").addEventListener("click", function(){
    currentMonth = currentMonth.nextMonth();
    updateCalendar();
}, false);
document.getElementById("previous_month_btn").addEventListener("click", function(){
    currentMonth = currentMonth.prevMonth();
    updateCalendar();
}, false);
//Source: https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
function htmlEntities(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
//Login request, logs in user if username and password are valid
function loginAjax(event){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "login_ajax.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            alert("You've been Logged In!");
            document.getElementById("currentUser").innerHTML = "Logged In As: " + htmlEntities(username);
            document.getElementById("logged_out").style.display = "none";
            document.getElementById("logout_btn").style.display = "block";
            document.getElementById("addEventDiv").style.display = "none";
            document.getElementById("select_category").style.display = "block";
            document.getElementById("share_with_other").style.display = "block";
            document.getElementById("editToken").value = jsonData.token;
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            loggedIn = true;
            updateCalendar();
        }
        else{
            alert("You were not logged in.  "+jsonData.message);
        }
    }, false);
    xmlHttp.send(dataString);
}
//Sends request to register user. Succeeds if user does not already exist
function registerAjax(event){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // Make a URL-encoded string for passing POST data:
    var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "register_ajax.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
         alert("You've been registered!");
     }else{
         alert("You were not registered.  "+jsonData.message);
     }
 }, false);
    xmlHttp.send(dataString);
}
//Sends request to log out user
function logoutAjax(event){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "logout_ajax.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            document.getElementById("currentUser").innerHTML = "Not Logged In";
            document.getElementById("logged_out").style.display = "block";
            document.getElementById("logout_btn").style.display = "none";
            document.getElementById("addEventDiv").style.display = "none";
            document.getElementById("editEventDiv").style.display = "none";
            document.getElementById("select_category").style.display = "none";
            document.getElementById("share_with_other").style.display = "none";
            document.getElementById("editToken").value = "";
            //Clear forms
            document.getElementById("editStoryID").value = "";
            document.getElementById("editDate").value = "";
            document.getElementById("editTime").value = "";
            document.getElementById("editTitle").value = "";
            document.getElementById("editCategory").value = "";
            document.getElementById("select_category_input").value = "";
            document.getElementById("share_input").value = "";
            document.getElementById("editToken").value = "";
            loggedIn = false;
            updateCalendar();
        }
    }, false);
    xmlHttp.send("");
}
//Source: https://stackoverflow.com/questions/604167/how-can-we-access-the-value-of-a-radio-button-using-the-dom
//Checks if radio is checked
function getRadioValue(theRadioGroup){
    var elements = document.getElementsByName(theRadioGroup);
    for(var i=0;i<elements.length;i++){
        if(elements[i].checked){
            return elements[i].value;
        }
    }
}
//Sends request to add event. Alerts if succeeds or fails.
function addEvent(event){
    var title = document.getElementById("title").value;
    var time = document.getElementById("time").value;
    var date = document.getElementById("date").value;
    var category = document.getElementById("category").value;
    var group_event = getRadioValue("group_event");
    var dataString = "title=" + encodeURIComponent(title)+
    "&time=" + encodeURIComponent(time)+
    "&date=" + encodeURIComponent(date) +
    "&category=" + encodeURIComponent(category) +
    "&group_event=" + encodeURIComponent(group_event);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "add_event_ajax.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            document.getElementById("date").value = "";
            document.getElementById("time").value = "";
            document.getElementById("title").value = "";
            document.getElementById("category").value = "";
            document.getElementById("addEventDiv").style.display = "none";
            alert("Event added");
        }else{
            alert("Event not added: "+jsonData.message);
        }
    }, false);
    xmlHttp.send(dataString);
    updateCalendar();
}
//Sends request to update the event in the database. Alerts if succeeds or fails
function editEvent(event){
    var title = document.getElementById("editTitle").value;
    var time = document.getElementById("editTime").value;
    var date = document.getElementById("editDate").value;
    var category = document.getElementById("editCategory").value;
    var group_event = getRadioValue("edit_group_event");
    var id = document.getElementById("editStoryID").value;
    var token = document.getElementById("editToken").value;
    var dataString = "title=" + encodeURIComponent(title)+
    "&time=" + encodeURIComponent(time)+
    "&date=" + encodeURIComponent(date) +
    "&category=" + encodeURIComponent(category) +
    "&group_event=" + encodeURIComponent(group_event)+
    "&id=" + encodeURIComponent(id)+
    "&token=" + encodeURIComponent(token);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "edit_event_ajax.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            document.getElementById("editEventDiv").style.display = "none";
            document.getElementById("addEventDiv").style.display = "block";
            alert("Event edited");
        }else{
            alert("Edit unsuccessful: "+jsonData.message);
            document.getElementById("editEventDiv").style.display = "none";
            document.getElementById("addEventDiv").style.display = "block";
        }
    }, false);
    xmlHttp.send(dataString);
    updateCalendar();
}
//Sends request to delete the event from the database.
function deleteEvent(event){
    var id = document.getElementById("editStoryID").value;
    var token = document.getElementById("editToken").value;
    var dataString = "id=" + encodeURIComponent(id) + "&token=" + encodeURIComponent(token);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "delete_event_ajax.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            alert("Event deleted");
            document.getElementById("editEventDiv").style.display = "none";
            document.getElementById("addEventDiv").style.display = "block";
        }else{
            alert("Delete unsuccessful: " + jsonData.message);
            document.getElementById("editEventDiv").style.display = "none";
            document.getElementById("addEventDiv").style.display = "block";
        }
    }, false);
    xmlHttp.send(dataString);
    updateCalendar();
}
//inserts (user1,user2) into table if user1 wants to share with user2
function shareWithUser() {
    var user = document.getElementById("share_input").value;
    var dataString = "user=" + encodeURIComponent(user);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "insert_user.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            alert("Share success");
        }else{
            alert(jsonData.message);
        }
    }, false);
    xmlHttp.send(dataString);
    updateCalendar();
}
//Shows the Create Event form
function showCreate(){
    if (loggedIn){
        document.getElementById("addEventDiv").style.display = "block";
        document.getElementById("editEventDiv").style.display = "none";
    }
}
//Unselects category
function unselectCat(){
    isCategory=false;
    updateCalendar();
}
//selects category
function selectCat(){
    isCategory=true;
    updateCalendar();
}
//updates the Calendar with events that user should see
function updateCalendar(){
    document.getElementById("currentMonth").innerHTML = convertMonthToString(currentMonth.month) + ", " + currentMonth.year;
    var row="row";
    for (var k = 1; k < 7; k++) {
        row = "row" + k;
        document.getElementById(row).style.display = "none";
    }
    var weeks = currentMonth.getWeeks();
    var i = 1;
    var first=true;
    var start=false;
    for(var w in weeks){
        if(weeks.hasOwnProperty(w)){
            var days = weeks[w].getDates();
            for(var d in days){
                if(days.hasOwnProperty(d)){
                    document.getElementById("myTable").rows[i].cells[d].innerHTML = days[d].getDate();
                    //only show events for that month
                    if(first){
                        if(days[d].getDate()==1){
                            start=true;
                            first=false;
                        }
                    }
                    else{
                        if(days[d].getDate()==1){
                            start=false;
                        }
                    }
                    if(start){
                        //Loads global events and user events
                        getEvents(days[d].getDate(), Number(currentMonth.month)+1, currentMonth.year,i,d,isCategory);
                        //Loads events that are shared with user
                        getSharedEvents(days[d].getDate(), Number(currentMonth.month)+1, currentMonth.year,i,d,isCategory);
                    }
                }
            }
            var rows = "row" + i;
            console.log(rows);
            document.getElementById(rows).style.display = "table-row";
            i = i + 1;
        }
    }
}
//Sends request to get all events that are shared with user and creates button for each event
function getSharedEvents(day,month,year,row,col,category){
    var date = year + "-" + month + "-" + day;
    var dataString;
    if(category){
        var categoryInput = document.getElementById("select_category_input").value;
        dataString = "date=" + encodeURIComponent(date) + "&category=" + encodeURIComponent(categoryInput);
    }
    else{
        dataString = "date=" + encodeURIComponent(date);
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "share_with_user.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            for (var j in jsonData.title){
                if(jsonData.title.hasOwnProperty(j)){
                    var line_break = document.createElement("br");
                    var button = document.createElement("button");
                    var text = document.createTextNode(jsonData.title[j]);
                    button.appendChild(text);
                    button.className = "eventButton";
                    var dayCell = document.getElementById("myTable").rows[row].cells[col];
                    dayCell.appendChild(line_break);
                    dayCell.appendChild(button);
                    button.id = jsonData.id[j];
                    button.onclick = showEvent;
                }

            }
        }
    }, false);
    xmlHttp.send(dataString);
}
//Send request to get all global events as well as user events. Creates a button for each event
function getEvents(day, month, year, row, col,category){
    var date = year + "-" + month + "-" + day;
    var dataString;
    if(category){
        var categoryInput = document.getElementById("select_category_input").value;
        dataString = "date=" + encodeURIComponent(date) + "&category=" + encodeURIComponent(categoryInput);
    }
    else{
        dataString = "date=" + encodeURIComponent(date);
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "show_events_ajax.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            for (var j in jsonData.title){
                if(jsonData.title.hasOwnProperty(j)){


                    var line_break = document.createElement("br");
                    var button = document.createElement("button");
                    var text = document.createTextNode(jsonData.title[j]);
                    button.appendChild(text);
                    button.className = "eventButton";
                    var dayCell = document.getElementById("myTable").rows[row].cells[col];
                    dayCell.appendChild(line_break);
                    dayCell.appendChild(button);
                    button.id = jsonData.id[j];
                    button.onclick = showEvent;
                }
            }
        }
    }, false);
    xmlHttp.send(dataString);
}
//Sends request and pulls event details and places into the edit details form. Only allows user who created event to edit and delete the event
function showEvent() {
    var id = this.id;
    var dataString = "id=" + encodeURIComponent(id);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "show_event.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event){
        var jsonData = JSON.parse(event.target.responseText);
        if(jsonData.success){
            document.getElementById("addEventDiv").style.display = "none";
            document.getElementById("editEventDiv").style.display = "block";
            if (!jsonData.same_user) {
                document.getElementById("sameUserDiv").style.display = "none";
            } else {
                document.getElementById("sameUserDiv").style.display = "block";
            }
            document.getElementById("editDate").value = jsonData.date;
            document.getElementById("editTime").value = jsonData.time;
            document.getElementById("editTitle").value = jsonData.title;
            document.getElementById("editCategory").value = jsonData.category;
            document.getElementById("editStoryID").value = id;
            if(jsonData.group_event=="true"){
                document.getElementById("group_true").checked =true;
            }
            else{
                document.getElementById("group_false").checked =true;
            }
        }
    }, false);
    xmlHttp.send(dataString);
}
//helper function
function convertMonthToString(month){
    if (month === 0) {
        return "January";
    } else if (month == 1) {
        return "February";
    } else if (month == 2) {
        return "March";
    } else if (month == 3) {
        return "April";
    } else if (month == 4) {
        return "May";
    } else if (month == 5) {
        return "June";
    } else if (month == 6) {
        return "July";
    } else if (month == 7) {
        return "August";
    } else if (month == 8) {
        return "September";
    } else if (month == 9) {
        return "October";
    } else if (month == 10) {
        return "November";
    } else {
        return "December";
    }
}