import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Budget.css";

export default function Budget() {
  // 🌟 States
  const [totalBudget, setTotalBudget] = useState(50000);
  const [allocations, setAllocations] = useState({
    Flights: 10000,
    Stay: 15000,
    Food: 8000,
    Transport: 5000,
    Activities: 7000,
    Shopping: 5000,
  });
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "Food",
    amount: "",
    note: "",
  });

  // 🧮 Computed
  const totalSpent = expenses.reduce((sum, e) => sum + parseInt(e.amount || 0), 0);
  const remaining = totalBudget - totalSpent;

  // 🎨 Chart Data
  const pieData = Object.keys(allocations).map((cat) => ({
    name: cat,
    value: allocations[cat],
  }));

  const COLORS = ["#9B5DE5", "#F15BB5", "#00E1FF", "#FFD700", "#98FF98", "#FB7185"];

  const barData = expenses.map((e, i) => ({
    name: e.category,
    amount: parseInt(e.amount),
  }));

  // ➕ Add Expense
  const addExpense = (e) => {
    e.preventDefault();
    if (!newExpense.amount) return;
    setExpenses([...expenses, newExpense]);
    setNewExpense({ category: "Food", amount: "", note: "" });
  };

  return (
    <section className="budget-page">
      <h1 className="budget-title">💰 Wanderly Budget Dashboard</h1>
      <p className="budget-subtitle">
        Plan smart, spend wisely, and make every trip magical ✨
      </p>

      {/* 🌈 Three Cards in One Row */}
      <div className="budget-dashboard">
        {/* 🧭 PLAN CARD */}
        <div className="budget-card">
          <h2>🧭 Plan Your Trip Budget</h2>
          <div className="plan-content">
            <div className="budget-plan-inputs">
              <div>
                <label>Total Budget (₹):</label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                />
              </div>

              {Object.keys(allocations).map((cat) => (
                <div key={cat}>
                  <label>{cat}:</label>
                  <input
                    type="number"
                    value={allocations[cat]}
                    onChange={(e) =>
                      setAllocations({
                        ...allocations,
                        [cat]: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="plan-chart">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 💸 TRACK CARD */}
        <div className="budget-card">
          <h2>💸 Track Your Expenses</h2>
          <form onSubmit={addExpense} className="expense-form">
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
            >
              {Object.keys(allocations).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Note"
              value={newExpense.note}
              onChange={(e) =>
                setNewExpense({ ...newExpense, note: e.target.value })
              }
            />
            <button type="submit" className="btn-glow">
              Add Expense
            </button>
          </form>

          <ul className="expense-list">
            {expenses.map((e, i) => (
              <li key={i}>
                <span>{e.category}</span> — ₹{e.amount} <em>{e.note}</em>
              </li>
            ))}
            {expenses.length === 0 && (
              <p className="empty-text">No expenses added yet ✨</p>
            )}
          </ul>
        </div>

        {/* 📊 ANALYTICS CARD */}
        <div className="budget-card">
          <h2>📊 Analyze & Insights</h2>
          <div className="analytics-stats">
            <p>💸 Total Budget: ₹{totalBudget}</p>
            <p>🧾 Spent: ₹{totalSpent}</p>
            <p>💜 Remaining: ₹{remaining}</p>
            {remaining <= totalBudget * 0.1 && (
              <p className="alert-text">⚠️ You’re nearing your budget limit!</p>
            )}
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="amount" fill="#9B5DE5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
