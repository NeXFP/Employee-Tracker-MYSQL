INSERT INTO department (name)
VALUES 
('Tech'),
('Finances'),
('Sales & Marketing'),
('Office');

INSERT INTO role (title, salary, department_id)
VALUES
('Front End Developer', 80000, 1),
('Engineer', 120000, 1),
('Accounting Rep', 10000, 2), 
('Data Analyst', 150000, 2),
('Marketing Department', 70000, 3), 
('Sales Rep', 90000, 3),
('Development Manager', 100000, 4),
('Office Manager', 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Sarah', 'Johnson', 1, null),
('Mary', 'Jane', 1, 1),
('Andrew', 'Brown', 4, null),
('Carl', 'Jones', 3, 3),
('Tyler', 'Smith', 6, null),
('Mark', 'Sanchez', 5, 5),
('Keith', 'Jenkins', 7, null),
('Matthew', 'White', 8, 7);
