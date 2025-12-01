import React from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { signUp } from "../lib/api.js";
const SignUpPage = () => {
  const [signupData, setSignupData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: signUpMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutate(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div
        className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl 
      mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Left Side - sign up form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-fomo bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              K.Chatterly
            </span>
          </div>
          {/*Error message */}
          {error && (
            <div className="text-sm alert alert-error mb-4 ">
              <span>{error.response.data.message}</span>
            </div>
          )}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-semibold mb-2">Sign Up</h2>
                  <p className="text-sm text-gray-500">
                    Join K.Chatterly today! Create your account to start
                  </p>
                </div>
                <div className="space-y-3">
                  {/* Full Name Input */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* Email Input */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                      required
                    ></input>
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="*******"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    ></input>
                    <p className="text-xs opacity-70 mt-1">
                      Must be at least 6 characters.
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                  <button className="btn btn-primary w-full" type="submit">
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner"></span>
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-primary hover:underline"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/call.svg"
                alt="Signup Illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-2xl font-semibold">Connect with Friends</h2>
              <p className="text-sm text-gray-400">
                Join K.Chatterly and start connecting with friends and family
                today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
