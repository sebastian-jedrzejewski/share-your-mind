export const Input = ({ type, placeholder }) => {
  return (
    <input
      type={type}
      className="form-control mb-3"
      placeholder={placeholder}
    />
  );
};

export const SubmitButton = ({ text }) => {
  return (
    <div className="d-grid">
      <button type="submit" className="btn btn-primary mb-3">
        {text}
      </button>
    </div>
  );
};

export const ErrorMessage = ({ message }) => {
  return <p style={{ fontSize: "0.9rem", color: "red" }}>{message}</p>;
};
