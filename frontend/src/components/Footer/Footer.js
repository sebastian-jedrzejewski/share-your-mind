import "./footer.css";

const Footer = () => {
  return (
    <div id="footer">
      <div className="container">
        <p>
          Sebastian Jędrzejewski - Copyright &copy; {new Date().getFullYear()}
        </p>
        <p>
          Created my design at{" "}
          <a
            href="https://logomakr.com/app/"
            target={"_blank"}
            rel={"noreferrer"}
          >
            LogoMakr.com/app
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
