import React, {Component} from 'react';
import {
  StyleSheet,
  // ImageBackground,
  View,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  // StatusBar,
  NativeModules,
  NativeEventEmitter,
  Alert,
} from 'react-native';
import BlePic from 'rn-ble-pic';
// import {useDarkMode} from 'react-native-dark-mode';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import _ from 'lodash';

// import { Images } from '~assets';
// import ActionBar from '~components/ActionBar';
import MessagesList from './MessagesList';
import MessageForm from './MessageForm';
import {BLE_MTU_BYTE_SIZE} from '~constants';
import {getThreadId} from '~redux/selectors/ChatSelectors';
import {handleError} from '~utils/services/GeneralServices';
import {getBlockedList} from '~redux/selectors/ProfileSelectors';
import ScreenContainer from '~components/ScreenContainer';
import HeaderOptions from '../../helpers/HeaderOptions';
import {useTheme} from '~styles/ThemeProvider';

const screenDimension = Dimensions.get('window');

const BlePicModule = NativeModules.BLEManager;
const blePicEmitter = BlePicModule
  ? new NativeEventEmitter(BlePicModule)
  : null;

class ChatScreen extends Component {
  state = {
    isBTConnected: false,
    isBTCheckedOnce: false,
  };

  handlerDisconnectPeripheral = null;

  componentDidMount() {
    if (
      this.props.isBTChat &&
      !this.props.btManagerRunning &&
      !this.state.isBTConnected
    ) {
      this.createBTConnection();
    }

    this.props.navigation.setOptions({
      header: ({navigation, route, options, back}) => (
        <HeaderOptions
          navigation={navigation}
          route={route}
          options={options}
          back={back}
          type={5}
          userData={this.props.route.params.user}
        />
      ),
    });
  }

  componentDidUpdate() {
    if (
      this.props.isBTChat &&
      !this.props.btManagerRunning &&
      !this.state.isBTCheckedOnce
    ) {
      this.createBTConnection();
    }
  }

  componentWillUnmount() {
    const {activeProfileType} = this.props;
    const {user} = this.props.route.params;

    this.removeLoadMessagesListener(
      user.uid,
      activeProfileType,
      user.activeProfileType,
      true,
    );
    this.handlerDisconnectPeripheral &&
      this.handlerDisconnectPeripheral.remove();
  }

  removeLoadMessagesListener = (
    receiverUid,
    senderProfileType,
    receiverProfileType,
  ) => {
    const {currentUser} = auth();

    const threadId = getThreadId({
      senderUid: currentUser.uid,
      receiverUid,
      senderProfileType,
      receiverProfileType,
    });

    database().ref('messageThreads').child(threadId).off();
  };

  handleDisconnectPeripheral = ({peripheral}) => {
    const {name} = this.props.route.params.user;

    this.setState({isBTConnected: false});

    Alert.alert(
      'User Disconnected',
      `"${name}" has been disconnected, please try connecting again.`,
      [
        {text: 'Connect', onPress: this.createBTConnection},
        {
          text: 'Cancel',
          onPress: () => {
            this.handlerDisconnectPeripheral &&
              this.handlerDisconnectPeripheral.remove();
          },
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  createBTConnection = () => {
    const {user} = this.props.route.params;

    BlePic.connect(user.deviceId)
      .then(() => BlePic.retrieveServices(user.deviceId))
      .then((peripheralInfo) => {
        if (Platform.OS === 'android') {
          this.setDisconnectPeripheralListener();
          return BlePic.requestMTU(user.deviceId, BLE_MTU_BYTE_SIZE);
        } else {
          this.setDisconnectPeripheralListener();
          return Promise.resolve();
        }
      })
      .then(() => this.setState({isBTConnected: true}))
      .catch((error) => {
        handleError(
          error,
          null,
          `Sorry! we are unable to connect ${user.name} at the moment`,
        );
      })
      .finally(this.setState({isBTCheckedOnce: true}));
  };

  setDisconnectPeripheralListener = () => {
    this.handlerDisconnectPeripheral = blePicEmitter.addListener(
      'BLEManagerDisconnectPeripheral',
      this.handleDisconnectPeripheral,
    );
  };

  render() {
    //iPhone 11: 896x414
    //iPhone 7: 667x375
    let offset = Math.floor(screenDimension.height / 100) * 10;
    const {user} = this.props.route.params;

    const ready = this.props.isBTChat ? this.state.isBTConnected : true;

    const isUserBlocked = _.includes(this.props.blockedList, user.uid);

    return (
      <ScreenContainer>
        {Platform.OS === 'android' ? (
          <BackgroundView>
            {/* <StatusBar
              animated
              backgroundColor={Colors.orange}
              barStyle="light-content"
            /> */}
            <View style={styles.containerStyle}>
              <MessagesList receiver={user} {...this.props} />
              {isUserBlocked ? null : (
                <MessageForm ready={ready} receiver={user} />
              )}
            </View>
          </BackgroundView>
        ) : (
          <BackgroundView>
            <KeyboardAvoidingView
              style={styles.containerStyle}
              behavior="padding"
              keyboardVerticalOffset={offset}>
              <MessagesList receiver={user} />
              {isUserBlocked ? null : (
                <MessageForm ready={ready} receiver={user} />
              )}
            </KeyboardAvoidingView>
          </BackgroundView>
        )}
      </ScreenContainer>
    );
  }
}

const BackgroundView = ({children}) => {
  const {colors} = useTheme();
  return (
    <View style={{backgroundColor: colors.background, flex: 1}}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
});

const mapStateToProps = (state) => {
  const {searchRadius} = state.app;
  const {btManagerRunning} = state.discover;
  const {blocked, blockedBy} = state.profile;

  return {
    blockedList: getBlockedList(blocked, blockedBy),
    isBTChat: !searchRadius,
    btManagerRunning,
  };
};

export default connect(mapStateToProps)(ChatScreen);
