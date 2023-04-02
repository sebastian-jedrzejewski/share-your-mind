import "./container.css";
import question from "../../assets/question.png";
import answer from "../../assets/answer.png";
import helpOthers from "../../assets/help_others.png";
import post from "../../assets/post.png";
import learn from "../../assets/learn.png";
import note from "../../assets/note.png";
import poll from "../../assets/poll.png";
import peopleVotes from "../../assets/people_votes.png";
import vote from "../../assets/vote.png";
import { ErrorMessage } from "../forms/FormControls";

const questionsSection = {
  title: "Questions",
  link: "/questions",
  images: [question, answer, helpOthers],
  headings: [
    "Ask a Question",
    "Wait for an Answer",
    "Answer to existing Questions",
  ],
  hasError: false,
};

const blogsSection = {
  title: "Blog Posts",
  link: "/blog_posts",
  images: [post, learn, note],
  headings: [
    "Find an interesting Post",
    "Learn new things",
    "Write your own Post",
  ],
  hasError: true,
};

const pollsSection = {
  title: "Polls",
  link: "/polls",
  images: [poll, peopleVotes, vote],
  headings: ["Create a Poll", "See how people vote", "Vote in existing Polls"],
  hasError: true,
};

const WelcomeContainer = () => {
  return (
    <div className="container welcome-container">
      <h1>Welcome to ShareYourMind!</h1>
      <p>
        Do you like learning new things? Do you need an answer to your question?
        Do you want to share knowledge with others? If that's true, you are in
        the right place! At our site you will find a lot of questions, blog
        posts or polls. If you are logged in, you have all of these
        functionalities available. Everything is splitted into categories so you
        won't have difficultities with finding content related to your
        interests. Get to know with information below and join our community!
      </p>
      <br />
      <hr></hr>

      <ContentSection {...questionsSection} />
      <br />
      <hr></hr>

      <ContentSection {...blogsSection} />
      <br />
      <hr></hr>

      <ContentSection {...pollsSection} />
    </div>
  );
};

const ContentSection = ({ title, link, images, headings, hasError }) => {
  return (
    <section>
      <h1 className="section-title">{title}</h1>
      <div className="content">
        <div className="row">
          <div className="col-md-4">
            <img
              src={images[0]}
              alt="First heading"
              className="bodyimage"
            ></img>
            <h2 className="content-heading">{headings[0]}</h2>
          </div>
          <div className="col-md-4">
            <img
              src={images[1]}
              alt="Second heading"
              className="bodyimage"
            ></img>
            <h2 className="content-heading">{headings[1]}</h2>
          </div>
          <div className="col-md-4">
            <img
              src={images[2]}
              alt="Third heading"
              className="bodyimage"
            ></img>
            <h2 className="content-heading">{headings[2]}</h2>
          </div>
        </div>
        <a href={link}>
          <button className="btn btn-default btn-lg link-button" role="link">
            {title} Section
          </button>
        </a>
        {hasError && (
          <ErrorMessage message="NOTE: access only for users with account" />
        )}
      </div>
    </section>
  );
};

export default WelcomeContainer;
