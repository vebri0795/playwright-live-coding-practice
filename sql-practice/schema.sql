CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    order_date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled'))
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL
);

INSERT INTO customers (id, name, country) VALUES
    (1, 'Alice', 'Spain'),
    (2, 'Bob', 'France'),
    (3, 'Carol', 'Spain'),
    (4, 'David', 'Germany'),
    (5, 'Eve', 'France');

INSERT INTO products (id, name, category) VALUES
    (1, 'Widget', 'Hardware'),
    (2, 'Gadget', 'Hardware'),
    (3, 'Gizmo', 'Electronics'),
    (4, 'Doohickey', 'Electronics'),
    (5, 'Thingamajig', 'Misc');

INSERT INTO orders (id, customer_id, order_date, status) VALUES
    (1, 1, '2026-01-05', 'confirmed'),
    (2, 1, '2026-02-10', 'confirmed'),
    (3, 2, '2026-01-20', 'confirmed'),
    (4, 2, '2026-03-01', 'cancelled'),
    (5, 3, '2026-02-15', 'confirmed'),
    (6, 3, '2026-02-16', 'confirmed'),
    (7, 3, '2026-03-10', 'confirmed'),
    (8, 4, '2026-01-01', 'confirmed'),
    (9, 1, '2026-03-15', 'confirmed');

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 2, 10.00),
    (2, 1, 3, 1, 25.00),
    (3, 2, 2, 1, 15.00),
    (4, 3, 1, 3, 10.00),
    (5, 3, 4, 2, 30.00),
    (6, 4, 2, 1, 15.00),
    (7, 5, 3, 2, 25.00),
    (8, 6, 1, 1, 10.00),
    (9, 7, 4, 1, 30.00),
    (10, 7, 2, 2, 15.00),
    (11, 8, 3, 1, 25.00),
    (12, 9, 1, 5, 10.00),
    (13, 9, 2, 2, 15.00);
