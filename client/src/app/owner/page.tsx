"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Book = {
  id: number;
  title: string;
  author: string;
  genre?: string;
  location: string;
  ownerId: number;
  status: "available" | "rented";
};

export default function OwnerPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
  });
  // eslint-disable-next-line
  const [user, setUser] = useState<any>(null);

  // Load user from localStorage on mount and redirect if the user is not an owner.
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser || storedUser.role !== "owner") {
      router.push("/login");
    } else {
      setUser(storedUser);
      fetchBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBooks = async () => {
    const url = "/api/books";
    const serverUrl = process.env.SERVER_URL
      ? process.env.SERVER_URL + url
      : `http://localhost:3001${url}`;
    const res = await fetch(serverUrl);
    let resBooks = await res.json();

    // Remove all books that dont match the current user's ID
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    // eslint-disable-next-line
    resBooks = resBooks.filter((book: any) => {
      if (book.ownerId === storedUser.id) {
        return true;
      }
      return false;
    });
    setBooks(resBooks);
  };

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await fetch("http://localhost:3001/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newBook, ownerId: user.id }),
    });
    fetchBooks();
    setNewBook({ title: "", author: "", genre: "", location: "" });
  };

  const toggleStatus = async (bookId: number) => {
    if (!user) return;

    await fetch(`http://localhost:3001/api/books/${bookId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    fetchBooks();
  };

  const deleteBook = async (bookId: number) => {
    await fetch(`http://localhost:3001/api/books/${bookId}`, {
      method: "DELETE",
    });
    fetchBooks();
  };

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Owner Dashboard</CardTitle>
        </CardHeader>
      </Card>

      {/* Add Book Form */}
      <Card className="mb-6 p-4">
        <form onSubmit={addBook} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Book Title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Author Name"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              placeholder="Genre"
              value={newBook.genre}
              onChange={(e) =>
                setNewBook({ ...newBook, genre: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Location"
              value={newBook.location}
              onChange={(e) =>
                setNewBook({ ...newBook, location: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Book
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id} className="p-4">
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">by {book.author}</p>
              <p className="text-sm">Location: {book.location}</p>
              <p className="text-sm">Status: {book.status}</p>
            </CardContent>
            {user && book.ownerId === user.id && (
              <div className="flex gap-2 p-4">
                <Button size="sm" onClick={() => toggleStatus(book.id)}>
                  Mark as {book.status === "available" ? "Rented" : "Available"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteBook(book.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
