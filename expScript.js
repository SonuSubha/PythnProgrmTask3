let expenses = [];

if (localStorage.getItem("expenses")) {
  expenses = JSON.parse(localStorage.getItem("expenses")).map((expense) => {
    return {
      amount: expense.amount,
      description: expense.description,
      date: new Date(expense.date),
    };
  });
}

document.getElementById("expense-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const expense = {
    amount: parseFloat(amount),
    description: description,
    date: new Date(),
  };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateExpenses();
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
});

function updateExpenses() {
  const latestExpenses = getLatestExpenses();
  const weeklyExpenses = getWeeklyExpenses();
  const monthlyExpenses = getMonthlyExpenses();

  document.getElementById("latest-expenses").innerHTML = "";
  latestExpenses.forEach((expense) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${expense.date.toLocaleDateString()} - ₹${expense.amount} - ${expense.description}`;
    const editButton = document.createElement("button");
    editButton.className = "btn btn-sm btn-primary";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editExpense(expense);
    });
    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-sm btn-danger";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeExpense(expense);
    });
    li.appendChild(editButton);
    li.appendChild(removeButton);
    document.getElementById("latest-expenses").appendChild(li);
  });

  document.getElementById("weekly-expenses").innerHTML = "";
  weeklyExpenses.forEach((expense) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${expense.date.toLocaleDateString()} (${getDayOfWeek(expense.date)}) - ₹${expense.amount} - ${expense.description}`;
    document.getElementById("weekly-expenses").appendChild(li);
  });

  document.getElementById("monthly-expenses").innerHTML = "";
  monthlyExpenses.forEach((expense) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${expense.date.toLocaleDateString()} - ₹${expense.amount} - ${expense.description}`;
    document.getElementById("monthly-expenses").appendChild(li);
  });
}

function getLatestExpenses() {
  return expenses.slice(-5);
}

function getWeeklyExpenses() {
  const today = new Date();
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const weekExpenses = expenses.filter((expense) => {
    return expense.date >= weekStart;
  });
  return weekExpenses;
}

function getMonthlyExpenses() {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthExpenses = expenses.filter((expense) => {
    return expense.date >= monthStart;
  });
  return monthExpenses;
}

function getDayOfWeek(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
}

function editExpense(expense) {
  const index = expenses.indexOf(expense);
  if (index !== -1) {
    const amount = prompt("Enter new amount:", expense.amount);
    const description = prompt("Enter new description:", expense.description);
    expenses[index] = {
      amount: parseFloat(amount),
      description: description,
      date: expense.date,
    };
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenses();
  }
}

function removeExpense(expense) {
  const index = expenses.indexOf(expense);
  if (index !== -1) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenses();
  }
}

document.getElementById("download-data").addEventListener("click", () => {
  const XLSX = window.XLSX;
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  const headerRow = [
    { header: "Date", key: "date" },
    { header: "Amount (₹)", key: "amount" },
    { header: "Description", key: "description" },
  ];

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [headerRow.map((header) => header.header)],
    { origin: "A1" }
  );

  expenses.forEach((expense, index) => {
    const row = [
      expense.date.toLocaleDateString(),
      `₹${expense.amount.toString().replace("₹", "")}`,
      expense.description,
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [[row[0], row[1], row[2]]], { origin: index + 2 });
  });

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.xlsx";
  a.click();
});

document.getElementById("total-month").innerText = getTotalExpensesMonth().toFixed(2);
document.getElementById("average-month").innerText = getAverageExpensesMonth().toFixed(2);
document.getElementById("total-week").innerText = getTotalExpensesWeek().toFixed(2);
document.getElementById("average-week").innerText = getAverageExpensesWeek().toFixed(2);

function getTotalExpensesMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return expenses.reduce((acc, expense) => {
    const expenseDate = expense.date;
    if (expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === currentMonth) {
      return acc + expense.amount;
    }
    return acc;
  }, 0);
}

function getTotalExpensesWeek() {
  const currentDate = new Date();
  const currentWeek = getWeekNumber(currentDate);

  return expenses.reduce((acc, expense) => {
    const expenseDate = expense.date;
    const expenseWeek = getWeekNumber(expenseDate);
    if (expenseWeek === currentWeek) {
      return acc + expense.amount;
    }
    return acc;
  }, 0);
}

function getAverageExpensesMonth() {
  const totalExpensesMonth = getTotalExpensesMonth();
  const daysInMonth = getDaysInMonth(new Date().getFullYear(), new Date().getMonth() + 1);
  return totalExpensesMonth / daysInMonth;
}

function getAverageExpensesWeek() {
  const totalExpensesWeek = getTotalExpensesWeek();
  return totalExpensesWeek / 7;
}

function getWeekNumber(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

updateExpenses();
