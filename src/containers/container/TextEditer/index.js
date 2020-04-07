import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Picker,
  ToastAndroid,
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
import { SearchBar } from 'react-native-elements';
const db = SQLite.openDatabase("db.db");
export class Edit extends Component {
  static navigationOptions = {
    headerTitleAlign: "center",
    gesturesEnabled: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: null,
      items: null,
      text: "",
      title: "",
      content: "",
      date: new Date(),
      selected: false,
      type: null,
    };
  }

  async componentDidMount() {
    const { params } = this.props.route;
    if (params.type === 0) {
      db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists diary (id integer primary key not null, date text, title text,content text,type integer);"
        );
        tx.executeSql("select * from diary", [], (_, { rows: { _array } }) =>
          console.log(JSON.stringify(_array))
        );
      });
    }

    if (params.type === 1) {
      db.transaction((tx) => {
        tx.executeSql(
          "select * from diary where id = ?",
          [params.cardId],
          (_, { rows: { _array } }) => {
            console.log(JSON.stringify(_array)),
              this.setState({ items: _array });
            console.log("diary    " + this.state.items);
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
    console.log("---------------------");
    console.log("測試取直" + "  " + content);
    console.log("測試取直" + "  " + title);
    // console.log("測試取直" + "  " + item);
    this.setState({ content: content, title: title });
  }
  add = (text) => {
    const { params } = this.props.route;
    const { goBack } = this.props.navigation;
    const fullDate = [this.state.date.getFullYear];
    // is text empty?
    if (text === null || text === "") {
      ToastAndroid.show("沒有輸入任何東西窩!", ToastAndroid.SHORT);
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
          ToastAndroid.show("存檔成功!", ToastAndroid.SHORT)
        );
        tx.executeSql(
          "select * from diary order by content",
          [],
          (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
        );
      });
    }
    if (params.type == 1) {
      console.log("編輯")
      db.transaction((tx) => {
        tx.executeSql(
          "update diary set(content,title,date,type)=(?,?,?,?) where id= ?",
          [
            this.state.content,
            this.state.title,
            this.state.date.getFullYear(),
            this.state.type,
            params.cardId,
          ],
          ToastAndroid.show("更新成功!", ToastAndroid.SHORT)
        );
        tx.executeSql(
          "select * from diary order by content",
          [],
          (_, { rows: { _array } }) => alert(JSON.stringify(_array))
        );
      });
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView
            style={{
              flex: 1,
            }}
          >
            <View style={styles.title}>
              <Picker
                selectedValue={this.state.selectedValue}
                style={{ height: 50, width: 150 ,fontSize:12}}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({type:itemIndex,selectedValue:itemValue})
                }
              >
                <Picker.Item label="選擇分類" value="0" />
                <Picker.Item label="心情" value="1" />
                <Picker.Item label="筆記" value="2" />
                <Picker.Item label="記帳" value="3" />
                <Picker.Item label="隨筆" value="4" />
              </Picker>
              <TextInput
                placeholder="輸入標題"
                style={{fontSize:18,width:250}}
                maxLength={40}
                onChangeText={(title) => this.setState({ title })}
                value={this.state.title.toString()}
              />
            </View>
            <View style={styles.content}>
              <TextInput
                placeholder="輸入內容"
                style={{
                  flex: 1,
                  minHeight: 600,
                  borderRadius: 40,
                  fontSize:18
                }}
                maxLength={2000}
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
                this.add(this.state.content, this.state.title, this.state.date);
                RootNavigation.goBack();
                console.log("存檔");
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
    backgroundColor: "#DDDDDD",
  },
  contentTitle: {
    height: 20,
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
    width: ScreenWidth - 20,
    elevation: 5,
  },
  title: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    elevation: 5,
  },
});
