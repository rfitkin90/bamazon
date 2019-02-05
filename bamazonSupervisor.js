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

var overheadArr = [];

connection.connect(function (err) {
   if (err) throw err;
   console.log(`connected as id ${connection.threadId}\n`);
   console.log("Displaying all departments...\n");
   connection.query("SELECT * FROM departments", function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      res.forEach(elem => {
         var elemData = [
            '  Department ID: ' + `${elem.department_id}`.yellow,
            'Department Name: ' + `${elem.department_name}`.green
         ].join('\n');
         console.log(elemData + '\n');
      });
      res.forEach(elem => { overheadArr.push(elem.overhead_costs) });
      menuPrompt();
   });
});

function menuPrompt() {
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
            viewSalesByDept();
         } else if (answers.managerActions === "Create New department") {
            createNewDept();
         }
      });
   ;
}

function viewSalesByDept() {
   connection.query(`
      SELECT *
      FROM products
      `, function (err, res) {
         if (err) throw err;
         // create 2dimensional array for department names/sales
         var deptNamesArr = [];
         var deptSalesArr = [];
         // for each response elem...
         res.forEach(elem => {
            // assign department name to variable
            var deptName = elem.department_name;
            // assign department name's index in department name array to variable
            var deptIndex = deptNamesArr.indexOf(deptName);
            // if that name isn't in the department name array...
            if (deptIndex === -1) {
               // push it in...
               deptNamesArr.push(deptName);
               // and reset the value of the deptIndex variable
               deptIndex = deptNamesArr.indexOf(deptName);
            }
            // if the names array just had something pushed into it...
            if (deptNamesArr.length > deptSalesArr.length) {
               // push product sales to sales array so they line up...
               deptSalesArr.push(elem.product_sales);
            } else {
               // otherwise, add the product sales to its department's total sales
               deptSalesArr[deptIndex] += elem.product_sales;
            }
         });

         // create table
         // create arrays to store table data for data not already stored in arrays
         var deptIdArr = [];
         for (var i = 0; i < deptNamesArr.length; i++) {
            var ID = String(i + 1);
            if (ID.length = 1) ID = '0' + ID;
            deptIdArr.push(ID);
         }
         var deptProfitArr = [];
         for (var i = 0; i < deptSalesArr.length; i++) {
            var deptSales = deptSalesArr[i] - overheadArr[i];
            deptProfitArr.push(deptSales);
         }
         var keysArr = [
            'Department ID', 'Department Name', 'Product Sales', 'Overhead Costs', 'Total Profit'
         ];
         var dividerArr = [];
         for (var i = 0; i < keysArr.length; i++) {
            dividerArr.push('---------------');
         }
         // create arrays to store strings of table data with appropriate amount of whitespace
         var tableIdArr = [];
         var tableDividerArr = [];
         var tableNamesArr = [];
         var tableSalesArr = [];
         var tableOverheadArr = [];
         var tableProfitArr = [];
         var tableKeysArr = [];
         // populate the table arrays
         populateTableArr(keysArr, tableKeysArr);
         populateTableArr(dividerArr, tableDividerArr);
         populateTableArr(deptIdArr, tableIdArr);
         populateTableArr(deptNamesArr, tableNamesArr);
         populateTableArr(deptSalesArr, tableSalesArr);
         populateTableArr(overheadArr, tableOverheadArr);
         populateTableArr(deptProfitArr, tableProfitArr);
         // draw table to console
         console.log('\n');
         console.log('|' + tableKeysArr[0] + tableKeysArr[1] +
            tableKeysArr[2] + tableKeysArr[3] + tableKeysArr[4]
         );
         console.log('|' + tableDividerArr[0] + tableDividerArr[1] +
            tableDividerArr[2] + tableDividerArr[3] + tableDividerArr[4]
         );
         for (var i = 0; i < tableIdArr.length; i++) {
            console.log(
               '|' +
               tableIdArr[i] +
               tableNamesArr[i] +
               tableSalesArr[i] +
               tableOverheadArr[i] +
               tableProfitArr[i]
            );
         }
         console.log('\n');
         menuPrompt();
      });
   ;
}

function populateTableArr(originalArr, tableArr) {
   originalArr.forEach(elem => {
      elem = String(elem);
      var whiteSpace = 15 - elem.length;
      for (var i = 0; i < whiteSpace; i++) {
         elem += ' ';
      }
      elem = ' ' + elem + ' |';
      tableArr.push(elem);
   });
}

function createNewDept() {
   inquirer
      .prompt([
         {
            type: "input",
            message: "Enter department name.",
            name: "departmentName",
         },
         {
            type: "input",
            message: "Enter department's overhead costs.",
            name: "overheadCosts",
         }
      ])
      .then(answers => {
         connection.query(`
                  INSERT INTO departments (department_name, overhead_costs) 
                  VALUES (?, ?)
                  `, [answers.departmentName, Number(answers.overheadCosts)], function (err) {
               if (err) throw err; 2
               console.log('Department added!');
               menuPrompt();
            });
         ;
      });
   ;
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