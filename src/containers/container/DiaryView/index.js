import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");
export default class DiaryView extends React.Component {
  state = {
    text: null,
    items: null,
    refreshing: false,
    seed: 1,
  };
  updateTimer() {
    this.timer1 = setInterval(() => {
      console.log("DIARY的");
      this.update();
    }, 5000);
  }
  componentDidMount() {
    //               here to get Data
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists diary (id integer primary key not null, date text, title text,content text);",
        [],
        (_, { rows }) => console.log("開啟資料庫成功")
      );
    });
    this.getData();
  //  this.updateTimer();
  }
  //               here to unSub
  componentWillUnmount() {
    this.timer1 && clearInterval(this.timer1);
    console.log("Unmounted");
  }
  // data
  update() {
    db.transaction((tx) => {
      tx.executeSql(`select * from diary where id = ?;`, [6], (_, { rows: { _array } }) =>
        this.setState({ items: _array })
      );
    });
    this.setState(
      {
        refreshing: false,
      },
      console.log("update")
    );
  }
  getData() {
    db.transaction((tx) => {
      tx.executeSql(`select * from diary where id = ?;`, [6], (_, { rows: { _array } }) =>
        this.setState({ items: _array })
      );
    });
  }
  // reFresh

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      (e) => {
        this.update();
      }
    );
  };
  //render

  render() {
    const { items } = this.state;
    /* if (items === null || items.length === 0) {
      return null;
    }*/
    return (
      <View>
        <SafeAreaView
          onPress={() => this.props.onPressItem && this.props.onPressItem(id)}
        >
          <Text style={{}}>{this.state.title}</Text>
          <Text style={{}}>{this.state.content}</Text>
        </SafeAreaView>
      </View>
    );
  }
}
