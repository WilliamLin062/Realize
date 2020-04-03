import React, { Component } from "react";
import { View, TextInput, Text, Button } from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { ScrollView } from "react-native-gesture-handler";

const db = SQLite.openDatabase("db.db");

export class Edit extends Component {
  static navigationOptions = {
    mode: "modal",
    gesturesEnabled: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      title: "",
      content: "",
      date: new Date(),
      selected: false,
    };
  }

  componentDidMount() {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists diary (id integer primary key not null, date text, title text,content text);"
      );
      tx.executeSql("select * from diary", [], (_, { rows: { _array } }) =>
        console.log(JSON.stringify(_array))
      );
    });
  }

  add = (text) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }
    db.transaction((tx) => {
      tx.executeSql("insert into diary (content,title) values (?,?)", [
        this.state.content,this.state.title 
      ]);
      tx.executeSql(
        "select * from diary order by content",
        [],
        (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
      );
    });
  };

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <Text>標題</Text>
        <TextInput
          style={{}}
          maxLength={40}
          onChangeText={(title) => this.setState({ title })}
          value={this.state.title}
        />
        <Text>內容</Text>
        <TextInput
          style={{
            flex: 1,
            height:300
          }}
          maxLength={2000}
          onChangeText={(content) => this.setState({ content })}
          value={this.state.content}
          textAlignVertical={"top"}
          multiline={true}
          keyboardAppearance={"light"}
        />
        <Button
          title="存檔"
          onPress={(e) => {
            this.add(this.state.content,this.state.title,this.state.date);
            console.log("存檔");
          }}
        />
      </ScrollView>
    );
  }
}
