const db = require('./db/connection');
const inquirer = require('inquirer');

function afterConnection() {
    console.log('___________________________________');
    console.log('*!!        EMPLOYEE MANAGER         !!*');
    console.log('___________________________________');

    promptUser();
};

function promptUser() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role']
        }

    ]).then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                showDepartment();
            }

            if (choices === "View all roles") {
                showRole();
            }

            if (choices === "View all employees") {
                showEmployee();
            }

            if (choices === "Add a department") {
                addDepartment();
            }

            if (choices === "Add a role") {
                addRole();
            }

            if (choices === "Add an employee") {
                addEmployee();
            }

            if (choices === "Update an employee role") {
                updateEmployee();
            };
        });
};

function showDepartment(){
    const sql = `SELECT department.id, department.name AS department FROM department`

    db.query(sql, (err,results) => {
        if (err) throw err;

        const transformed = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {});
        console.table(transformed);
        promptUser();
    })
}


function showRole(){
    const sql = `SELECT role.id , role.title, role.salary, department.name AS department
                FROM role JOIN department ON role.department_id = department.id`

    db.query(sql, (err,results) => {
        if (err) throw err;

        const transformed = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {});
        console.table(transformed);
        promptUser();
    })
}


function showEmployee(){
    const sql = `SELECT employee.id , employee.first_name, employee.last_name, role.title ,
                department.name AS department, role.salary, manager.first_name AS manager
                FROM employee JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id;`

    db.query(sql, (err,results) => {
        if (err) throw err;

        const transformed = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {});
        console.table(transformed);
        promptUser();
    })
}

function addDepartment(){

    inquirer.prompt([
        {
            type:'input',
            name:'department',
            message:'Which department would you like to add?'
        }
    ]).then(function(data){
        db.query(`INSERT INTO department (name) VALUES ('${data.department}')`, (err) => {
            if (err) throw err;
            promptUser();
        });
    });
    
}

function addRole(){
    db.query(`SELECT department.name FROM department`, (err,results) => {
        if (err) throw err;

        let depArray = [];

        for(let i = 0; i < results.length; i++) {
            depArray.push(results[i].name)
        }
        
        inquirer.prompt([
            {
                type:'input',
                name:'role',
                message:'Which role would you like to add?'
            },
            {
                type:'input',
                name:'salary',
                message:'What is the salary for this role?'
            },
            {
                type:'list',
                name:'dept',
                message:'What department is this role in?',
                choices: depArray
            }
        ]).then(function(data) {
            db.query(`SELECT FROM department WHERE name = '${data.department}'`, (err, results) => {
                if (err) throw err;

                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.role}','${data.salary}', '${results[0].department_id}')`, (err) => {
                    if (err) throw err;

                    promptUser();
                });
            });
        });
    });
}
afterConnection();