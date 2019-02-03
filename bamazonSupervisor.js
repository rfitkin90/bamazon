var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var Table = require('cli-table');

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
    console.log("Displaying all departments...\n");
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        res.forEach(elem => {
            var elemData = [
                '  Department ID: ' + `${elem.department_id}`.green,
                'Department Name: ' + `${elem.department_name}`.yellow,
            ].join('\n');
            console.log(elemData + '\n');
        });
        menuPrompt(res);
    });
});

function menuPrompt(res) {
    // main prompt to ask the supervisor which action he wants to take
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "managerActions",
                choices: [
                    "View products sales by department",
                    "Create New department"
                ]
            }
        ])
        .then(answers => {
            if (answers.managerActions === "View products sales by department") {
                viewSalesByDept(res);
            } else if (answers.managerActions === "Create New department") {
                createNewDept();
            }
        });
    ;
}

function viewSalesByDept(res) {
    connection.query(`
        SELECT product_sales
        FROM products
        INNER JOIN departments
        ON products.department_name = departments.department_name;
        `, function (err, res) {
            if (err) throw err;
            console.log(res);
            // var salesTotal = 0;
            // res.forEach(elem => {
            //     salesTotal += elem.product_sales;
            // });
            // console.log(salesTotal);
        });
    ;
}
// SELECT *
// FROM Orders

// INNER JOIN Customers

// ON Orders.CustomerID=Customers.CustomerID;
function createNewDept() {

}


// 4. When a supervisor selects `View Product Sales by Department`, the app should display a summarized 
// table in their terminal/bash window. Use the table below as a guide.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// 5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` 
// and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

// 6. If you can't get the table to display properly after a few hours, then feel free to go back and 
// just add `total_profit` to the `departments` table.

//    * Hint: You may need to look into aliases in MySQL.

//    * Hint: You may need to look into GROUP BYs.

//    * Hint: You may need to look into JOINS.

//    * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)