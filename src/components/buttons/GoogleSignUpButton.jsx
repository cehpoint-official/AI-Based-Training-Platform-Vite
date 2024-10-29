import { Button } from "flowbite-react";
import { auth, googleProvider } from "@/firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import axiosInstance from "@/axios";

const GoogleSignUpButton = ({ text, navigate, showToast }) => {
  const handleGoogleSignIn = async () => {
    try {
      // Ensure the scope for email is added here
      googleProvider.addScope('email');

      // Perform sign-in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // console.log("User object:", user); // Log the entire user object to see its structure

      // Get the email from providerData
      const emailFromGoogle = user.providerData[0]?.email || user.email;

      if (!emailFromGoogle) {
        showToast("Unable to retrieve email from Google. Please try again or use a different sign-in method.");
        return;
      }

      // Proceed with your logic after successful sign-in
      // console.log("User signed in with email:", emailFromGoogle);

      const token = await user.getIdToken(); // Get the user's token
      const postURL = `/api/google/auth`;

      const res = await axiosInstance.post(postURL, {
        token,
        name: user.displayName,
        email: emailFromGoogle, // Use email from Google
      });

      if (res.data.success) {
        // Save user data in session storage
        sessionStorage.setItem("email", res.data.userData.email);
        sessionStorage.setItem("mName", res.data.userData.mName);
        sessionStorage.setItem("auth", true);
        sessionStorage.setItem("uid", res.data.userData.id);
        sessionStorage.setItem("type", res.data.userData.type);
        
        // Navigate to home after successful sign-in
        navigate("/home");
        showToast(res.data.message);
      } else {
        showToast(res.data.message);
      }
      
    } catch (error) {
      // console.error("Google Sign In Error:", error);
      showToast("Error signing in with Google. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent"
    >
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCWKGr_E3qM7B-B-_xwIZyF12n3sK3eM1q5w&s"
        alt="Google"
        className="w-6 h-6 mr-2 rounded-xl"
      />
      {text}
    </Button>
  );
};

export default GoogleSignUpButton;
