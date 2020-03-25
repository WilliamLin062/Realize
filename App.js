import React, { Component } from "react";
import Setup from "./src/screens/Setup";
import { createStore } from "redux";
import { Provider } from "react-redux";

export default class App extends Component {
  render() {
    return (

        <Setup />
 
    );
  }
}
