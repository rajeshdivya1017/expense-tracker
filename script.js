// LOGIN
async function login(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/login", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({email,password})
    });

    const data = await res.json();

    alert(data.message);

    if(res.status === 200){
        window.location.href = "expenses.html";
    }
}

// REGISTER
async function register(){

    const username = document.getElementById("username").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch("/register", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username,
            email,
            password
        })
    });

    const data = await res.json();

    alert(data.message);

    if(res.status === 201){
        window.location.href = "login.html";
    }
}

// GET EXPENSES
async function loadExpenses(){

    const res = await fetch("/expenses", {
        credentials:"include"
    });

    if(res.status === 401){
        window.location.href = "login.html";
    }

    const expenses = await res.json();

    const table = document.getElementById("expenseTable");

    table.innerHTML = "";

    expenses.forEach(expense => {

        table.innerHTML += `
        <tr>
            <td>${expense.title}</td>
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}

// ADD EXPENSE
async function addExpense(){

    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value;

    const res = await fetch("/expenses", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        credentials:"include",

        body:JSON.stringify({
            title,
            amount,
            category,
            date,
            note
        })
    });

    const data = await res.json();

    alert(data.message);

    loadExpenses();
}

// DELETE
async function deleteExpense(id){

    if(!confirm("Delete this expense?")){
        return;
    }

    await fetch(`/expenses/${id}`,{
        method:"DELETE",
        credentials:"include"
    });

    loadExpenses();
}

if(document.getElementById("expenseTable")){
    loadExpenses();
}

// DASHBOARD PAGE
function goToDashboard(){

    window.location.href = "dashboard.html";
}

// EXPENSES PAGE
function goToExpenses(){

    window.location.href = "expenses.html";
}

// LOGOUT
async function logoutUser(){

    await fetch('/logout', {
        credentials: 'include'
    });

    window.location.href = "login.html";
}

// FILTER EXPENSES
async function filterExpenses(){

    const category =
        document.getElementById("filterCategory").value;

    const from =
        document.getElementById("fromDate").value;

    const to =
        document.getElementById("toDate").value;

    let url = "/expenses/filter?";

    if(category){
        url += `category=${category}&`;
    }

    if(from && to){
        url += `from=${from}&to=${to}`;
    }

    const res = await fetch(url, {
        credentials: 'include'
    });

    const expenses = await res.json();

    const table =
        document.getElementById("expenseTable");

    table.innerHTML = "";

    expenses.forEach(expense => {

        table.innerHTML += `

        <tr>

            <td>${expense.title}</td>

            <td>${expense.amount}</td>

            <td>${expense.category}</td>

            <td>${expense.date}</td>

            <td>${expense.note || ""}</td>

            <td>

                <button onclick="deleteExpense(${expense.id})">
                    Delete
                </button>

            </td>

        </tr>

        `;
    });
}
// LOAD DASHBOARD
async function loadDashboard(){

    const summaryRes = await fetch('/expenses/summary', {
        credentials:'include'
    });

    if(summaryRes.status === 401){

        window.location.href = "login.html";
        return;
    }

    const summary = await summaryRes.json();

    const expenseRes = await fetch('/expenses', {
        credentials:'include'
    });

    const expenses = await expenseRes.json();

    // SUMMARY
    if(document.getElementById("totalExpenses")){

        document.getElementById("totalExpenses").innerText =
            summary.total_expenses || 0;

        document.getElementById("totalAmount").innerText =
            "₹" + (summary.total_amount || 0);

        document.getElementById("highestExpense").innerText =
            "₹" + (summary.highest_expense || 0);

        // CATEGORY COUNT
        const categories = [
            ...new Set(expenses.map(e => e.category))
        ];

        document.getElementById("categoryCount").innerText =
            categories.length;

        // RECENT EXPENSES
        const recentTable =
            document.getElementById("recentExpenses");

        recentTable.innerHTML = "";

        expenses.slice(0,5).forEach(expense => {

            recentTable.innerHTML += `

            <tr>

                <td>${expense.title}</td>

                <td>${expense.amount}</td>

                <td>${expense.category}</td>

                <td>${expense.date}</td>

            </tr>

            `;
        });
    }
}

// AUTO LOAD DASHBOARD
if(document.getElementById("totalExpenses")){
    loadDashboard();
}