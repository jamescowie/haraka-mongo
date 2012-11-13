exports.hook_queue = function (next, connection) {
    // MongoDB configuration settings.                                                                                                                             
    var databaseUrl = "localhost";
    var collections = ["email"];
    var db          = require("mongojs").connect(databaseUrl, collections);

    // basic logging so we can see if we have an email hitting the stack                                                                                           
    this.loginfo("New inbound email detected, inserting into mongodb");

    // setup of variable to save us typing the same string over and over.                                                                                          
    var transaction = connection.transaction;
    var receivedDate  = transaction.header.headers.date;
    var subjectLine   = transaction.header.headers.subject;

    // persist the data within mongo. TODO still needs to add in user ID from MySQL so its stored in there mailbox.                                                
    db.email.save({
		email:         transaction.mail_from,
		message:       transaction.data_lines,
		received:      receivedDate,
		subjectLine:   subjectLine
		});

    // passes control over to the next plugin within Haraka.                                                                                                       
    next();
}