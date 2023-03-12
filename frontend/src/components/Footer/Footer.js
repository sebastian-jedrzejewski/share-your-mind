import "./footer.css";

const Footer = () => {
  return (
    <div id="footer">
      <div className="container">
        <p>
          Sebastian Jędrzejewski - Copyright &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
