"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRole = "owner" | "seeker";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    mobile: "",
    role: "seeker" as UserRole,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // clear previous error message

    const url = isLogin ? "/api/login" : "/api/register";
    const serverUrl =
      process.env.SERVER_URL + url || `http://localhost:3001${url}`;

    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Authentication failed");
      }

      const user = await response.json();
      console.log("User:", user);
      localStorage.setItem("user", JSON.stringify(user));
      router.push(user.role === "owner" ? "/owner" : "/seeker");
      // eslint-disable-next-line
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto mt-10 p-6 shadow-lg rounded-2xl border"
    >
      <h1 className="text-2xl font-semibold text-center">
        {isLogin ? "Login" : "Register"}
      </h1>

      {errorMessage && (
        <div className="text-red-500 text-center">{errorMessage}</div>
      )}

      {!isLogin && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Full Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
              placeholder="Mobile Number"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          placeholder="Email address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          placeholder="Password"
        />
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="role">Select Role</Label>
          <Select
            value={form.role}
            onValueChange={(value) =>
              setForm({ ...form, role: value as UserRole })
            }
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Choose role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seeker">Book Seeker</SelectItem>
              <SelectItem value="owner">Book Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full">
        {isLogin ? "Login" : "Register"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => {
          setIsLogin(!isLogin);
          setErrorMessage("");
        }}
      >
        {isLogin ? "Need an account?" : "Already have an account?"}
      </Button>
    </form>
  );
}
