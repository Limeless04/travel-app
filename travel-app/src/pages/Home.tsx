import { useAuthStore } from "../store/useAuthStore";
import Hero from "../components/Hero";
import BlogList from "../components/BlogList";
import ImageCarousel from "../components/ImageCarousel";

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <main className="flex-grow max-w-full px-4 py-6 sm:px-6 sm:py-8 md:max-w-xl lg:max-w-3xl mx-auto">
        <Hero />
        {/* Image Carousel */}
        <section className="mb-8 w-full px-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">
            Explore Destinations
          </h2>
          <div className="-mx-4 sm:-mx-6 md:-mx-0">
            <ImageCarousel />
          </div>
        </section>

        {isAuthenticated && (
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">
              Yours Articles
            </h2>
            <ul className="space-y-6 sm:space-y-8">
              <BlogList type="user" />
            </ul>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">
            Featured Articles
          </h2>
          <ul className="space-y-6 sm:space-y-8">
            <BlogList type="all" />
          </ul>
        </section>
      </main>

      <footer className="w-full text-center py-4 bg-gray-100 text-gray-500 text-xs sm:text-sm mt-auto shadow-inner fixed bottom-0 left-0">
        &copy; {new Date().getFullYear()} Travel Article Hub. All rights
        reserved.
      </footer>
    </>
  );
};

export default Home;
