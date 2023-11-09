import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import {Text} from '~components/common';
import ScreenContainer from '~components/ScreenContainer';
import UserCard from '../../containers/cards/userCard';
import HeaderOptions from '../../helpers/HeaderOptions';
import {getThreadItems} from '~redux/selectors/ChatSelectors';
import themeContext from '~components/ThemeContext';

class ChatScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      modalData: null,
      chats: null,
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      header: ({navigation, route, options, back}) => (
        <HeaderOptions
          navigation={navigation}
          route={route}
          options={options}
          back={back}
          type={2}
          typeData={this.props.profileData}
          searchCallBack={this.searchCallBack}
        />
      ),
    });

    const {currentUser} = auth();
    database()
      .ref(`users/${currentUser.uid}`)
      .update({update: !this.props.profileUpdate});
  }

  searchCallBack = (toSearch) => {
    let newChat = getThreadItems(this.props.threads);

    let searched = newChat.filter((i) => eachIndex(i));
    function eachIndex(i) {
      return i.receiverData.name.toLowerCase().includes(toSearch.toLowerCase());
    }

    this.setState({
      chats: toSearch === '' ? null : searched,
    });
  };

  navigateHandler = (item) => {
    item && this.props.navigation.navigate('MessageScreen', {user: item});
  };

  renderItem = ({item}) => {
    const {unreadThreads} = this.props;
    const receiverData = item.receiverData;
    return (
      <UserCard
        callback={this.navigateHandler}
        item={receiverData}
        // endType={'icon'}
        endData={item.createdAt}
        threadData={
          unreadThreads[item.threadId]
            ? unreadThreads[item.threadId].createdAt
            : undefined
        }
        badge={unreadThreads[item.threadId] ? {status: 'error'} : undefined}
      />
    );
  };

  render() {
    const {colors} = this.props.useThemeHook;

    let newChats = getThreadItems(this.props.threads);

    const chatsList = this.state.chats || newChats;

    return (
      <ScreenContainer
        style={{
          backgroundColor: colors.background,
        }}>
        {chatsList.length === 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text lightDark style={{textAlign: 'center'}} color={colors.text}>
              There are no messages
            </Text>
          </View>
        ) : (
          <FlatList
            data={chatsList}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index}
          />
        )}
      </ScreenContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const {threads, unreadThreads, btThreads} = state.chat;
  const {update, profileData, activeProfileType} = state.profile;
  const isBTChat = !state.app.searchRadius;

  return {
    unreadThreads,
    threads: !isBTChat ? threads : btThreads,
    profileUpdate: update,
    profileData,
    activeProfileType,
  };
};

export default connect(mapStateToProps, null)(themeContext(ChatScreen));
