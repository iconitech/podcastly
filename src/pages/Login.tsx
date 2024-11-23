import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="pt-24 px-4 pb-16 flex items-center justify-center">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-neutral-800 hover:bg-neutral-700">
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-900 px-2 text-neutral-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="bg-neutral-800 border-neutral-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-neutral-800 border-neutral-700"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
            Sign in
          </Button>
          <p className="text-sm text-neutral-400 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}