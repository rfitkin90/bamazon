var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    readProducts();
});


function readProducts() {
    console.log("Displaying all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        // prompt user for product ID
        idPrompt();


    });
}

function idPrompt() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter the ID of the product you wish to buy.",
                name: "ID"
            }
        ])
        .then(answers => {
            var ID = Number(answers.ID)
            if (!(ID > 0 || ID <= res.length)) {
                // if user enters an invalid product ID, notify them and run the same prompt again
                console.log('Invalid product ID.');
                idPrompt();
            } else {
                // if user enters a valid ID, ask them the amount they wish to buy
                purchaseAmountPrompt(ID);
            }
        });
    ;
}

function purchaseAmountPrompt(ID) {
    inquirer
        .prompt([
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "purchaseAmount"
            }
        ])
        .then(answers => {
            var amount = Number(answers.purchaseAmount);
            if (typeof amount !== 'number' || amount < 1) {
                // if user enters a non-number or negative number, notify them and reprompt
                console.log('Invalid entry. Please enter a number greater than 0.');
                purchaseAmountPrompt(ID);
            }
        });
    ;
}