import Header from "../components/Header";
import "./HomePage.css";
import logo from "../media/beautiful-natural-environment-digital-painting.jpg";

const HomePage = () => {
  return (
    <>
      <Header />
      <img src={logo} className="home-pic" />
    </>
  );
};

export default HomePage;