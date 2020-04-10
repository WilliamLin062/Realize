import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  Picker,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  TouchableOpacity,
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
import RBSheet from "react-native-raw-bottom-sheet";
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
      selected: false,
      type: 0,
      loadIng: false,
    };
  }

  async componentDidMount() {
    const { params } = this.props.route;
    console.log("android");
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
      console.log("編輯");
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
    const { params } = this.props.route;
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
    this.setState({
      content: content,
      title: title,
      selectedValue: params.diarytype,
      loadIng: false,
      type: params.diarytype,
    });
  }
  add = (text) => {
    const { params } = this.props.route;
    const { goBack } = this.props.navigation;
    const { content, title, date, type, selectedValue } = this.state;
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
            this.state.selectedValue,
          ],
          ToastAndroid.show("存檔成功!", ToastAndroid.SHORT)
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
      console.log("編輯" + "  " + this.state.selectedValue);
      console.log(content + "  " + title + "　" + date + "  " + selectedValue);
      //

      //
      db.transaction((tx) => {
        /*
        tx.executeSql(
          "update diary set ( content , title , date , type ) = ( ? , ? , ? , ? ) where id = ?",
          [content, title, date.getFullYear(), selectedValue, params.cardId],
          (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
        )*/
        tx.executeSql(
          "update diary set type =  ?  where id = ?",
          [selectedValue, params.cardId],
          (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
        );
      });
      db.transaction((tx) => {
        tx.executeSql(
          "update diary set ( content ) = ( ? ) where id = ?",
          [content, params.cardId],
          (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
        );
      });
      db.transaction((tx) => {
        tx.executeSql(
          "update diary set (title) = ( ? ) where id = ?",
          [title, params.cardId],
          (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
        );
      });
      db.transaction((tx) => {
        tx.executeSql(
          "update diary set (date) = ( ? ) where id = ?",
          [date.getFullYear(), params.cardId],
          (_, { rows: { _array } }) => console.log(JSON.stringify(_array))
        );
      });

      setTimeout(() => {
        RootNavigation.goBack();
      }, 1000);

      ToastAndroid.show("更新成功!", ToastAndroid.SHORT);
    }
  };

  picker() {}
  render() {
    const typeTitle = ["選擇分類", "心情", "筆記", "記帳", "創作"];
    const selectedValue = this.state;
    console.log(typeTitle[this.state.selectedValue]);
    if (this.state.loadIng === true) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else
      return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView>
            <ScrollView
              style={{
                flex: 1,
              }}
            >
              <View style={styles.title}>
                <Button
                  title={typeTitle[this.state.selectedValue]}
                  onPress={() => this.refRBSheet.open()}
                />
                <RBSheet
                  ref={(ref) => {
                    this.refRBSheet = ref;
                  }}
                  height={150}
                  duration={250}
                  customStyles={{
                    container: {
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  }}
                >
                  <ScrollView>
          
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          selectedValue: 0,
                        }),
                          this.refRBSheet.close();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonEdit}>選擇分類</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonLine}></View>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          selectedValue: 1,
                        }),
                          this.refRBSheet.close();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonEdit}>心情</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonLine}></View>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          selectedValue: 2,
                        }),
                          this.refRBSheet.close();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonEdit}>筆記</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonLine}></View>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          selectedValue: 4,
                        }),
                          this.refRBSheet.close();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonEdit}>創作</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonLine}></View>
                  </ScrollView>
                </RBSheet>
                <TextInput
                
                  placeholder="輸入標題"
                  style={{ fontSize: 18, width: 250,marginLeft:10 }}
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
                    marginLeft: 10,
                    borderRadius: 40,
                    fontSize: 18,
                  }}
                  maxLength={2000}
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
    backgroundColor: "#FCFDFB",
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
    elevation: 6,
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
  buttonLine: {
    width: 100,
    borderBottomWidth: 1,
    margin: 10,
  },
  buttonEdit: {
    color: "#3C3C3C",
    fontSize: 20,
    fontWeight: "bold",
  },
});
/*<Button
  style={{ elevation: 5, borderRadius: 20 }}
  title="存檔"
  onPress={(e) => {
    this.add(this.state.content, this.state.title, this.state.date);
  }}
/>;*/
