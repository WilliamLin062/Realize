import React, { Component } from "react";
import Setup from "./src/screens/Setup";
import { createStore } from "redux";
import { Provider } from "react-redux";
import DiaryView from "./src/screens/Diary";

export default class App extends Component {
  render() {
    return (

        <Setup />
 
    );
  }
}
