import React, { useState, useEffect } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./forms.css";

const toolbarOptions = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "textAlign",
    "link",
    "emoji",
  ],
  inline: {
    options: ["bold", "italic", "underline", "monospace"],
  },
  blockType: {
    options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote"],
  },
  fontSize: { options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36] },
  list: { options: ["ordered", "unordered"], inDropdown: true },
  textAlign: { inDropdown: true },
  link: { inDropdown: true },
  history: { inDropdown: true },
};

const RichTextField = ({ descriptionContent, setDescriptionContent }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (descriptionContent === "") {
      setEditorState(EditorState.createEmpty());
    }
  }, [descriptionContent]);

  const onEditorStateChange = (editorState) => {
    let html = convertToHTML(editorState.getCurrentContent());
    setDescriptionContent(html);
    setEditorState(editorState);
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      toolbar={toolbarOptions}
      wrapperClassName="wrapper-class"
      editorClassName="editor-class"
      toolbarClassName="toolbar-class"
    />
  );
};

export default RichTextField;
