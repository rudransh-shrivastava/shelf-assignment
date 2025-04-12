"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Book = {
  id: number;
  title: string;
  author: string;
  location: string;
  owner: {
    name: string;
    email: string;
  };
  status: "available" | "rented";
};

export default function SeekerPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  // eslint-disable-next-line
  const [user, setUser] = useState<any>(null);

  // Ensure the code runs only on the client, fetch user from localStorage and redirect if not valid.
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser.role !== "seeker" && storedUser.role !== "owner") {
      router.push("/login");
      return;
    } else {
      setUser(storedUser);
    }
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBooks = async () => {
    const url = "/api/books";
    const serverUrl =
      process.env.SERVER_URL + url || `http://localhost:3001${url}`;
    const res = await fetch(serverUrl);
    setBooks(await res.json());
  };

  // Filter books based on search term (by title or location).
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      {/* Dashboard Header and Search Field */}
      <Card className="mb-6 p-4">
        <CardHeader>
          <CardTitle>Seeker Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search" className="sr-only">
              Search by title or location
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search by title or location"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      <div className="grid gap-4">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="p-4">
            <CardHeader>
              <CardTitle>
                {book.title} by {book.author}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Location: {book.location}</p>
              <p>
                Owner: {book.owner?.name} ({book.owner?.email})
              </p>
              <p>Status: {book.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
