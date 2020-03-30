import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity
} from "react-native";
import {
  Card,
  ListItem,
  Button,
  Icon,
  Avatar,
  Header
} from "react-native-elements";
import Constants from "expo-constants";
// implemented without image with header
import * as SQLite from "expo-sqlite";
import { createNativeWrapper } from "react-native-gesture-handler";
import { Item } from "../HomcardItem";

const db = SQLite.openDatabase("db.db");
class Items extends React.Component {
  state = {
    items: null
  };

  componentDidMount() {
    this.update();
  }
  update() {
    db.transaction(tx => {
      tx.executeSql(`select * from diary;`, [], (_, { rows: { _array } }) =>
        this.setState({ items: _array })
      );
    });
  }

  render() {
    const { items } = this.state;
    var i = 0;
    if (items === null) {
      console.log("erro");
      return null;
    }
    return (
      <View style={styles.sectionContainer}>
        <Text style={{}}>HIIIIIIIIIIIIIIsdasdasdIIII</Text>
        {items.map(({ id, content, title }) => {
          <TouchableOpacity
            key={id.toString()}
            style={styles.size}
          > 
            <Text style={{}}>{title} { console.log(id)}</Text>
            <Text style={{}}>{id}</Text>
          </TouchableOpacity>;
        })}
      </View>
    );
  }
}

/************************************************************************************** */
export default class HomeCard extends Component {
  state = {
    text: null
  };
  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists diary (id integer primary key not null, date text, title text,content text);",
        [],
        (_, { rows }) => console.log("開啟資料庫成功")
      );
    });
  }
  update = () => {
    this.todo && this.todo.update();
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.fontcolor}>Diary List{console.log("Text")}</Text>
        <ScrollView style={styles.listArea}>
          <Items/>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  fontcolor: {
    color: "#000",
    flex: 1
  },
  container: {
    backgroundColor: "#008844",
    flex: 1,
    width: 800,
    height: 800,
    paddingTop: Constants.statusBarHeight
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  flexRow: {
    flexDirection: "row"
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8
  },
  listArea: {
    backgroundColor: "#5555FF",
    flex: 1,
    paddingTop: 16
  },
  sectionContainer: {
    backgroundColor: "#FF77FF",
    flex: 1
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8
  },
  size: {
    flex: 1
  }
});
