import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");
import {
  ScreenWidth,
  ScreenHeight,
  StreamColor,
  TitleColor,
} from "../../utils";
export default class DiaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      text: null,
      items: null,
    };
  }

  updateTimer() {
    this.timer1 = setTimeout(() => {
      console.log("更新囉");
      this.getData();
      this.Diary();
      console.log("資料" + "  " + this.state.items);
    }, 1000);
  }
  async componentDidMount() {
    const { params } = this.props.route;
    this.setState({ id: params.cardId });
    //  alert(this.state.items);
    //               here to get Data
    await db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists diary (id integer primary key not null, date text, title text,content text);",
        [this.state.id],
        (_, { rows }) => console.log("開啟資料庫成功")
      );
    });
    await this.getData();
    this.updateTimer();
  }
  //               here to unSub
  componentWillUnmount() {
    this.timer1 && clearInterval(this.timer1);
    console.log("Unmounted");
  }
  getData() {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from diary where id=?;`,
        [this.state.id],
        (_, { rows: { _array } }) => this.setState({ items: _array })
      );
    });
    console.log("get" + this.state.items);
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
  Diary() {
    const { items } = this.state;
    console.log("diary    " + items);
    console.log("---------------------");
    const item = JSON.stringify(items, { content: "content" }, 1);
    const title = items.map((item) => Object.values(item)[2]);
    const content = items.map((item) => Object.values(item)[3]);
    console.log("---------------------");
    console.log("測試取直" + "  " + content);
    console.log("測試取直" + "  " + title);
    // console.log("測試取直" + "  " + item);
    this.setState({ content: content, title: title });
  }
  //render
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView
          onPress={() => this.props.onPressItem && this.props.onPressItem(id)}
          style={styles.container}
        >
          <View style={styles.title}>
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>
              {this.state.title}
            </Text>
          </View>
          <ScrollView style={styles.content}>
            <View >
              <Text style={{ marginLeft: 5, fontWeight: "100", fontSize: 18 }}>
                {this.state.content}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: ScreenHeight,
    width: ScreenWidth,
    elevation: 5,
  },
  title: { alignItems: "center", elevation: 5, marginTop: 5, marginBottom: 5 },
  content: {
    backgroundColor: "#ffffff",
    margin: 10,
    borderRadius: 20,
    minHeight: ScreenHeight,
  },
});
