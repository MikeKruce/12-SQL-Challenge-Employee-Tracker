const inquirer = require('inquirer');
const db = require('./db/queries');

const mainMenu = async () => {
    const choices = [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update employee manager',
        'View employees by manager',
        'View employees by department',
        'Delete department',
        'Delete role',
        'Delete employee',
        'View total utilized budget of a department',
        'Exit'
    ];

    console.log("Displaying main menu"); // Log for debugging

    try {
        const { choice } = await inquirer.prompt({
            name: 'choice',
            type: 'list',
            message: 'What would you like to do?',
            choices
        });

        console.log(`User selected: ${choice}`); // Log for debugging

        switch (choice) {
            case 'View all departments':
                await viewDepartments();
                break;
            case 'View all roles':
                await viewRoles();
                break;
            case 'View all employees':
                await viewEmployees();
                break;
            case 'Add a department':
                await addDepartment();
                break;
            case 'Add a role':
                await addRole();
                break;
            case 'Add an employee':
                await addEmployee();
                break;
            case 'Update an employee role':
                await updateEmployeeRole();
                break;
            case 'Update employee manager':
                await updateEmployeeManager();
                break;
            case 'View employees by manager':
                await viewEmployeesByManager();
                break;
            case 'View employees by department':
                await viewEmployeesByDepartment();
                break;
            case 'Delete department':
                await deleteDepartment();
                break;
            case 'Delete role':
                await deleteRole();
                break;
            case 'Delete employee':
                await deleteEmployee();
                break;
            case 'View total utilized budget of a department':
                await viewTotalUtilizedBudget();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
        }

        mainMenu();
    } catch (error) {
        console.error('An error occurred:', error);
        mainMenu();
    }
};

const viewDepartments = async () => {
    console.log("Viewing all departments"); // Log for debugging
    try {
        const departments = await db.getDepartments();
        console.table(departments);
    } catch (error) {
        console.error('Error viewing departments:', error);
    }
};

const viewRoles = async () => {
    console.log("Viewing all roles"); // Log for debugging
    try {
        const roles = await db.getRoles();
        console.table(roles);
    } catch (error) {
        console.error('Error viewing roles:', error);
    }
};

const viewEmployees = async () => {
    console.log("Viewing all employees"); // Log for debugging
    try {
        const employees = await db.getEmployees();
        console.table(employees);
    } catch (error) {
        console.error('Error viewing employees:', error);
    }
};

const addDepartment = async () => {
    console.log("Adding a department"); // Log for debugging
    try {
        const { name } = await inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'Enter the department name:'
        });
        await db.addDepartment(name);
        console.log(`Department ${name} added successfully.`);
    } catch (error) {
        console.error('Error adding department:', error);
    }
};

const addRole = async () => {
    console.log("Adding a role"); // Log for debugging
    try {
        const departments = await db.getDepartments();
        const { title, salary, department_id } = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the role title:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the role salary:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department:',
                choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
            }
        ]);
        await db.addRole(title, salary, department_id);
        console.log(`Role ${title} added successfully.`);
    } catch (error) {
        console.error('Error adding role:', error);
    }
};

const addEmployee = async () => {
    console.log("Adding an employee"); // Log for debugging
    try {
        const roles = await db.getRoles();
        const employees = await db.getEmployees();
        const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter the employee first name:'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'Enter the employee last name:'
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the role:',
                choices: roles.map(role => ({ name: role.title, value: role.id }))
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the manager:',
                choices: [{ name: 'None', value: null }].concat(employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })))
            }
        ]);
        await db.addEmployee(first_name, last_name, role_id, manager_id);
        console.log(`Employee ${first_name} ${last_name} added successfully.`);
    } catch (error) {
        console.error('Error adding employee:', error);
    }
};

const updateEmployeeRole = async () => {
    console.log("Updating employee role"); // Log for debugging
    try {
        const employees = await db.getEmployees();
        const roles = await db.getRoles();
        const { employee_id, role_id } = await inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee:',
                choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the new role:',
                choices: roles.map(role => ({ name: role.title, value: role.id }))
            }
        ]);
        await db.updateEmployeeRole(employee_id, role_id);
        console.log('Employee role updated successfully.');
    } catch (error) {
        console.error('Error updating employee role:', error);
    }
};

const updateEmployeeManager = async () => {
    console.log("Updating employee manager"); // Log for debugging
    try {
        const employees = await db.getEmployees();
        const { employee_id, manager_id } = await inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee:',
                choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the new manager:',
                choices: [{ name: 'None', value: null }].concat(employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })))
            }
        ]);
        await db.updateEmployeeManager(employee_id, manager_id);
        console.log('Employee manager updated successfully.');
    } catch (error) {
        console.error('Error updating employee manager:', error);
    }
};

const viewEmployeesByManager = async () => {
    console.log("Viewing employees by manager"); // Log for debugging
    try {
        const employees = await db.getEmployees();
        const { manager_id } = await inquirer.prompt({
            name: 'manager_id',
            type: 'list',
            message: 'Select the manager:',
            choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
        });
        const employeesByManager = await db.getEmployeesByManager(manager_id);
        console.table(employeesByManager);
    } catch (error) {
        console.error('Error viewing employees by manager:', error);
    }
};

const viewEmployeesByDepartment = async () => {
    console.log("Viewing employees by department"); // Log for debugging
    try {
        const departments = await db.getDepartments();
        const { department_id } = await inquirer.prompt({
            name: 'department_id',
            type: 'list',
            message: 'Select the department:',
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        });
        const employeesByDepartment = await db.getEmployeesByDepartment(department_id);
        console.table(employeesByDepartment);
    } catch (error) {
        console.error('Error viewing employees by department:', error);
    }
};

const deleteDepartment = async () => {
    console.log("Deleting department"); // Log for debugging
    try {
        const departments = await db.getDepartments();
        const { department_id } = await inquirer.prompt({
            name: 'department_id',
            type: 'list',
            message: 'Select the department to delete:',
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        });
        await db.deleteDepartment(department_id);
        console.log('Department deleted successfully.');
    } catch (error) {
        console.error('Error deleting department:', error);
    }
};

const deleteRole = async () => {
    console.log("Deleting role"); // Log for debugging
    try {
        const roles = await db.getRoles();
        const { role_id } = await inquirer.prompt({
            name: 'role_id',
            type: 'list',
            message: 'Select the role to delete:',
            choices: roles.map(role => ({ name: role.title, value: role.id }))
        });
        await db.deleteRole(role_id);
        console.log('Role deleted successfully.');
    } catch (error) {
        console.error('Error deleting role:', error);
    }
};

const deleteEmployee = async () => {
    console.log("Deleting employee"); // Log for debugging
    try {
        const employees = await db.getEmployees();
        const { employee_id } = await inquirer.prompt({
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to delete:',
            choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
        });
        await db.deleteEmployee(employee_id);
        console.log('Employee deleted successfully.');
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
};

const viewTotalUtilizedBudget = async () => {
    console.log("Viewing total utilized budget"); // Log for debugging
    try {
        const departments = await db.getDepartments();
        const { department_id } = await inquirer.prompt({
            name: 'department_id',
            type: 'list',
            message: 'Select the department:',
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        });
        const totalBudget = await db.getTotalUtilizedBudget(department_id);
        console.log(`Total utilized budget for the department: ${totalBudget}`);
    } catch (error) {
        console.error('Error viewing total utilized budget:', error);
    }
};

mainMenu();
