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
    readProducts();
});


function readProducts() {
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
            if (!(ID > 0 && ID <= res.length)) {
                // if user enters an invalid product ID, notify them and run the same prompt again
                console.log('Error: Invalid product ID.'.red);
                idPrompt(res);
            } else {
                // if user enters a valid ID, ask them the amount they wish to buy
                purchaseAmountPrompt(res, ID);
            }
        });
    ;
}

function purchaseAmountPrompt(res, ID) {
    var stockQuantity = res[ID - 1].stock_quantity;
    inquirer
        .prompt([
            {
                type: "input",
                message: 'How many would you like to buy? (' +
                    `${stockQuantity}`.yellow + ' currently in stock):',
                name: "purchaseAmount"
            }
        ])
        .then(answers => {
            var amount = Number(answers.purchaseAmount);
            // (!(ID > 0 && ID <= res.length))
            if (!(amount > 0)) {
                // if user enters a non-number or negative number, notify them and reprompt
                console.log('Error: Invalid entry. Please enter a number greater than 0.'.red);
                purchaseAmountPrompt(res, ID);
            } else if (amount > stockQuantity) {
                // if they try to purchase more than what's in stock
                console.log('Sorry, we only have ' + `${stockQuantity}`.yellow +
                    ' in stock. Please enter a lower number.');
                purchaseAmountPrompt(res, ID);
            } else {
                // ask them to confirm their purchase
                confirmPurchase(res, ID, stockQuantity, amount);
            }
        });
    ;
}

function confirmPurchase(res, ID, stockQuantity, amount) {
    var productName = res[ID - 1].product_name;
    var individualPrice = res[ID - 1].price;
    var totalPrice = individualPrice * amount;
    var originalSales = res[ID - 1].product_sales;
    inquirer
        .prompt([
            {
                type: "confirm",
                message: 'Purchase ' + `${amount} `.yellow + `${productName} `.green +
                    'for ' + `$${totalPrice}`.yellow + '?',
                name: "confirmPurchase"
            }
        ])
        .then(answers => {
            if (answers.confirmPurchase) {
                // update the stock quantity in the database if they confirm purchase
                updateProduct(res, ID, stockQuantity, amount, originalSales, totalPrice);
                console.log(`${amount} `.yellow + `${productName} `.green +
                    'purchased for ' + `$${totalPrice}`.yellow + '!');
                // ask them if they want to continue shopping
                reShop(res);
            } else {
                // if they don't confirm, ask them if they want to buy another product
                reShop(res);
            }
        });
    ;
}

function updateProduct(ID, stockQuantity, amount, originalSales, totalPrice) {
    var newStock = stockQuantity - amount;
    var newSales = originalSales + totalPrice;
    // update stock quantity in database
    connection.query(`UPDATE products
    SET stock_quantity = ?
    product_price = ?
    WHERE item_id = ?
    `, [newStock, newSales, ID], function (err, res) {
            if (err) throw err;
        });
    ;
}

function reShop(res) {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Continue shopping?",
                name: "reShop"
            }
        ])
        .then(answers => {
            if (answers.reShop) {
                idPrompt(res);
            } else {
                console.log('Thank you for shopping.');
            }
        });
    ;
}