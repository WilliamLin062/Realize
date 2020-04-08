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
    const title = items.map((item) => Object.values(item)[2]);
    const content = items.map((item) => Object.values(item)[3]);
    const types = items.map((item) => Object.values(item)[4]);
    console.log("---------------------");
    console.log("測試取直" + "  " + content);
    console.log("測試取直" + "  " + title);
    console.log("測試取直" + "  " + types);
    // console.log("測試取直" + "  " + item);
    this.setState({
      content: content,
      title: title,
      selectedValue: types,
      loadIng: false,
    });
  }
  add = (text) => {
    const { params } = this.props.route;
    const { goBack } = this.props.navigation;
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
          [
            this.state.content,
            this.state.title,
            this.state.date.getFullYear(),
            this.state.type,
          ],
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
            this.state.content,
            this.state.title,
            this.state.date.getFullYear(),
            this.state.type,
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
                <Button
                  onPress={(e) => this.onPress()}
                  color="#101010"
                  title={typeTitle[type]}
                />
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
                    minHeight:600,
                    borderRadius: 40,
                    fontSize: 18,
                  }}
                  maxLength={5000}
                  onChangeText={(content) => this.setState({ content })}
                  value={this.state.content.toString()}
                  textAlignVertical={"top"}
                  multiline={true}
                  keyboardAppearance={"light"}
                />
              </View>

              <Button
                style={{ elevation: 5, borderRadius: 20 }}
                title="存檔"
                onPress={(e) => {
                  this.add(
                    this.state.content,
                    this.state.title,
                    this.state.date
                  );
                }}
              />
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
    backgroundColor: "#ffffff",
  },
  contentTitle: {
    height: 50,
    fontFamily: "monospace",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "900",
  },
  content: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    width: ScreenWidth,

    elevation: 5,
  },
  title: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    elevation: 5,
    borderBottomWidth: 1,
  },
});
