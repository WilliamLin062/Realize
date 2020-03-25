import{ActionSheetIOS}from 'react-native'
const clicked =none
export const Button=createReactClass({
    getInitialState() {
        return {
          clicked: 'none'
        };
      },
    render() {
        return (
          <View>
            <Text onPress={this.showActionSheet} style={style.button}>
              Click to show the ActionSheet
            </Text>
            <Text>
              Clicked button: {this.state.clicked}
            </Text>
          </View>
        );
      },
})