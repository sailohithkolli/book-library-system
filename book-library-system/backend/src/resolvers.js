const oracledb = require('oracledb');

const resolvers = {
  Query: {
    books: async (_, __, { connection }) => {
      const result = await connection.execute('SELECT * FROM books');
      return result.rows.map(row => ({
        id: row[0],
        title: row[1],
        author: row[2],
        createdAt: row[3]
      }));
    },
    book: async (_, { id }, { connection }) => {
      const result = await connection.execute('SELECT * FROM books WHERE id = :id', [id]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        id: row[0],
        title: row[1],
        author: row[2],
        createdAt: row[3]
      };
    }
  },
  Mutation: {
    addBook: async (_, { title, author }, { connection }) => {
      const result = await connection.execute(
        'INSERT INTO books (title, author) VALUES (:title, :author) RETURNING id INTO :id',
        { title, author, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } },
        { autoCommit: true }
      );
      const id = result.outBinds.id[0];
      return { id, title, author, createdAt: new Date().toISOString() };
    },
    updateBook: async (_, { id, title, author }, { connection }) => {
      const updates = [];
      const binds = { id };
      if (title) {
        updates.push('title = :title');
        binds.title = title;
      }
      if (author) {
        updates.push('author = :author');
        binds.author = author;
      }
      if (updates.length === 0) throw new Error('No updates provided');
      
      await connection.execute(
        `UPDATE books SET ${updates.join(', ')} WHERE id = :id`,
        binds,
        { autoCommit: true }
      );
      
      const result = await connection.execute('SELECT * FROM books WHERE id = :id', [id]);
      if (result.rows.length === 0) throw new Error('Book not found');
      const row = result.rows[0];
      return {
        id: row[0],
        title: row[1],
        author: row[2],
        createdAt: row[3]
      };
    },
    deleteBook: async (_, { id }, { connection }) => {
      const result = await connection.execute(
        'DELETE FROM books WHERE id = :id',
        [id],
        { autoCommit: true }
      );
      return result.rowsAffected > 0;
    }
  }
};

module.exports = resolvers;