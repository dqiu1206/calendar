### General Info ###

* Link to calendar: http://ec2-3-16-29-241.us-east-2.compute.amazonaws.com/~david.qiu/homepage.html
* Currently, there are no registered users or events.
* Users can register/login/logout
* Once logged in, users can create events by clicking anywhere on the the calendar
* Users can edit/delete their own events by clicking on it on the calendar
* Creative Portion: 
	* Group Events: users can create group events for everybody to see. Only Users who created the event can edit/delete it.  
	* Share Calendar: users can share calendar with other users, but other user cannot edit/delete the event.  
	* Category: Users can type in a category and only events with that category will show up on the calendar
* JSHint: ajax.js passes JSHint with one "error" because helper function is in calendar.js (which is compressed and does not pass JSHint)


### Database Setup ###
Events:
event_id unsigned int not null auto_increment
username varchar(50) not null
title varchar(30) not null
date date not null
time varchar(20) not null
category varchar(30) not null
group_event enum('true','false') not null
primary key: event_id
foreign key: username ref users(username)

Users:
username varchar(50) not null
hashed_pass mediumtext not null
primary key(username)

Share:
id mediumint auto_increment not null
sharing_user varchar(50) not null
target_user varchar(50) not null
primary key(id)
