var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

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
    menuPrompt();
});

function menuPrompt() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "managerActions",
                choices: [
                    "View products for sale",
                    "View low inventory",
                    "Add to inventory",
                    "Add new product"
                ]
            }
        ])
        .then(answers => {
            if (answers.managerActions === "View products for sale") {
                viewProducts();
            } else if (answers.managerActions === "View low inventory") {
                viewLowInventory();
            } else if (answers.managerActions === "Add to inventory") {
                addToInventory();
            }
        });
    ;
}

function viewProducts() {
    console.log("Displaying all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        res.forEach(elem => {
            var elemData = [
                '     Product ID: ' + `${elem.item_id}`.yellow,
                '           Name: ' + `${elem.product_name}`.green,
                '     Department: ' + `${elem.department_name}`.green,
                '          Price: ' + `$${elem.price}`.yellow,
                'Amount in stock: ' + `${elem.stock_quantity}`.yellow
            ].join('\n');
            console.log(elemData + '\n');
        });
        menuPrompt();
    });
}

function viewLowInventory() {
    console.log("Displaying products with inventories lower than 5000...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < ?", [5000], function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        res.forEach(elem => {
            var elemData = [
                '     Product ID: ' + `${elem.item_id}`.yellow,
                '           Name: ' + `${elem.product_name}`.green,
                '     Department: ' + `${elem.department_name}`.green,
                '          Price: ' + `$${elem.price}`.yellow,
                'Amount in stock: ' + `${elem.stock_quantity}`.yellow
            ].join('\n');
            console.log(elemData + '\n');
        });
        menuPrompt();
    });
}

function addToInventory() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the ID of the product you wish to restock.",
                name: "restock"
            }
        ])
        .then(answers => {
            console.log("Displaying all products...\n");
            connection.query("SELECT * FROM products WHERE item_id = ?", [answers.restock], function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                res.forEach(elem => {
                    var elemData = [
                        '     Product ID: ' + `${elem.item_id}`.yellow,
                        '           Name: ' + `${elem.product_name}`.green,
                        '     Department: ' + `${elem.department_name}`.green,
                        '          Price: ' + `$${elem.price}`.yellow,
                        'Amount in stock: ' + `${elem.stock_quantity}`.yellow
                    ].join('\n');
                    console.log(elemData + '\n');
                });
                menuPrompt();
            });
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: ".",
                        name: "restock"
                    }
                ])
                .then(answers => {

                });
            ;
        });
    ;
}

// function 
//   * If a manager selects `View Products for Sale`, the app should list every available item:
//   the item IDs, names, prices, and quantities.

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory 
//   count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the 
//   manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new 
//   product to the store.