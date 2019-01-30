# bamazon

`USER INSTRUCTIONS`

### APP 1: bamazoncustomer.js ###

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

7. Follow the instructions in the remaining prompts to select which product to buy, how many
of it you wish to buy, view your total checkout price, and continue shopping or not.

![Prompts](https://puu.sh/CEC5l.png)