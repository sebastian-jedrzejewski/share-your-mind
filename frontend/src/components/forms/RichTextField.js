import React, { useState, useEffect, Component } from "react";
import { ContentState, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertFromHTML, convertToHTML } from "draft-convert";

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

export const RichTextFieldWithContent = ({
  descriptionContent,
  setDescriptionContent,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    let stateFromHTML = require("draft-js-import-html").stateFromHTML;
    let contentState = stateFromHTML(descriptionContent + " ");
    const newState = EditorState.createWithContent(contentState);
    setEditorState(newState);
    setEditorState(EditorState.moveSelectionToEnd(newState));
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
