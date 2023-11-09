import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';

import {Text} from '~components/common';
import ScreenContainer from '~components/ScreenContainer';
import UserDialogModal from '../../containers/modals/userDialogModal';
import UserCard from '../../containers/cards/userCard';
import HeaderOptions from '../../helpers/HeaderOptions';
import themeContext from '~components/ThemeContext';

class ContactScreen extends Component {
  state = {
    visible: false,
    modalData: null,
    contacts: null,
  };

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
  }

  searchCallBack = (toSearch) => {
    const {contactsList} = this.props;

    let searched = contactsList.filter((i) => {
      return i.name.toLowerCase().includes(toSearch.toLowerCase());
    });

    this.setState({
      contacts: toSearch === '' ? null : searched,
    });
  };

  modalHandler = (item) => {
    item &&
      this.setState({
        modalData: item,
      });
    this.visibleHandler();
  };

  visibleHandler = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  renderItem = ({item}) => {
    return (
      <UserCard callback={this.modalHandler} item={item} endType={'icon'} />
    );
  };

  render() {
    const {visible, modalData} = this.state;
    const {contacts} = this.state;
    const {contactsList} = this.props;

    const userList = contacts || contactsList;

    const {colors} = this.props.useThemeHook;

    return (
      <ScreenContainer
        style={{
          backgroundColor: colors.background,
        }}>
        {userList.length === 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text lightDark style={{textAlign: 'center'}} color={colors.text}>
              You don't have anyone in your contacts
            </Text>
          </View>
        ) : (
          <FlatList
            data={userList}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index}
          />
        )}
        <UserDialogModal
          visible={visible}
          onClose={this.visibleHandler}
          data={modalData}
          {...this.props}
        />
      </ScreenContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const {activeProfileType, contactsList, profileData} = state.profile;
  const {searchRadius} = state.app;
  const {discoveredPeople, discoveredSponsors} = state.discover;

  return {
    contactsList,
    discoveredPeople,
    discoveredSponsors,
    searchRadius,
    activeProfileType,
    profileData,
  };
};

export default connect(mapStateToProps, null)(themeContext(ContactScreen));
