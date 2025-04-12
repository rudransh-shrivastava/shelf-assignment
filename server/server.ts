import express from "express";
import cors from "cors";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: "owner" | "seeker";
};

type Book = {
  id: number;
  title: string;
  author: string;
  genre?: string;
  location: string;
  ownerId: number;
  status: "available" | "rented";
};

let users: User[] = [];
let books: Book[] = [];
let currentId = 1;

const app = express();
app.use(cors());
app.use(express.json());

// Auth Endpoints
app.post("/api/register", (req: any, res: any) => {
  const { name, email, password, mobile, role } = req.body;

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser: User = {
    id: currentId++,
    name,
    email,
    password,
    mobile,
    role,
  };
  users.push(newUser);
  res.json(newUser);
});

app.post("/api/login", (req: any, res: any) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(user);
});

// Book Endpoints
app.get("/api/books", (req, res) => {
  const booksWithOwners = books.map((book) => ({
    ...book,
    owner: users.find((u) => u.id === book.ownerId),
  }));
  res.json(booksWithOwners);
});

app.post("/api/books", (req, res) => {
  const { title, author, genre, location, ownerId } = req.body;

  const newBook: Book = {
    id: currentId++,
    title,
    author,
    genre,
    location,
    ownerId,
    status: "available",
  };

  books.push(newBook);
  res.json(newBook);
});

app.put("/api/books/:id/status", (req: any, res: any) => {
  const bookId = parseInt(req.params.id);
  const { userId } = req.body;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.ownerId !== userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  book.status = book.status === "available" ? "rented" : "available";
  res.json(book);
});

// We expect the owner's ID as a query parameter (e.g., /api/books/3?userId=1)
app.delete("/api/books/:id", (req: any, res: any) => {
  const bookId = parseInt(req.params.id);

  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];
  res.json({ message: "Book deleted", book: deletedBook });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
