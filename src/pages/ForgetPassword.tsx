import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "./AuthLayout";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating an API call delay
    setTimeout(() => {
      // this would call an actual password reset API
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description:
          "If this email exists in our system, you'll receive a password reset link.",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      {!isSubmitted ? (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-md font-medium transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                Sending reset link...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Mail className="h-5 w-5 mr-2" />
                Send reset link
              </div>
            )}
          </Button>

          <div className="mt-8">
            <Button
              variant="ghost"
              className="w-full"
              type="button"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
            <Mail className="mx-auto h-10 w-10 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Check your inbox</h3>
            <p>
              We've sent a password reset link to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="text-sm text-muted-foreground mb-6">
            Didn't receive an email? Check your spam folder or try again with a
            different email address.
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
          >
            Try again
          </Button>

          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Button>
        </motion.div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
