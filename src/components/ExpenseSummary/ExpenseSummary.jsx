import React, { useState } from 'react';
import BackButton from '../common/BackButton';
import './ExpenseSummary.css';

const ExpenseSummary = ({ expenses }) => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredExpenses = (expenses || []).filter(expense => {
    if (!showDateFilter) return true;

    const expenseDate = new Date(expense.date);
    const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

    if (start && end) {
      return expenseDate >= start && expenseDate <= end;
    } else if (start) {
      return expenseDate >= start;
    } else if (end) {
      return expenseDate <= end;
    }
    return true;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="summary-container">
      <BackButton />
      <h2>Expense Summary</h2>
      
      <button 
        className="filter-toggle-button"
        onClick={() => setShowDateFilter(!showDateFilter)}
      >
        {showDateFilter ? 'Show All Expenses' : 'Filter by Date'}
      </button>
      
      <div className={`date-filter ${showDateFilter ? 'show' : 'hide'}`}>
        <div className="filter-group">
          <label>From:</label>
          <input
            type="date"
            name="startDate"
            value={dateFilter.startDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="filter-group">
          <label>To:</label>
          <input
            type="date"
            name="endDate"
            value={dateFilter.endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-label">Total Expenses:</span>
          <span className="stat-value">₹{totalAmount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Number of Transactions:</span>
          <span className="stat-value">{filteredExpenses.length}</span>
        </div>
      </div>

      <div className="expense-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? filteredExpenses.map(expense => (
              <tr key={expense._id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>₹{expense.amount}</td>
                <td>{expense.reason}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="no-data">
                  {showDateFilter ? 'No expenses found for selected date range' : 'No expenses recorded yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseSummary; 