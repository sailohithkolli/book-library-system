import React from 'react';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Book Library</h1>
      </header>
      <main>
        <AddBook />
        <BookList />
      </main>
    </div>
  );
}

export default App;