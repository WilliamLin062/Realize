import React, { Component } from "react";
import { TextInput } from "react-native";






export class Edit extends Component {
  constructor(props) {
    super(props);
    this.state={
      value:''
    }
  }

  render() {
    return (
      <TextInput
       style={{
        flex:1
       }}
        onChangeText={(value) => this.setState({value})}
        value={this.state.value}
        multiline={true}
      ></TextInput>
    );
  }
}
