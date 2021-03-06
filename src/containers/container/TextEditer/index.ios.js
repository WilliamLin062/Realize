import React, { Component } from "react";
import {
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { ScrollView } from "react-native-gesture-handler";
// Utils
import {
  ScreenWidth,
  ScreenHeight,
  StreamColor,
  TitleColor,
  BackDefaultColor,
} from "../../../utils";
import * as RootNavigation from "../../../screens/RootNavigation";
import { SearchBar } from "react-native-elements";
const db = SQLite.openDatabase("db.db");
export class Edit extends Component {
  static navigationOptions = {
    headerTitleAlign: "center",
    gesturesEnabled: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: 0,
      items: null,
      text: "",
      title: "",
      content: "",
      date: new Date(),
      type: 0,
      loadIng: false,
    };
  }
  toggle() {
    alert("change");
    if (Platform.OS === "ios") {
      if (this.state.pickerOpacity == 0) {
        this.setState({
          pickerOpacity: 1,
          opacityOfOtherItems: 0, // THIS WILL HIDE YOUR BUTTON!
        });
      } else {
        this.setState({
          pickerOpacity: 0,
          opacityOfOtherItems: 1,
        });
      }
    }
  }
  async componentDidMount() {
    const { params } = this.props.route;
    this.setState({ loadIng: true });
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          style={{ fontSize: 20 }}
          onPress={(e) => {
            this.add(this.state.content, this.state.title, this.state.date);
          }}
          title="保存"
        />
      ),
    });
    if (params.type === 0) {
      await db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists diary (id integer primary key not null, date text, title text,content text,type integer);"
        );
        tx.executeSql("select * from diary", [], (_, { rows: { _array } }) =>
          console.log(JSON.stringify(_array))
        );
      });
      this.setState({ loadIng: false });
    }

    if (params.type === 1) {
      await db.transaction((tx) => {
        tx.executeSql(
          "select * from diary where id = ?",
          [params.cardId],
          (_, { rows: { _array } }) => {
            console.log(JSON.stringify(_array)),
              this.setState({ items: _array });
          }
        );
      });
      setTimeout(() => this.Diary(), 1000);
    }
  }
  Diary() {
    const { items } = this.state;
    console.log("diary    " + items);
    console.log("---------------------");
    const titles = items.map((item) => Object.values(item)[2]);
    const contents = items.map((item) => Object.values(item)[3]);
    const types = items.map((item) => Object.values(item)[4]);
    console.log("---------------------");
    console.log("測試取直" + "  " + contents);
    console.log("測試取直" + "  " + titles);
    console.log("測試取直" + "  " + types);
    // console.log("測試取直" + "  " + item);
    this.setState({
      content: contents,
      title: titles,
      selectedValue: types,
      loadIng: false,
      type:types
    });
  }
  add = (text) => {
    const { params } = this.props.route;
    const { goBack } = this.props.navigation;
    const { content, title, date, type } = this.state;
    const fullDate = [this.state.date.getFullYear];
    // is text empty?
    if (text === null || text === "") {
      alert("沒有任何東西喔");
      return false;
    }
    if (params.type == 0) {
      db.transaction((tx) => {
        tx.executeSql(
          "insert into diary (content,title,date,type) values (?,?,?,?)",
          [content, title, date.getFullYear(), type],
          alert("存檔成功")
        );
        tx.executeSql(
          "select * from diary order by content",
          [],
          (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
        );
      });
      RootNavigation.goBack();
    }
    if (params.type == 1) {
      console.log("編輯");

      db.transaction((tx) => {
        tx.executeSql(
          "update diary set(content,title,date,type)=(?,?,?,?) where id= ?",
          [
            content.toString(),
            title.toString(),
            date.getFullYear(),
            Number(type),
            params.cardId,
          ]
        );
        tx.executeSql(
          "select * from diary order by content",
          [],
          (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
        );
      });
      RootNavigation.goBack();
      alert("更新成功");
    }
  };
  onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["選擇分類", "心情", "筆記", "記帳", "創作"],
        tintColor: "#000000",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.setState({ type: 0 });
          console.log("select");
        } else if (buttonIndex === 1) {
          this.setState({ type: 1 });
          console.log("select");
        } else if (buttonIndex === 2) {
          this.setState({ type: 2 });
        } else if (buttonIndex === 3) {
          this.setState({ type: 3 });
        } else if (buttonIndex === 4) {
          this.setState({ type: 4 });
        }
      }
    );

  render() {
    const { opacityOfOtherItems, pickerOpacity, type } = this.state;
    const typeTitle = ["選擇分類", "心情", "筆記", "記帳", "創作"];
    if (this.state.loadIng === true) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else
      return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={80}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={{
                flex: 1,
              }}
            >
              <View style={styles.title}>
                <View
                  style={{
                    borderRadius: 5,
                    shadowColor: "black",
                    shadowRadius: 20,
                    borderWidth: 1,
                    marginLeft: 5,marginTop:6,
                    marginBottom: 5,
                    backgroundColor: "#FFFFFC",
                    justifyContent: "center",
                    width: 90,
                  }}
                >
                  <Button
                    onPress={(e) => this.onPress()}
                    color="#231C07"
                    title={typeTitle[type]}
                  />
                </View>

                <TextInput
                  placeholder="輸入標題"
                  style={{ fontSize: 18, width: 250, marginLeft: 10 }}
                  maxLength={40}
                  onChangeText={(title) => this.setState({ title })}
                  value={this.state.title.toString()}
                />
              </View>
              <View style={styles.content}>
                <TextInput
                  scrollEnabled={false}
                  enablesReturnKeyAutomatically={true}
                  placeholder="輸入內容"
                  style={{
                    flex: 1,
                    minHeight: 600,
                    borderRadius: 40,
                    fontSize: 18,
                    margin: 5,
                  }}
                  maxLength={5000}
                  onChangeText={(content) => this.setState({ content })}
                  value={this.state.content.toString()}
                  textAlignVertical={"top"}
                  multiline={true}
                  keyboardAppearance={"light"}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF9",
  },
  contentTitle: {
    height: 60,
    fontFamily: "Avenir-Black",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "900",
  },
  content: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    margin: 1,
  // borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    width: ScreenWidth - 30,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 4,
      width: 5,
    },
    elevation: 5,
  },
  title: {
    flex: 1,
    height: 60,
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    elevation: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
});
/*<Button
style={{ elevation: 5, borderRadius: 20 }}
title="存檔"
onPress={(e) => {
  this.add(
    this.state.content,
    this.state.title,
    this.state.date
  );
}}
/>*/
