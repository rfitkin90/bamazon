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
        idPrompt(res);


    });
}

function idPrompt(res) {
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
                idPrompt(res);
            } else {
                // if user enters a valid ID, ask them the amount they wish to buy
                purchaseAmountPrompt(res, ID);
            }
        });
    ;
}

function purchaseAmountPrompt(res, ID) {
    inquirer
        .prompt([
            {
                type: "input",
                message: `How many would you like to buy? (${res[ID - 1].stock_quantity} currently in stock)`,
                name: "purchaseAmount"
            }
        ])
        .then(answers => {
            var amount = Number(answers.purchaseAmount);
            if (typeof amount !== 'number' || amount < 1) {
                // if user enters a non-number or negative number, notify them and reprompt
                console.log('Invalid entry. Please enter a number greater than 0.');
                purchaseAmountPrompt(ID);
            } else if (amount > res[ID - 1].stock_quantity) {
                console.log(`Sorry, we only have ${amount} in stock. Please enter a lower number.`);
                purchaseAmountPrompt(ID);
            } else {
                updateProduct(ID, res[ID - 1].stock_quantity, amount);
            }
        });
    ;
}

// don't forget to pass the other item info as paramters to log them
function updateProduct(ID, stockQuant, amount) {
    connection.query(`UPDATE products
    SET stock_quantity = ?
    WHERE item_id = ?
    `, [stockQuant - amount, ID], function (err, res) {
            if (err) throw err;
            // console.log(res);
            console.log('')
        });
    ;


}