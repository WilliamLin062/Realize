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
  TouchableOpacity,
  ActionSheetIOS,
} from "react-native";
import Constants from "expo-constants";
// implemented without image with header
import * as SQLite from "expo-sqlite";
import { createNativeWrapper } from "react-native-gesture-handler";
// Utils
import {
  ScreenWidth,
  ScreenHeight,
  StreamColor,
  TitleColor,
} from "../../../utils";
import RBSheet from "react-native-raw-bottom-sheet";

const db = SQLite.openDatabase("db.db");
//function Item({ id, title, selected, onSelect, content }) {}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props,
      title: this.props.title,
      content: this.props.content,
      data: this.props.data,
      selected: "",
      delete: 0,
    };
  }
  deleteDiary({ id }) {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from diary where id = ?;`, [id]);
      },
      null,
      this.setState({ delete: delete +1 })
    );
  }
  contentBox(title, content) {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image></Image>
        <Text style={{ marginRight: 80 }}>image</Text>
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.content}>{content}</Text>
        </View>
      </View>
    );
  }
  handlePress = (index) => this.setState({ selected: index });
  render() {
    const { id, content, title, data, selected } = this.state;
    return (
      <TouchableOpacity
        onLongPress={() => this.refRBSheet.open()}
        style={[
          styles.item,
          { backgroundColor: selected ? "#DCDCDC" : "#F8F8FF" },
        ]}
      >
        {this.contentBox(content, title)}
        <RBSheet
          ref={(ref) => {
            this.refRBSheet = ref;
          }}
          height={100}
          duration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.deleteDiary(id), this.refRBSheet.close();
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTitle}>Delete</Text>
          </TouchableOpacity>
        </RBSheet>
      </TouchableOpacity>
    );
  }
}
//
//                             mainFunction
//
export default class HomeCard extends Component {
  state = {
    text: null,
    items: null,
    refreshing: false,
    seed: 1,
  };
  componentDidMount() {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists diary (id integer primary key not null, date text, title text,content text);",
        [],
        (_, { rows }) => console.log("開啟資料庫成功")
      );
    });
    this.getData();
  }
  update() {
    db.transaction((tx) => {
      tx.executeSql(`select * from diary;`, [], (_, { rows: { _array } }) =>
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
      tx.executeSql(`select * from diary;`, [], (_, { rows: { _array } }) =>
        this.setState({ items: _array })
      );
    });
  }
  /* didUpdate(){
    this.
  }*/

  //

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
  //
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
          renderItem={({ item }) => (
            <Item
              id={item.id}
              title={item.title}
              content={item.content}
              onPress={(e) => item.id}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
        />
        {console.log(items)}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  buttonTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    height: 100,
  },
  container: {
    backgroundColor: "#F8F8FF",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  fontcolor: {
    color: "#000",
    flex: 1,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: "#5555FF",
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    backgroundColor: "#DCDCDC",
    flex: 1,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
  size: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 25,
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  listIcon: {
    fontSize: 26,
    color: "#666",
    width: 60,
  },
  listLabel: {
    fontSize: 16,
  },
  titleContainer: {
    width: ScreenWidth-125,
    backgroundColor: "#ff55ff",
 
  },
  title:{
    fontSize:10
  }
});
