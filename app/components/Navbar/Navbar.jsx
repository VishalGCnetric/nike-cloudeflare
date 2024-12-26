import { useState } from "react";
import { FaBars, FaRegHeart, FaUser } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import { Link, useNavigate, useLocation, useLoaderData, Form } from "@remix-run/react";
import Dropdown from "./Dropdown";
import { Lists } from "./navlist"; // Adjust the path as per your project structure
import { ToastContainer } from "react-toastify";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const { token } = useLoaderData();

  const handleLogout = () => {
    // Perform logout logic here
  };

  return (
    <header className="bg-white shadow-sm">
      <ToastContainer />
      <nav className="flex justify-between mx-10 border-b-gray-100 items-center p-1 bg-background">
        <div></div>
        <div className="space-x-4 flex">
          <Link className="text-muted-foreground hover:text-primary">Find a Store</Link>
          <Link className="text-muted-foreground hover:text-primary">Help</Link>
          
          {token ? (
            <Form method="post" onSubmit={handleLogout}>
              <button
                type="submit"
                className="text-black w-10 rounded"
              >
                Logout
              </button>
            </Form>
          ) : (
            <>
              <Link className="text-muted-foreground hover:text-primary">Join Us</Link>
              <Link
                to="/login"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="container mx-auto h-20 flex items-center justify-between px-2 lg:px-2">
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer space-x-4"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => (e.key === 'Enter' ? navigate("/") : null)} // Keyboard support
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
            alt="Nike Logo"
            className="h-10 w-10"
          />
        </div>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {Lists.map((el, index) => (
            <div key={index} className="relative">
              <div
                className="text-gray-800 cursor-pointer hover:text-gray-500 transition duration-150"
                onMouseEnter={() => setOpenDropdown(el.name)}
                onMouseLeave={() => setOpenDropdown(null)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => (e.key === 'Enter' ? setOpenDropdown(el.name) : null)} // Keyboard support
              >
                {el.name}
              </div>
              {openDropdown === el.name && (
                <Dropdown sections={el.dropdownList} />
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {location.pathname !== "/search" && (
            <div className="relative">
              <input
                type="text"
                className="border rounded-full py-1 px-4 pl-8 text-gray-800 focus:outline-none focus:border-gray-500 transition duration-150"
                placeholder="Search"
                onClick={() => navigate("/search")}
              />
              <GoSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          )}
          <FaRegHeart className="h-6 w-6 text-gray-800 cursor-pointer" />
          <BsCart
            onClick={() => navigate("/cart")}
            className="h-6 w-6 text-gray-800 cursor-pointer"
          />
          <FaUser
            onClick={() => navigate("/profile")}
            className="h-6 w-6 text-gray-800 cursor-pointer"
          />
        </div>

        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="text-gray-800 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
              alt="Nike Logo"
              className="h-10 w-10"
            />
            <button
              type="button"
              className="text-gray-800 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <nav className="space-y-4">
            {Lists.map((item, index) => (
              <div key={index}>
                <Link
                  to="#" // Consider changing this to a valid route
                  className="block text-gray-800 hover:text-gray-500 transition duration-150"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded-full py-1 px-4 pl-8 text-gray-800 focus:outline-none focus:border-gray-500 transition duration-150"
                placeholder="Search"
              />
              <GoSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
