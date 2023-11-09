import React from 'react';
import {View, TextInput, Alert, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';

import {
  sendMessage,
  updateMessage,
  sendBTMessage,
} from '~redux/actions/ChatActions';
// import {Colors} from '~styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from '~components/common';
import themeContext from '~components/ThemeContext';

class MessageForm extends React.Component {
  state = {
    message: '',
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.sendingError && this.props.sendingError) {
      Alert.alert('Error', this.props.sendingError);
    }
  }

  componentWillUnmount() {
    this.props.updateMessage('');
  }

  handleMessageChange = (message) => {
    this.setState({
      message: message,
    });
    this.props.updateMessage(message);
  };

  handleButtonPress = () => {
    if (this.state.message.trim() !== '') {
      const {message, receiver, activeProfileType, isBTChat} = this.props;

      if (isBTChat) {
        this.props.sendBTMessage(message, activeProfileType, receiver);
      } else {
        this.props.sendMessage(
          message,
          receiver.uid,
          activeProfileType,
          receiver.activeProfileType,
        );
      }

      this.setState({message: ''});
    }
  };

  render() {
    const {loading, ready, message, isBTChat} = this.props;

    // const isButtonDisabled =
    //   !(!loading && ready) && (sending || message.trim().length === 0);
    const isButtonDisabled = loading || !ready;

    let disable = message.trim() === '' ? true : false;
    const {colors} = this.props.useThemeHook;
    return (
      <View style={[styles.container, {backgroundColor: colors.modal}]}>
        <View style={{marginLeft: 5}}>
          {/* <Icon name="paper-clip" size={20} color={Colors.grey[3]} /> */}
        </View>
        <TextInput
          multiline
          style={{
            color: colors.text,
            flex: 1,
            textAlignVertical: 'center',
            // backgroundColor: Colors.messageFormTextBoxColor,
            height: 40,
            margin: 10,
            marginRight: 5,
            marginLeft: 5,
            borderRadius: 5,
            paddingLeft: 10,
          }}
          placeholder={'Type your message here'}
          placeholderTextColor={colors.text}
          // placeholderTextColor={Colors.textColorLight}
          onChangeText={this.handleMessageChange}
          value={this.state.message}
          underlineColorAndroid={'transparent'}
          // onSubmitEditing={this.handleButtonPress}
          blurOnSubmit={false}
          maxLength={this.props.isBTChat ? 150 : undefined}
          // editable={!isButtonDisabled}
          editable={isBTChat ? true : !isButtonDisabled}
        />

        {/* <CustomIcon
          button={!isButtonDisabled}
          containerStyle={styles.button}
          onPress={this.handleButtonPress}
          vectorIcon
          name="send"
          type="material-community"
          size={25}
          color={Colors.textColorLight}
        /> */}

        <TouchableOpacity
          style={styles.button}
          onPress={this.handleButtonPress}
          // disabled={isButtonDisabled}
        >
          <Text h4 color={!disable ? colors.activeTab : colors.inActiveTab}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    paddingBottom: 10,
  },
  button: {
    // marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    height: 40,
    width: 40,
    // backgroundColor: Colors.messageSendButtonColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({
  loading: state.app.loading,
  sending: state.chat.sending,
  sendingError: state.chat.sendingError,
  message: state.chat.message,
  activeProfileType: state.profile.activeProfileType,
  isBTChat: !state.app.searchRadius,
});

export default connect(mapStateToProps, {
  sendMessage,
  updateMessage,
  sendBTMessage,
})(themeContext(MessageForm));
