import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import PropTypes from "prop-types";
import config from "../config";
import "./AddFolder.css";

class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: "",
    };
  }
  static contextType = ApiContext;

  handleSubmit = (e) => {
    e.preventDefault();
    const folder = {
      name: e.target["folderName"].value,
    };
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(folder),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((folder) => {
        this.context.addFolder(folder);
        this.props.history.push(`/folder/${folder.id}`);
      })
      .catch((error) => {
        console.error({ error });
      });
  };
  updateFolderName = (newForlderName) => {
    this.setState({ folderName: newForlderName });
  };
  render() {
    const error = this.state.error;
    return (
      <section className="AddFolder">
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="folder-name-input">Name</label>
            <input
              type="text"
              id="folder-name-input"
              name="folderName"
              value={this.state.folderName}
              onChange={(e) => this.updateFolderName(e.target.value)}
              required
            />
          </div>
          <div className="buttons">
            <button type="submit" disabled={this.state.folderName.length === 0}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}
AddFolder.PropTypes = {
  history: PropTypes.object,
};
export default AddFolder;
