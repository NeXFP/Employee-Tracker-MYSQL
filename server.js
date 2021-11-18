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
    db.query(`SELECT * FROM department`, (err,results) => {
        if (err) throw err;

        let depArray = [];
        for(let i = 0; i < results.length; i++) {
            depArray.push(results[i].name);
        }
        console.log(results);
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

            console.log(depArray);
            console.log(data.dept);
            db.query(`SELECT * FROM department WHERE name = '${data.dept}'`, (err, results) => {
                if (err) throw err;
                console.log(results);
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.role}','${data.salary}', '${results[0].id}')`, (err) => {
                    if (err) throw err;

                    promptUser();
                });
            });
        });
    });
}

function addEmployee(){
    db.query(`SELECT * FROM role`, (err, results) => {
        if (err) throw err;
        let roleArr = [];

        for(let i = 0; i < results.length; i++){
            roleArr.push(results[i].title)
        }
        inquirer.prompt([
            {
                type: "input",
                name: "first",
                message: "What is the first name of the employee you would like to add?"
            },
            {
                type: "input",
                name: "last",
                message: "What is the last name of the employee you would like to add?"
            },
            {
                type: "list",
                name: "roles",
                message: "What role would you like to give this new employee?",
                choices: roleArr
            }
        ]).then(function(data){
            const first_name = data.first;
            const last_name = data.last;
            const role = data.roles;

            db.query(`SELECT * FROM employee`, (err, results) => {
                if (err) throw err;

                let managerArr = [];

                for(let i = 0; i < results.length; i++){
                    managerArr.push(`${results[i].first_name} ${results[i].last_name}`)
                }
                inquirer.prompt([
                    {
                        type:"list",
                        name:"manager",
                        message:"Who is the manager for this employee?",
                        choices: managerArr
                    }
                ]).then(function(results){
                    let manager = results.manager;
                    manager = manager.split(" ");

                    db.query(`SELECT * FROM role WHERE title = "${role}"`,(err, results) => {
                        if (err) throw err;

                        const roleId = results[0].id;

                        db.query(`SELECT * FROM employee WHERE first_name = "${manager[0]}" AND last_name = "${manager[1]}"`, (err, results) => {
                            if (err) throw err;

                            const managerId = results[0].id;

                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES ("${first_name}","${last_name}",${roleId}, ${managerId})`, (err) => {
                                if (err) throw err;

                                promptUser();
                            })
                        })
                    })
                })
            })
        })
    })
}

function updateEmployee() {
    db.query(`SELECT * FROM employee` , (err,results) => {
        if (err) throw err;
        let employeeArr = [];

        for(let i = 0; i < results.length; i++){
            employeeArr.push(`${results[i].first_name} ${results[i].last_name}`)
        }
        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Which employee would you like to update?",
                choices: employeeArr
            }
        ]).then(function(results) {
            let employee = results.name;
            employee = employee.split(" ");

            db.query(`SELECT * FROM role`, (err,results) => {
                if (err) throw err;
                let roleArr = [];

                for(let i = 0; i < results.length; i++){
                    roleArr.push(results[i].title)
                }
                inquirer.prompt([
                    {
                        type: "list",
                        name: "title",
                        message: "What role would you like to give this employee?",
                        choices: roleArr
                    }
                ]).then(function(results){
                    db.query(`SELECT * FROM role WHERE title = "${results.title}"`, (err, results) => {
                        if (err) throw err;
                        db.query(`UPDATE employee SET role_id = ${results[0].id} WHERE first_name = "${employee[0]}" AND last_name = "${employee[1]}"`, (err) =>{
                            if (err) throw err;
                        })
                    })
                })
            });
            promptUser();
        });
    })
};

afterConnection();