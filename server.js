const db = require('./db/connection');
const inquirer = require('inquirer');

afterConnection = () => {
    console.log('___________________________________');
    console.log('*!!        EMPLOYEE MANAGER         !!*');
    console.log('___________________________________');

    promptUser();
};

const promptUser = () => {
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