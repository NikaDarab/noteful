import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import "./AddNote.css";
import PropTypes from "prop-types";

class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteName: "",
      noteContent: "",
    };
  }
  static contextType = ApiContext;

  handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      name: e.target["note-name"].value,
      content: e.target["note-content"].value,
      folderId: e.target["note-folder-id"].value,
      modified: new Date(),
    };
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((note) => {
        this.context.addNote(note);
        this.props.history.push(`/folder/${note.folderId}`);
      })
      .catch((error) => {
        console.error({ error });
        this.setState({
          error: { error },
        });
      });
  };
  updateNoteName = (newNoteName) => {
    this.setState({
      noteName: newNoteName,
    });
  };

  updateContent = (newContent) => {
    this.setState({
      noteContent: newContent,
    });
  };

  render() {
    const { folders = [] } = this.context;
    const error = this.state.error ? (
      <div className="error">{this.state.error}</div>
    ) : (
      ""
    );

    if (error) {
      return <h1>Error...</h1>;
    } else {
      return (
        <section className="AddNote">
          {error}
          <h2>Create a note</h2>
          <NotefulForm onSubmit={this.handleSubmit}>
            <div className="field">
              <label htmlFor="note-name-input">Name</label>
              <input
                type="text"
                id="note-name-input"
                name="note-name"
                value={this.state.noteName}
                onChange={(e) => this.updateNoteName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="note-content-input">Content</label>
              <textarea
                id="note-content-input"
                name="note-content"
                onChange={(e) => this.updateContent(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="note-folder-select">Folder</label>
              <select
                id="note-folder-select"
                name="note-folder-id"
                onChange={(e) => this.updateContent(e.target.value)}
              >
                <option value={null}>...</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="buttons">
              <button
                type="submit"
                disabled={
                  this.state.noteName.length === 0 ||
                  this.state.noteContent.length === 0
                }
              >
                Add note
              </button>
            </div>
          </NotefulForm>
        </section>
      );
    }
  }
}

AddNote.propType = {
  history: PropTypes.object,
  goback: PropTypes.func,
};

export default AddNote;
