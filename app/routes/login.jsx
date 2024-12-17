// NikeSignInForm.js
import { Form, useActionData, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { getSession, commitSession } from "../utils/cookies";
import { loginUser } from "../utils/api";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
console.log(email,password)
  try {
    const response = await loginUser({ email, password });
    const { success, message, user, token } = response;

    if (success) {
      // Create session
      const session = await getSession(request.headers.get("Cookie"));
      session.set("userId", user.userId);
      session.set("token", token); // Store the token
      session.set("user", user); // Store user info if needed

      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } else {
      throw new Error(message);
    }
  } catch (error) {
    const session = await getSession(request.headers.get("Cookie"));
    session.flash("error", "Invalid username/password");

    return json(
      { error: "Invalid username/password" },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
        status: 400,
      }
    );
  }
};

const NikeSignInForm = () => {
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error, { position: "top-center", autoClose: 3000 });
    }
  }, [actionData]);

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold mb-2">Sign In to Your Nike Account</h2>
      <Form method="post" aria-describedby="form-error">
        {actionData?.error && (
          <div id="form-error" className="mb-4 text-red-600 text-sm" role="alert">
            {actionData.error}
          </div>
        )}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address*"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password*"
            autoComplete="current-password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-800 transition duration-200"
        >
          Sign In
        </button>
      </Form>
      <div className="mt-6 text-center">
        <p className="text-sm">Not a member? <a href="/sign-up" className="text-blue-600">Join Us</a></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NikeSignInForm;
