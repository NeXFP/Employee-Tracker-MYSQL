INSERT INTO department (id,name)
VALUES 
(1,'Tech'),
(2,'Finances'),
(3,'Sales & Marketing'),
(4,'Office');

INSERT INTO role (id, title, salary, department_id)
VALUES
(1,'Front End Developer', 80000, 1),
(2,'Engineer', 120000, 1),
(3,'Accounting Rep', 10000, 2), 
(4,'Data Analyst', 150000, 2),
(5,'Marketing Department', 70000, 3), 
(6,'Sales Rep', 90000, 3),
(7,'Development Manager', 100000, 4),
(8,'Office Manager', 90000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES 
(1,'Sarah', 'Johnson', 1, null),
(2,'Mary', 'Jane', 1, 1),
(3,'Andrew', 'Brown', 4, null),
(4,'Carl', 'Jones', 3, 3),
(5,'Tyler', 'Smith', 6, null),
(6,'Mark', 'Sanchez', 5, 5),
(7,'Keith', 'Jenkins', 7, null),
(8,'Matthew', 'White', 8, 7);
