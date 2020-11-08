--CREATE EXTENSION pgcrypto;

DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   name VARCHAR(255) NOT NULL,
   description VARCHAR(255) NOT NULL,
   category VARCHAR(100) NOT NULL,
   size VARCHAR(100) NOT NULL,
   color VARCHAR(100) NOT NULL,
   gender VARCHAR(10) NOT NULL,
   price NUMERIC(20,2) NOT NULL
);

CREATE TABLE stocks (
	product_id UUID,
	count INTEGER NOT NULL,
   	CONSTRAINT fk_products
  		FOREIGN KEY(product_id)
		  	REFERENCES products(id)
);

INSERT INTO products(name, description, category, size, color, gender, price)
VALUES('orci pede venenatis','Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.','hoodie','XL','Puce','Female',140),
    ('augue a','Curabitur gravida nisi at nibh. In hac habitasse platea ', 'classic  shirt','L','Pink','Female',100),
    ('fusce lacus','fusce lacus in, tempus sit amet, sem.', 'hoodie','M','Red','Male',1000);

COMMIT;

INSERT INTO stocks(product_id, count)
VALUES('ea23b0c1-c7c2-42f4-9606-7139a9924864', 100),
		('550374e7-f283-41e3-a08e-e05c31eac9c7', 1),
		('18c2db1c-7eea-4b6a-b3e3-45079d884302', 0);

COMMIT;
