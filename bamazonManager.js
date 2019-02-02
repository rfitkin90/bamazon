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
    // main prompt to ask the manager which action he wants to take
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
            } else if (answers.managerActions === "Add new product") {
                addNewProduct();
            }
        });
    ;
}

function viewProducts() {
    console.log("Displaying all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        logResponseElems(res);
        menuPrompt();
    });
}

function viewLowInventory() {
    console.log("Displaying products with inventories lower than 5000...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < ?", [5000], function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        logResponseElems(res);
        menuPrompt();
    });
}

function addToInventory() {
    // manager chooses the ID of the product he wishes to add to the inventory of
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the ID of the product you wish to restock.",
                name: "restockID"
            }
        ])
        .then(answers => {
            console.log("Displaying selected product...\n");
            connection.query("SELECT * FROM products WHERE item_id = ?", [answers.restockID], function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                logResponseElems(res);
                amountToAdd(answers.restockID, res[0].stock_quantity);
            });
        });
    ;
}

function amountToAdd(restockID, originalStock) {
    // the amount the manager chooses to add to an item if they decide to add to inventory
    inquirer
        .prompt([
            {
                type: "input",
                message: "How many would you like to add?",
                name: "restockAmount"
            }
        ])
        .then(answers => {
            var restockAmount = Number(answers.restockAmount);
            if (!restockAmount > 0) {
                console.log('Invalid entry. Please enter a number greater than 0'.red);
                amountToAdd(restockID, originalStock);
            } else {
                var newStockAmount = originalStock + Number(answers.restockAmount);
                updateRestock(newStockAmount, restockID);
            }
        });
    ;
}

function updateRestock(newStockAmount, restockID) {
    // update stock quantity in database
    connection.query(`UPDATE products
    SET stock_quantity = ?
    WHERE item_id = ?
    `, [newStockAmount, restockID], function (err) {
            if (err) throw err;
            console.log('Stock updated! New stock quantity is ' +
                `${newStockAmount}`.yellow + '.');
            menuPrompt();
        });
    ;
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter product name.",
                name: "productName",
            },
            {
                type: "input",
                message: "Enter product's department name.",
                name: "departmentName",
            },
            {
                type: "input",
                message: "Enter product's price.",
                name: "productPrice",
            },
            {
                type: "input",
                message: "Set initial stock quantity.",
                name: "stockQuantity",
            }
        ])
        .then(answers => {
            connection.query(`
                INSERT INTO products (product_name, department_name, price, stock_quantity) 
                VALUES (?, ?, ?, ?)
                `, [answers.productName, answers.departmentName,
                answers.productPrice, answers.stockQuantity], function (err) {
                    if (err) throw err;2
                    console.log('Product added!');
                    menuPrompt();
                });
            ;
        });
    ;
}

function logResponseElems(res) {
    // function that logs each element of any response
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
}