# bamazon

`USER INSTRUCTIONS`

### APP 1: bamazonCustomer.js ###

1. Download, install, and run MAMP: https://www.mamp.info/en/downloads/

2. Download, install, and run MySQL Workbench: https://dev.mysql.com/downloads/workbench/

3. In MySQL Workbench, create a new connection by clicking the + sign here:

![NewConnection](https://puu.sh/CEBP2.png)

4. Name the connection "localhost" and the password/user name both to "root":

![ConnectionName](https://puu.sh/CEBT2.png)

5. Test the connection to make sure it's working(if it isn't, make sure MAMP is running):

![TestConnection](https://puu.sh/CEBTB.png)

6. Navigate to your repository directory in your terminal.

7. Install the app's dependencies by typing these 3 commands:

    npm install mysql
    npm install inquirer
    npm install colors

![InstallDependencies](https://puu.sh/CEBXX.png)

8. Run the app by typing this command:

    node bamazoncustomer.js

    * This will display a list of products to buy.

![ProductDisplay](https://puu.sh/CEC0B.png)

7. Follow the instructions in the remaining prompts to select which product to buy, specify how many
of it you wish to buy, view your total checkout price, and decide whether or not to continue shopping.

![Prompts](https://puu.sh/CEC5l.png)


### APP 2: bamazonManager.js ###

1. Follow steps 1-7 for APP 1 if you have not done so already(this only needs to be done once to use all 3 apps).

2. Run the app by typing this command:

    node bamazonmanager.js

    * This will display a list of managerial actions to choose from.

![ManagerTasks](https://puu.sh/CG6wF.png)

3. Select one of the four options:

    1. View products for sale

        * This will simply display a list of all available products for sale.

        ![AvailableProducts](https://puu.sh/CG6zx.png)

    2. View low inventory

        * This will display a list of all products with a stock quantity lower than 5000.

        ![ViewLowInventory](https://puu.sh/CG6Bh.png)
        
    3. Add to inventory

        * This will let you select a product to restock, display its info, and let you specify how much 
        you wish to replenishthe stock by.

        ![AddToInventory](https://puu.sh/CG6M7.png)

    4. Add new product

        * This will let you add an entirely new product to the database. Follow the prompts as they come up 
        to enter the product's name, department name, price, and inital stock quantity.

        ![AddNewProduct](https://puu.sh/CG6Hi.png)