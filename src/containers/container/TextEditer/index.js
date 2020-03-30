import React, { Component } from "react";
import { View, TextInput, Text, Button } from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  componentDidMount() {
    db.transaction(
      tx => {
        tx.executeSql(
          "create table if not exists diary (id integer primary key not null, date text, title text,content text);"
        );
        tx.executeSql(
          "select * from diary",
          [],
          (_,{rows}) => console.log(JSON.stringify(rows))
        );
      }
    );
  }
  componentDidUpdate(prevProps) {
    // 常見用法（別忘了比較 prop）：
    if (this.props.userID !== prevProps.userID) {
      this.fetchData(this.props.userID);
      this.setState(text, text => {
        text = null;
      });
      tx.executeSql(
        "create table if not exists diary (id integer primary key not null, date text, title text,content text);"
      );
    }
  }

  add = (text) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }
    db.transaction(tx => {
      tx.executeSql("insert into diary (content) values (?)", [text]);
      tx.executeSql(
        "select * from diary order by content",
        [],
        (_,{rows}) => console.log(JSON.stringify(rows))
      );
    })
  };
  logout(text) {
    Console(JSON.stringify(text));
  }
  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <Text>title</Text>
        <TextInput
          style={{
            flex: 1
          }}
          maxLength={40}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          multiline={false}
          keyboardAppearance={"light"}
          /*        onSubmitEditing={() => {
            this.add(this.state.text);
          }}*/
        />
        <Button
          title="存檔"
          onPress={() => {
            this.add(this.state.text);
            console.log("存檔");
          }}
        />
      </View>
    );
  }
}
