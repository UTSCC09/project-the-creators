import Header from "../components/Header";
import "../styles/HomePage.css";
import logo from "../media/beautiful-natural-environment-digital-painting.jpg";

const HomePage = () => {
  return (
    <>
      <Header />
      <img src={logo} alt="Homepage Pic" className="home-pic" />
    </>
  );
};

export default HomePage;
