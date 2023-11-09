import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator} from 'react-native-paper';

import MessageRow from './MessageRow';
import {Text} from '~components/common';
import {loadMessages, initLoading} from '~redux/actions';
import {getChatItems, getThreadId} from '~redux/selectors/ChatSelectors';
import {Colors} from '~styles';
import themeContext from '~components/ThemeContext';

const ITEM_HEIGHT = 80;

class MessagesList extends Component {
  constructor(props) {
    super(props);
    !props.isBTChat && props.initLoading();

    this.data = [];

    this.renderItem = ({item}) => {
      return (
        <MessageRow
          message={item}
          receiver={this.props.receiver}
          {...this.props}
        />
      );
    };

    this.emptyList = () => {
      return (
        <Text lightDark h4 style={{textAlign: 'center'}}>
          There are no messages yet
        </Text>
      );
    };

    this.itemLayout = (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    });
  }

  componentDidMount() {
    const {receiver, activeProfileType, isBTChat} = this.props;

    !isBTChat && this.props.loadMessages(activeProfileType, receiver, true);
  }

  componentDidUpdate() {
    if (this.data.length && !this.props.loading && this.props.ready) {
      this.flatList.scrollToIndex({animated: true, index: 0});
    }
  }

  render() {
    const {loading, thread, isBTChat} = this.props;

    this.data = getChatItems(!this.props.thread ? {} : thread.messages || {});

    const contentContainerStyle = this.data.length
      ? null
      : styles.flatlistContainerStyle;

    // console.log('ready msg list:', this.props.ready);
    const {colors} = this.props.useThemeHook;

    return loading && !isBTChat ? (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator animating color={Colors.dark} />
      </View>
    ) : this.data.length ? (
      <FlatList
        ref={(c) => {
          this.flatList = c;
        }}
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        data={this.data}
        keyExtractor={(item) => item.key}
        renderItem={this.renderItem}
        getItemLayout={this.itemLayout}
        // ListEmptyComponent={this.emptyList}
        inverted
      />
    ) : (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text lightDark h4 style={{textAlign: 'center'}} color={colors.text}>
          There are no messages
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  flatlistContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

const mapStateToProps = (state, ownProps) => {
  const {loading} = state.app;
  const senderUid = auth().currentUser.uid;
  const receiverUid = ownProps.receiver.uid;
  const senderProfileType = state.profile.activeProfileType;
  const receiverProfileType = ownProps.receiver.activeProfileType;
  const isBTChat = !state.app.searchRadius;

  const threads = !isBTChat ? state.chat.threads : state.chat.btThreads;
  const thread =
    threads[
      getThreadId({
        senderUid,
        receiverUid,
        senderProfileType,
        receiverProfileType,
      })
    ];

  return {
    loading,
    thread,
    error: state.chat.loadMessagesError,
    activeProfileType: senderProfileType,
    isBTChat,
  };
};

export default connect(mapStateToProps, {loadMessages, initLoading})(
  themeContext(MessagesList),
);
