import React, { useState } from "react";
// import { EditorState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./forms.css";
import RichTextField from "./RichTextField";

const AskQuestionForm = () => {
  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createEmpty()
  // );

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 welcome-container ask-question-form">
            <div className="ask-header">
              <p>Please fill out the form below to ask a question.</p>
            </div>
            <form className="question-form">
              <label htmlFor="heading-content" className="form-title">
                Heading:
              </label>
              <textarea
                id="heading-content"
                className="heading"
                maxLength={200}
              />
              <label htmlFor="description-content" className="form-title">
                Description:
              </label>
              <RichTextField />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AskQuestionForm;
