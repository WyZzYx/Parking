"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileClient({ session: initialSession }: { session: Session | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(initialSession?.user?.name || "");
  const [carPlate, setCarPlate] = useState(initialSession?.user?.carPlate || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setCarPlate(session.user.carPlate || "");
    }
  }, [session]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Sign-in failed",
          description: "Please check your credentials and try again.",
        });
      } else {
        toast({
          title: "Signed in successfully!",
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, carPlate }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      router.refresh();

      toast({
        title: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeSession = session ?? initialSession;

  if (status === "loading" && !activeSession) {
    return <p>Loading session...</p>;
  }

  if (!activeSession) {
    return (
      <div className="text-center">
        <form onSubmit={handleSignIn} className="space-y-4">
          <h2 className="text-2xl font-semibold">Sign In</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in.
          </p>
          <div>
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="password" className="sr-only">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Your role: {activeSession.user?.role}
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="carPlate">Default Car Plate</Label>
          <Input
            id="carPlate"
            value={carPlate}
            onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
            className="uppercase"
            placeholder="ABC-123"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleUpdateProfile} disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button onClick={() => signOut({ callbackUrl: '/' })} variant="outline" className="flex-1">
          Sign Out
        </Button>
      </div>
      {activeSession.user?.role === 'ADMIN' && (
        <div className="mt-4">
          <Link href="/admin" passHref>
            <Button className="w-full" variant="secondary">Admin Panel</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
