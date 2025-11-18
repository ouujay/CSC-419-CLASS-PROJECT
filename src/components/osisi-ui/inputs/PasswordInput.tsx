"use client";

import React, { useState } from "react";
import { cn } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, 'type'> {
  containerClassName?: string;
  iconClassName?: string;
}

export default function PasswordInput({
  containerClassName,
  iconClassName,
  className,
  ...props
}: PasswordInputProps) {
  const [isHidden, setIsHidden] = useState(true);


  function togglePassword() {
    setIsHidden(!isHidden);
  }

  return (

    <div className={cn(" border grid grid-cols-[1fr_auto] rounded overflow-hidden", containerClassName)}>
 
      <Input
        type={isHidden ? "password" : "text"}
        className={cn("outline-none border-none", className)} // Add padding for the icon
        {...props}
      />
      <Button
        type  ="button"
        onClick={togglePassword}
        className={cn(
          "px-4 hover:bg-primary/20  transition-colors bg-transparent rounded-none",
          iconClassName
        )}
        aria-label={isHidden ? "Show password" : "Hide password"}
      >
        {isHidden ? (
          <Eye className="size-4  text-secondary" />
        ) : (
          <EyeClosed className="size-4 text-secondary" />
        )}
      </Button>
    </div>
  );
}













































/**
 * 
 * @returns 



const GetStartedPage = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  function disPlayError(error: any) {
    setMessage(`Login Error: ${error.message}`);
    console.log(`Login Error: ${error.message}`);
    setToastType("error");
    setShowToast(true);
  }
  
  function validatePassword(password="", confirmPassword="") {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    console.log(password !== confirmPassword, password,  confirmPassword);
    
    if (password !== confirmPassword) {
        return {
            validPassword: password,
            error: {message: `Passwords do not match.`},
        };
    }
    if (password.length < minLength) {
        return {
            validPassword: password,
            error: {message: `Password must be at least ${minLength} characters long.`},
        };
    }
    if (!hasUpperCase) {
        return {
            validPassword: password,
            error: {message: "Password must contain at least one uppercase letter."},
        };
    }
    if (!hasLowerCase) {
        return {
            validPassword: password,
            error: {message: "Password must contain at least one lowercase letter."},
        };
    }
    if (!hasNumbers) {
        return {
            validPassword: password,
            error: {message: "Password must contain at least one number."},
        };
    }
    if (!hasSpecialChars) {
        return {
            validPassword: password,
            error: {message: "Password must contain at least one special character."},
        };
    }

    return {validPassword: password, error: null};
}

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const {validPassword, error: passwordError} = validatePassword(password, confirmPassword);

    if (passwordError) {
      disPlayError(passwordError);
      setIsLoading(false)
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: validPassword,
    });
    
    if (signUpError) {
      setMessage(`Sign-up Error: ${signUpError.message}`);
      setToastType("error");
      setShowToast(true);
      return
    } else {
      setMessage("Profile created successfully!");
      navigate("/auth/verify");
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-col justify-between px-4 py-8 max-w-[450px] w-full gap-4"
    >
      <p className="get-started-text xsm:mb-6 md:mb-12 text-gray-dark dark:text-gray-100">
        Let's get started
      </p>
      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">
          Email
        </label>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="account-txt text-dark dark:text-gray-300 text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Log in
          </a>
        </p>
      </div>
      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">
          Password
        </label>
        <div className="relative">
          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <EyeSlashIcon className="size-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <EyeIcon className="size-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-dark dark:text-gray-100 mb-2 text-sm">
          Confirm Password
        </label>
        <div className="relative">
          <input
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#00123A10] dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            type={passwordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <EyeSlashIcon className="size-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <EyeIcon className="size-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>
      <button
        className={`flex items-center justify-center bg-accent-green text-white w-full font-medium py-2 px-6 rounded-lg hover:scale-95 duration-300 ${isLoading? "opacity-50": ""}`}
        type="submit"
        disabled={isLoading}
      >
        <span>{isLoading? "Loading...": "Sign Up"}</span>
      </button>
      {showToast && (
        <Toast message={message} type={toastType} onClose={handleCloseToast} />
      )}
    </form>
  );
};

export default GetStartedPage;

    */