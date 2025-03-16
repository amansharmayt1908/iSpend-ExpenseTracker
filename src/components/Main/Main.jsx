import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseSummary from '../ExpenseSummary/ExpenseSummary';
import BackButton from '../common/BackButton';
import './Main.css';

const Main = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/');
      return;
    }
    
    // Fetch expenses
    fetchExpenses();
  }, [user, navigate]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`/api/expenses/${user._id}`);
      const data = await response.json();
      if (response.ok) {
        console.log('Fetched expenses:', data); // Debug log
        setExpenses(data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newExpense.amount || !newExpense.reason) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          amount: Number(newExpense.amount),
          reason: newExpense.reason
        }),
      });

      if (response.ok) {
        // Clear form and refresh expenses
        setNewExpense({ amount: '', reason: '' });
        fetchExpenses();
      } else {
        setError('Failed to add expense');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Add expense error:', err);
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove expense from state
        setExpenses(expenses.filter(expense => expense._id !== expenseId));
      } else {
        setError('Failed to delete expense');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Delete expense error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="main-container">
      <BackButton />
      <button 
        className="summary-toggle-button"
        onClick={() => setShowSummary(!showSummary)}
      >
        {showSummary ? 'Hide Summary' : 'Show Summary'}
      </button>
      
      {showSummary ? (
        <ExpenseSummary expenses={expenses || []} />
      ) : (
        <div className="expense-form">
          <h2>Add New Expense</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="reason"
                placeholder="Reason"
                value={newExpense.reason}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="add-button">
              Add Expense
            </button>
          </form>
        </div>
      )}

      {!showSummary && (
        <div className="expenses-list">
          <h2>Your Expenses</h2>
          {expenses.map(expense => (
            <div key={expense._id} className="expense-item">
              <div className="expense-amount">₹{expense.amount}</div>
              <div className="expense-reason">{expense.reason}</div>
              <div className="expense-date">
                {new Date(expense.date).toLocaleDateString()}
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(expense._id)}
                disabled={isDeleting}
              >
                ×
              </button>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="no-expenses">No expenses recorded yet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Main; 