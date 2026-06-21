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

    const [incomeMonth, setIncomeMonth] = useState("");
    const [incomeSource, setIncomeSource] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");

    const [expenseMonth, setExpenseMonth] = useState("");
    const [expenseType, setExpenseType] = useState("Expense");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");

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

    function addIncome() {
        const amount = parseFloat(incomeAmount);

        if (!incomeMonth || !incomeSource.trim() || amount <= 0 || isNaN(amount)) {
            alert("Please enter valid income details");
            return;
        }

        const newTransaction = {
            id: Date.now(),
            type: "Income",
            month: incomeMonth,
            category: incomeSource.trim(),
            amount,
        };

        setTransactions([...transactions, newTransaction]);
        setIncomeSource("");
        setIncomeAmount("");
    }

    function addExpense() {
        const amount = parseFloat(expenseAmount);

        if (
            !expenseMonth ||
            !expenseCategory.trim() ||
            amount <= 0 ||
            isNaN(amount)
        ) {
            alert("Please enter valid transaction details");
            return;
        }

        const newTransaction = {
            id: Date.now(),
            type: expenseType,
            month: expenseMonth,
            category: expenseCategory.trim(),
            amount,
        };

        setTransactions([...transactions, newTransaction]);
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
                                    Expenses
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
                                    type="month"
                                    className="form-control my-2"
                                    value={incomeMonth}
                                    onChange={(event) => setIncomeMonth(event.target.value)}
                                />

                                <input
                                    type="text"
                                    placeholder="Source"
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

                                <button className="btn btn-success w-100" onClick={addIncome}>
                                    Add Income
                                </button>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Income History</h5>

                                    <ul className="list-group">
                                        {incomeTransactions.map((transaction) => (
                                            <li className="list-group-item" key={transaction.id}>
                                                {transaction.month} - {transaction.category}: $
                                                {transaction.amount.toFixed(2)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section id="expenses" className="visible">
                            <h2 className="section-heading">Expenses</h2>

                            <div className="mb-3">
                                <input
                                    type="month"
                                    className="form-control my-2"
                                    value={expenseMonth}
                                    onChange={(event) => setExpenseMonth(event.target.value)}
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
                                    placeholder="Category"
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

                                <button className="btn btn-danger w-100" onClick={addExpense}>
                                    Add Transaction
                                </button>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Transaction History</h5>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Category</th>
                                                <th>Amount ($)</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {expenseLikeTransactions.map((transaction) => (
                                                <tr key={transaction.id}>
                                                    <td>{transaction.month}</td>
                                                    <td>{transaction.type}</td>
                                                    <td>{transaction.category}</td>
                                                    <td>${transaction.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
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