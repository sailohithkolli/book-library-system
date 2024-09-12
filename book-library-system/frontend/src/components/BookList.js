import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
    }
  }
`;

function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Our Books</h2>
      {data.books.map(({ id, title, author }) => (
        <div key={id}>
          <h3>{title}</h3>
          <p>By {author}</p>
        </div>
      ))}
    </div>
  );
}

export default BookList;