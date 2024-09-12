import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!) {
    addBook(title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const [addBook, { data, loading, error }] = useMutation(ADD_BOOK, {
    refetchQueries: [
      'GetBooks', // This is the name of the query in BookList.js
    ],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook({ variables: { title, author } });
    setTitle('');
    setAuthor('');
  };

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  return (
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;