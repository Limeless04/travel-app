import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

const Hero = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCreateArticle = () => {
    navigate("/articles/create");
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-blue-50 p-8 rounded-lg shadow mb-8">
      <div className="flex-1 mb-6 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
          {isAuthenticated ? `Hello, ${user?.username}!` : "Welcome to Travel Article Hub!"}
        </h1>
        <p className="text-gray-600 text-lg">
          {isAuthenticated
            ? "Ready to share your travel experiences?"
            : "Sign in to start sharing your travel stories and tips!"}
        </p>
      </div>
      <div className="flex-1 flex justify-center md:justify-end">
        <button
          onClick={handleCreateArticle}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={!isAuthenticated}
        >
          Create Article
        </button>
      </div>
    </section>
  );
};

export default Hero;