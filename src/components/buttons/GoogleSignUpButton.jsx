import { Button } from "flowbite-react";
import { auth, googleProvider } from "@/firebase/firebaseConfig";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import axiosInstance from "@/axios";
import { useEffect } from "react";

const GoogleSignUpButton = ({ text, navigate, showToast }) => {
  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google Sign In process");
      console.log("Auth object:", auth);
      console.log("Google Provider object:", googleProvider);

      // Ensure the provider is correctly set up
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      // Redirect to Google sign-in page
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign In Error:", error);
      showToast(
        error.message || "Error signing in with Google. Please try again."
      );
    }
  };

  // Handle the result of the redirect
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;

          // Validate essential user data
          if (!user) {
            showToast("Failed to get user data from Google");
            return;
          }

          const emailFromGoogle = user.email;
          const displayName = user.displayName;
          const photoURL = user.photoURL;
          const uid = user.uid;

          // Validate required fields
          if (!emailFromGoogle || !displayName || !uid) {
            showToast("Missing required user information from Google");
            return;
          }

          const token = await user.getIdToken();
          const postURL = "/api/google/auth";

          const res = await axiosInstance.post(postURL, {
            token,
            name: displayName,
            email: emailFromGoogle,
            googleProfileImage: photoURL || "",
            uid: uid,
          });

          if (res.data.success && res.data.userData) {
            const userData = res.data.userData;
            if (!userData.email || !userData.mName || !userData.id) {
              showToast("Incomplete user data received from server");
              return;
            }

            // Store user data in session
            sessionStorage.setItem("email", userData.email);
            sessionStorage.setItem("mName", userData.mName);
            sessionStorage.setItem("profile", userData.profile || photoURL || "");
            sessionStorage.setItem("auth", "true");
            sessionStorage.setItem("uid", userData.id);
            sessionStorage.setItem("type", userData.type || "user");

            navigate("/home");
            showToast(res.data.message || "Successfully signed in!");
          } else {
            showToast(res.data.message || "Sign in failed. Please try again.");
          }
        }
      } catch (error) {
        console.error("Redirect result error:", error);
        showToast(
          error.message || "Error handling redirect result. Please try again."
        );
      }
    };

    handleRedirectResult();
  }, [navigate, showToast]);

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