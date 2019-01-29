DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_name TEXT NOT NULL,
    department_name TEXT NOT NULL,
    price DECIMAL(10 , 2 ) NOT NULL,
    stock_quantity INTEGER NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Switch", "Video Games", 299.00, 4786);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Super Smash Bros. Ultimate", "Video Games", 59.99, 10856);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Super Mario Odyssey", "Video Games", 54.98, 12456);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kingdom Hearts III", "Video Games", 59.99, 15282);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Legend of Zelda: Breath of the Wild", "Video Games", 59.99, 7841);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mario Kart 8 Deluxe", "Video Games", 59.99, 5682);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("NieR: Automata", "Video Games", 29.99, 6289);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PlayStation 4 Slim 1TB Console", "Video Games", 299.99, 3589);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox One S 1TB Console", "Video Games", 299.99, 2674);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dark Souls III", "Video Games", 19.99, 4821);