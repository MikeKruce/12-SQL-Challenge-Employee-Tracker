const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'company_db',
    password: 'Eagles0825$',
    port: 5432,
});

const getDepartments = async () => {
    const res = await pool.query('SELECT * FROM department');
    return res.rows;
};

const getRoles = async () => {
    const res = await pool.query('SELECT role.*, department.name as department FROM role JOIN department ON role.department_id = department.id');
    return res.rows;
};

const getEmployees = async () => {
    const res = await pool.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) as manager 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON employee.manager_id = manager.id`);
    return res.rows;
};

const addDepartment = async (name) => {
    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
};

const addRole = async (title, salary, department_id) => {
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
};

const addEmployee = async (first_name, last_name, role_id, manager_id) => {
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
};

const updateEmployeeRole = async (employee_id, role_id) => {
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
};

const updateEmployeeManager = async (employee_id, manager_id) => {
    await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [manager_id, employee_id]);
};

const getEmployeesByManager = async (manager_id) => {
    const res = await pool.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        WHERE employee.manager_id = $1`, [manager_id]);
    return res.rows;
};

const getEmployeesByDepartment = async (department_id) => {
    const res = await pool.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) as manager 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON employee.manager_id = manager.id 
        WHERE role.department_id = $1`, [department_id]);
    return res.rows;
};

const deleteDepartment = async (department_id) => {
    await pool.query('DELETE FROM department WHERE id = $1', [department_id]);
};

const deleteRole = async (role_id) => {
    await pool.query('DELETE FROM role WHERE id = $1', [role_id]);
};

const deleteEmployee = async (employee_id) => {
    await pool.query('DELETE FROM employee WHERE id = $1', [employee_id]);
};

const getTotalUtilizedBudget = async (department_id) => {
    const res = await pool.query(`
        SELECT SUM(role.salary) AS total_budget 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        WHERE role.department_id = $1`, [department_id]);
    return res.rows[0].total_budget;
};

module.exports = {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    getEmployeesByManager,
    getEmployeesByDepartment,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    getTotalUtilizedBudget,
};
