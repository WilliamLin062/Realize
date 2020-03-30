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

const db = SQLite.openDatabase("db.db");
function Item({ id, title, selected, onSelect, content }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
        { backgroundColor: selected ? "#6e3b6e" : "#f9c2ff" }
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>
        {content} {console.log("有在做事")}
      </Text>
    </TouchableOpacity>
  );
}

/************************************************************************************** */
export default class HomeCard extends Component {
  state = {
    text: null,
    items: null
  };
  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists diary (id integer primary key not null, date text, title text,content text);",
        [],
        (_, { rows }) => console.log("開啟資料庫成功")
      );
    });
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
      <SafeAreaView style={styles.sectionContainer}>
        <FlatList
          data={items}
          renderItem={({item}) => (
            <Item
              id={item.id}
              title={item.title}
              content={item.content}
            />
          )}
          keyExtractor={item => item.id}
          
        />{console.log(items)}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  fontcolor: {
    color: "#000",
    flex: 1
  },
  container: {
    backgroundColor: "#00DDDD",
    flex: 1,
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
