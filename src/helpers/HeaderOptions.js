import React, {useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Searchbar} from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

import {Colors} from '../styles';
import {Text, Icon} from '../components/common';
import {Images} from '~assets';
import UserDialogModal from '~containers/modals/userDialogModal';
import {useTheme} from '~styles/ThemeProvider';

export default ({
  type = 1,
  navigation,
  route,
  hotelType,
  options,
  back,
  title = 'Info',
  showAvatar = false,
  userData = null,
  searchCallBack = () => {},
}) => {
  const {isDark} = useTheme();
  const typeData = useSelector((state) => state.profile.profileData);
  const profileType = useSelector((state) => state.profile.activeProfileType);
  const hotelData = useSelector((state) => state.hotel.hotel);
  const [searchText, setSearchText] = useState('');
  // const [state, setState] = useState({
  //   visible: false,
  //   modalData: null,
  // });
  const [modalData, setModalData] = useState(null);
  const [visible, setVisible] = useState(false);

  const modalHandler = (item) => {
    item && setModalData(item);
    visibleHandler();
  };

  const visibleHandler = () => {
    setVisible(!visible);
  };

  const searchBarHandler = (text) => {
    setSearchText(text);
    searchCallBack(text);
  };

  const renderType1 = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          paddingHorizontal: 20,
        }}>
        {route.name === 'DiscoverUserScreen' ? (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            {showAvatar ? (
              <Image
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 8,
                }}
                source={
                  typeData.avatar ? {uri: typeData.avatar} : Images.no_image
                }
              />
            ) : (
              <Icon2 name="menu" size={30} color={Colors.light} />
            )}
          </TouchableOpacity>
        ) : route.name === 'HotelScreen' ? (
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('HotelListScreen');
              navigation.pop();
            }}
            style={{
              width: 40,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name={'backIcon'}
              fill={Colors.light}
              height="30"
              width="30"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}
            style={{
              width: 40,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name={'backIcon'}
              fill={Colors.light}
              height="30"
              width="30"
            />
          </TouchableOpacity>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text h1 bold color={Colors.light}>
            Be
          </Text>
          {hotelType === true && hotelData ? (
            <Text h2 color={Colors.light} style={{paddingLeft: 5}}>
              {hotelData.displayName}
            </Text>
          ) : profileType === 'product' ? (
            <Text h2 color={Colors.light} style={{paddingLeft: 5}}>
              Business
            </Text>
          ) : null}
        </View>
        <TouchableOpacity>
          <View style={{height: 10, width: 40}} />
          {/* <Icon name={'bell'} fill={Colors.light} height="25" width="25" /> */}
        </TouchableOpacity>
      </View>
    );
  };

  const renderType2 = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            style={{
              height: 40,
              width: 40,
              borderRadius: 8,
            }}
            source={typeData.avatar ? {uri: typeData.avatar} : Images.no_image}
          />
        </TouchableOpacity>
        <Searchbar
          style={{
            width: '80%',
            borderRadius: 50,
            height: '70%',
            backgroundColor: Colors.light,
          }}
          inputStyle={{color: Colors.grey[2], backgroundColor: Colors.light}}
          placeholder="Search"
          placeholderTextColor={Colors.grey[2]}
          iconColor={Colors.grey[7]}
          onChangeText={(text) => {
            searchBarHandler(text);
          }}
          value={searchText}
          onSubmitEditing={(event) => searchBarHandler(event.nativeEvent.text)}
        />
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity>
            <Icon
              name={'pencilBox'}
              fill={Colors.light}
              height="25"
              width="25"
            />
          </TouchableOpacity>
          <View style={{margin: 5}} />
          <TouchableOpacity>
            <Icon name={'bell'} fill={Colors.light} height="25" width="25" />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  const renderType3 = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}
          style={{
            width: 40,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon1 name="arrow-left" size={20} color={Colors.light} />
        </TouchableOpacity>
        <View
          style={{flexDirection: 'row', width: '65%', alignItems: 'center'}}>
          <Image
            style={{
              height: 35,
              width: 35,
              borderRadius: 10,
            }}
            source={typeData.avatar ? {uri: typeData.avatar} : Images.no_image}
          />
          <View style={{marginLeft: 8}}>
            <Text h3 color={Colors.light}>
              Abigale Beau
            </Text>

            <Text color={Colors.light}>Status here...</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon2 name="dots-three-horizontal" size={20} color={Colors.light} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderType4 = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}
          style={{
            width: 40,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name={'backIcon'} fill={Colors.light} height="30" width="30" />
        </TouchableOpacity>
        <Text color={Colors.light} h18>
          {title}
        </Text>
        <View style={{margin: 20}} />
      </View>
    );
  };

  const renderType5 = (user) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('RadiusScreen');
            }
          }}
          style={{
            width: 40,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon1 name="arrow-left" size={20} color={Colors.light} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => modalHandler(user)}
          style={{flexDirection: 'row', width: '65%', alignItems: 'center'}}>
          {/* <View
            style={{flexDirection: 'row', width: '65%', alignItems: 'center'}}> */}
          <Image
            style={{
              height: 35,
              width: 35,
              borderRadius: 8,
            }}
            source={user.avatar ? {uri: user.avatar} : Images.no_image}
          />
          <View style={{marginLeft: 8}}>
            <Text h3 color={Colors.light}>
              {user.name}
            </Text>

            <Text color={Colors.light}>{user.status}</Text>
          </View>
          {/* </View> */}
        </TouchableOpacity>

        <View style={{margin: 10}} />
      </View>
    );
  };

  const renderType6 = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          paddingHorizontal: 10,
        }}>
        <Image
          style={{
            height: 40,
            width: 40,
            borderRadius: 8,
          }}
          source={typeData.avatar ? {uri: typeData.avatar} : Images.no_image}
        />
        <Searchbar
          style={{
            width: '70%',
            borderRadius: 50,
            height: '70%',
            backgroundColor: Colors.light,
          }}
          inputStyle={{color: Colors.grey[2], backgroundColor: Colors.light}}
          placeholder="Search"
          placeholderTextColor={Colors.grey[2]}
          iconColor={Colors.grey[7]}
          onChangeText={(text) => {
            searchBarHandler(text);
          }}
          value={searchText}
          onSubmitEditing={(event) => searchBarHandler(event.nativeEvent.text)}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity>
            <Icon name={'bell'} fill={Colors.light} height="25" width="25" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <LinearGradient
        colors={
          profileType === 'product'
            ? ['#0f1545', '#0f1545']
            : isDark
            ? ['#171717', '#171717']
            : [Colors.purple[1], Colors.blue[0]]
        }
        start={{x: 1, y: 1}}
        end={{x: 0, y: 1}}>
        <SafeAreaView style={{justifyContent: 'space-between'}} edges={['top']}>
          {type === 1 ? renderType1() : null}
          {type === 2 ? renderType2() : null}
          {type === 3 ? renderType3() : null}
          {type === 4 ? renderType4() : null}
          {type === 5 ? renderType5(userData) : null}
          {type === 6 ? renderType6() : null}
        </SafeAreaView>
      </LinearGradient>
      <UserDialogModal
        visible={visible}
        onClose={visibleHandler}
        data={modalData}
        navigation={navigation}
      />
    </>
  );
};
