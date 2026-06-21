import { useState } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
} from "chart.js";
import { Doughnut, Pie, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    Title
);

function HomePage({ onLogout }) {
    const [transactions, setTransactions] = useState([]);

    const [incomeDate, setIncomeDate] = useState("");
    const [incomeSource, setIncomeSource] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");

    const [expenseDate, setExpenseDate] = useState("");
    const [expenseType, setExpenseType] = useState("Expense");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");

    const [editingIncomeId, setEditingIncomeId] = useState(null);
    const [editingTransactionId, setEditingTransactionId] = useState(null);

    function getTotal(type) {
        return transactions
            .filter((transaction) => transaction.type === type)
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    }

    const totalIncome = getTotal("Income");
    const totalExpenses = getTotal("Expense");
    const totalInvestments = getTotal("Investment");
    const totalSavings = getTotal("Savings");

    const remainingBudget =
        totalIncome - (totalExpenses + totalInvestments + totalSavings);

    function addOrUpdateIncome() {
        const amount = parseFloat(incomeAmount);

        if (!incomeDate || !incomeSource.trim() || amount <= 0 || isNaN(amount)) {
            alert("Please enter valid income details");
            return;
        }

        if (editingIncomeId !== null) {
            const updatedTransactions = transactions.map((transaction) => {
                if (transaction.id === editingIncomeId) {
                    return {
                        ...transaction,
                        date: incomeDate,
                        category: incomeSource.trim(),
                        amount,
                    };
                }

                return transaction;
            });

            setTransactions(updatedTransactions);
            setEditingIncomeId(null);
        } else {
            const newTransaction = {
                id: Date.now(),
                type: "Income",
                date: incomeDate,
                category: incomeSource.trim(),
                amount,
            };

            setTransactions([...transactions, newTransaction]);
        }

        setIncomeDate("");
        setIncomeSource("");
        setIncomeAmount("");
    }

    function addOrUpdateExpense() {
        const amount = parseFloat(expenseAmount);

        if (
            !expenseDate ||
            !expenseCategory.trim() ||
            amount <= 0 ||
            isNaN(amount)
        ) {
            alert("Please enter valid transaction details");
            return;
        }

        if (editingTransactionId !== null) {
            const updatedTransactions = transactions.map((transaction) => {
                if (transaction.id === editingTransactionId) {
                    return {
                        ...transaction,
                        type: expenseType,
                        date: expenseDate,
                        category: expenseCategory.trim(),
                        amount,
                    };
                }

                return transaction;
            });

            setTransactions(updatedTransactions);
            setEditingTransactionId(null);
        } else {
            const newTransaction = {
                id: Date.now(),
                type: expenseType,
                date: expenseDate,
                category: expenseCategory.trim(),
                amount,
            };

            setTransactions([...transactions, newTransaction]);
        }

        setExpenseDate("");
        setExpenseType("Expense");
        setExpenseCategory("");
        setExpenseAmount("");
    }

    function deleteTransaction(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");

        if (!confirmDelete) {
            return;
        }

        setTransactions(
            transactions.filter((transaction) => transaction.id !== id)
        );

        if (editingIncomeId === id) {
            setEditingIncomeId(null);
            setIncomeDate("");
            setIncomeSource("");
            setIncomeAmount("");
        }

        if (editingTransactionId === id) {
            setEditingTransactionId(null);
            setExpenseDate("");
            setExpenseType("Expense");
            setExpenseCategory("");
            setExpenseAmount("");
        }
    }

    function startIncomeUpdate(transaction) {
        setEditingIncomeId(transaction.id);
        setIncomeDate(transaction.date);
        setIncomeSource(transaction.category);
        setIncomeAmount(transaction.amount.toString());

        setEditingTransactionId(null);
        setExpenseDate("");
        setExpenseType("Expense");
        setExpenseCategory("");
        setExpenseAmount("");
    }

    function startTransactionUpdate(transaction) {
        setEditingTransactionId(transaction.id);
        setExpenseDate(transaction.date);
        setExpenseType(transaction.type);
        setExpenseCategory(transaction.category);
        setExpenseAmount(transaction.amount.toString());

        setEditingIncomeId(null);
        setIncomeDate("");
        setIncomeSource("");
        setIncomeAmount("");
    }

    function cancelIncomeUpdate() {
        setEditingIncomeId(null);
        setIncomeDate("");
        setIncomeSource("");
        setIncomeAmount("");
    }

    function cancelTransactionUpdate() {
        setEditingTransactionId(null);
        setExpenseDate("");
        setExpenseType("Expense");
        setExpenseCategory("");
        setExpenseAmount("");
    }

    function getCategoryData(type) {
        const filteredTransactions = transactions.filter(
            (transaction) => transaction.type === type
        );

        const categories = [
            ...new Set(filteredTransactions.map((transaction) => transaction.category)),
        ];

        const data = categories.map((category) =>
            filteredTransactions
                .filter((transaction) => transaction.category === category)
                .reduce((sum, transaction) => sum + transaction.amount, 0)
        );

        return {
            labels: categories,
            data,
        };
    }

    function createChartData(type, colors) {
        const categoryData = getCategoryData(type);

        return {
            labels: categoryData.labels,
            datasets: [
                {
                    data: categoryData.data,
                    backgroundColor: colors,
                    borderWidth: 1,
                },
            ],
        };
    }

    function createChartOptions(type) {
        const categoryData = getCategoryData(type);
        const chartTotal = categoryData.data.reduce((sum, value) => sum + value, 0);

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed;
                            const chartPercentage =
                                chartTotal > 0
                                    ? ((value / chartTotal) * 100).toFixed(1) + "%"
                                    : "0%";

                            const incomePercentage =
                                totalIncome > 0
                                    ? ((value / totalIncome) * 100).toFixed(1) + "%"
                                    : "0%";

                            return [
                                `Category: ${context.label}`,
                                `Amount: $${value.toFixed(2)}`,
                                `Income Percentage: ${incomePercentage}`,
                                `Chart Percentage: ${chartPercentage}`,
                            ];
                        },
                    },
                },
            },
        };
    }

    function getProgress(value) {
        const total = Math.max(
            totalIncome,
            totalExpenses + totalInvestments + totalSavings
        );

        if (total === 0) {
            return "0%";
        }

        return `${(value / total) * 100}%`;
    }

    const expenseChartData = createChartData("Expense", [
        "#780116",
        "#f7b538",
        "#db7c26",
        "#d8572a",
        "#c32f27",
    ]);

    const investmentChartData = createChartData("Investment", [
        "#03045e",
        "#0077b6",
        "#00b4d8",
        "#90e0ef",
        "#caf0f8",
    ]);

    const savingsChartData = createChartData("Savings", [
        "#00798c",
        "#30638e",
        "#003d5b",
        "#d1495b",
        "#efcfe3",
    ]);

    const incomeTransactions = transactions.filter(
        (transaction) => transaction.type === "Income"
    );

    const expenseLikeTransactions = transactions.filter(
        (transaction) => transaction.type !== "Income"
    );

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        FINANCE TRACKER
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#overview">
                                    Overview
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#income">
                                    Income
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#expenses">
                                    Transactions
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#reports">
                                    Reports
                                </a>
                            </li>

                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={onLogout}>
                                    Log Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div id="incomeDisplay" className="budget-box income-box">
                <strong>Total Income:</strong> $<span>{totalIncome.toFixed(2)}</span>
            </div>

            <div id="remainingDisplay" className="budget-box remaining-box">
                <strong>Remaining Budget:</strong> $
                <span>{remainingBudget.toFixed(2)}</span>
            </div>

            <div className="container finance-container">
                <div className="row">
                    <div className="col-lg-8">
                        <section id="overview" className="visible mb-4">
                            <h2 className="section-heading">Financial Overview</h2>

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="summary-card">
                                        <h5>Total Income</h5>
                                        <h3>${totalIncome.toFixed(2)}</h3>

                                        <div className="progress">
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{ width: getProgress(totalIncome) }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="summary-card">
                                        <h5>Total Expenses</h5>
                                        <h3>${totalExpenses.toFixed(2)}</h3>

                                        <div className="progress">
                                            <div
                                                className="progress-bar bg-danger"
                                                role="progressbar"
                                                style={{ width: getProgress(totalExpenses) }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="summary-card">
                                        <h5>Remaining Budget</h5>
                                        <h3>${remainingBudget.toFixed(2)}</h3>

                                        <div className="progress">
                                            <div
                                                className="progress-bar bg-primary"
                                                role="progressbar"
                                                style={{ width: getProgress(remainingBudget) }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="summary-card">
                                        <h5>Total Savings</h5>
                                        <h3>${totalSavings.toFixed(2)}</h3>

                                        <div className="progress">
                                            <div
                                                className="progress-bar bg-warning"
                                                role="progressbar"
                                                style={{ width: getProgress(totalSavings) }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="income" className="visible mb-4">
                            <h2 className="section-heading">Income</h2>

                            <div className="mb-3">
                                <input
                                    type="date"
                                    className="form-control my-2"
                                    value={incomeDate}
                                    onChange={(event) => setIncomeDate(event.target.value)}
                                />

                                <input
                                    type="text"
                                    placeholder="Income Source"
                                    className="form-control my-2"
                                    value={incomeSource}
                                    onChange={(event) => setIncomeSource(event.target.value)}
                                />

                                <input
                                    type="number"
                                    placeholder="Amount"
                                    className="form-control my-2"
                                    value={incomeAmount}
                                    onChange={(event) => setIncomeAmount(event.target.value)}
                                />

                                <button className="btn btn-success w-100" onClick={addOrUpdateIncome}>
                                    {editingIncomeId !== null ? "Update Income" : "Add Income"}
                                </button>

                                {editingIncomeId !== null && (
                                    <button
                                        className="btn btn-secondary w-100 mt-2"
                                        onClick={cancelIncomeUpdate}
                                    >
                                        Cancel Update
                                    </button>
                                )}
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Income History</h5>

                                    {editingIncomeId !== null && (
                                        <p className="text-primary mb-2">
                                            You are editing an income record.
                                        </p>
                                    )}

                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Income Source</th>
                                                <th>Amount ($)</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {incomeTransactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted">
                                                        No income added yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                incomeTransactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td>{transaction.date}</td>
                                                        <td>{transaction.category}</td>
                                                        <td>${transaction.amount.toFixed(2)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => startIncomeUpdate(transaction)}
                                                            >
                                                                Update
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteTransaction(transaction.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <section id="expenses" className="visible">
                            <h2 className="section-heading">Transactions</h2>

                            <div className="mb-3">
                                <input
                                    type="date"
                                    className="form-control my-2"
                                    value={expenseDate}
                                    onChange={(event) => setExpenseDate(event.target.value)}
                                />

                                <select
                                    className="form-control my-2"
                                    value={expenseType}
                                    onChange={(event) => setExpenseType(event.target.value)}
                                >
                                    <option value="Expense">Expense</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Savings">Savings</option>
                                </select>

                                <input
                                    type="text"
                                    placeholder="Category / For What"
                                    className="form-control my-2"
                                    value={expenseCategory}
                                    onChange={(event) => setExpenseCategory(event.target.value)}
                                />

                                <input
                                    type="number"
                                    placeholder="Amount"
                                    className="form-control my-2"
                                    value={expenseAmount}
                                    onChange={(event) => setExpenseAmount(event.target.value)}
                                />

                                <button className="btn btn-danger w-100" onClick={addOrUpdateExpense}>
                                    {editingTransactionId !== null ? "Update Transaction" : "Add Transaction"}
                                </button>

                                {editingTransactionId !== null && (
                                    <button
                                        className="btn btn-secondary w-100 mt-2"
                                        onClick={cancelTransactionUpdate}
                                    >
                                        Cancel Update
                                    </button>
                                )}
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Transaction History</h5>

                                    {editingTransactionId !== null && (
                                        <p className="text-primary mb-2">
                                            You are editing a transaction record.
                                        </p>
                                    )}

                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Category / For What</th>
                                                <th>Amount ($)</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {expenseLikeTransactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-muted">
                                                        No transactions added yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                expenseLikeTransactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td>{transaction.date}</td>
                                                        <td>{transaction.type}</td>
                                                        <td>{transaction.category}</td>
                                                        <td>${transaction.amount.toFixed(2)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => startTransactionUpdate(transaction)}
                                                            >
                                                                Update
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteTransaction(transaction.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="col-lg-4 reports-column">
                        <section id="reports" className="visible">
                            <h2 className="section-heading">Financial Reports</h2>

                            <div className="chart-container mb-4">
                                <h5>Expense Breakdown</h5>

                                {expenseChartData.labels.length === 0 ? (
                                    <div className="chart-message">Add transactions to see data</div>
                                ) : (
                                    <Doughnut
                                        data={expenseChartData}
                                        options={createChartOptions("Expense")}
                                    />
                                )}
                            </div>

                            <div className="chart-container mb-4">
                                <h5>Investment Allocation</h5>

                                {investmentChartData.labels.length === 0 ? (
                                    <div className="chart-message">Add investments to see data</div>
                                ) : (
                                    <Pie
                                        data={investmentChartData}
                                        options={createChartOptions("Investment")}
                                    />
                                )}
                            </div>

                            <div className="chart-container">
                                <h5>Savings Progress</h5>

                                {savingsChartData.labels.length === 0 ? (
                                    <div className="chart-message">Add savings to see data</div>
                                ) : (
                                    <Bar
                                        data={savingsChartData}
                                        options={createChartOptions("Savings")}
                                    />
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <footer className="bg-dark text-white text-center py-3 mt-auto">
                <p>&copy; 2025 Personal Finance Tracker. All rights reserved.</p>
            </footer>
        </>
    );
}

export default HomePage;