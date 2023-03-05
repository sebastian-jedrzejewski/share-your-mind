import useFetchUser from "../hooks/useFetchUser";

const HomePage = () => {
  const { user, isLoading } = useFetchUser();

  if (isLoading) {
    return null;
  } else if (user?.username) {
    return <h1>{`Hi, ${user.username}!`}</h1>;
  } else {
    return (
      <h1>
        You can login <a href="/login">here</a>
      </h1>
    );
  }
};

export default HomePage;
