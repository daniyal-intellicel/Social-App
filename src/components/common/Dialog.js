import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import {Text} from '.';
import {Button} from '.';

import {Colors} from '../../styles';
import {useTheme} from '~styles/ThemeProvider';

export default ({buttons, isVisible, onRequestClose, dialogType = 1, data}) => {
  const {colors, isDark} = useTheme();
  const [name, setName] = useState(buttons ? buttons[0].value : '');
  const [status, setStatus] = useState(buttons ? buttons[1].value : '');
  const dialog3Hanlder = (array) => {
    let obj = {};
    obj.name = name !== '' ? name : array[0].value;
    obj.status = status !== '' ? status : array[1].value;
    onRequestClose({status: true, obj});
    setName('');
    setStatus('');
  };

  const Dialog1 = () => {
    return (
      <>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
            paddingVertical: 10,
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text h3 style={{paddingTop: 20}}>
            Confirmation
          </Text>
          <Text h4 color={Colors.grey[2]} style={{paddingVertical: 10}}>
            {data ? data.title : ''}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onRequestClose({status: 'true', type: data.type})}
          style={{
            height: 50,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text color={Colors.orange[0]} h18>
            Done
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onRequestClose({status: 'false'})}
          style={{
            height: 50,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text color={Colors.blue[0]} h18>
            Cancel
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const Dialog2 = () => {
    return (
      <>
        {buttons.map((button, index) => (
          <View
            key={index}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.divider,
              paddingVertical: 10,
              paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              h4
              color={colors.text}
              style={{paddingVertical: 10}}
              onPress={() => {
                button.onPress();
              }}>
              {button.label}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => onRequestClose({status: false})}
          style={{
            height: 50,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text color={Colors.orange[0]} h18>
            Cancel
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const Dialog3 = () => {
    return (
      <>
        {/* {buttons.map((button, index) => ( */}
        <View>
          <View>
            <TextInput
              style={{
                backgroundColor: !isDark ? '#FFFFFF' : '#000000',
                marginHorizontal: 10,
                marginTop: 30,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
              }}
              placeholderTextColor={colors.text}
              value={name}
              placeholder={buttons[0].placeholder}
              onChangeText={(text) => {
                setName(text);
              }}
            />
          </View>
          <View>
            <TextInput
              style={{
                backgroundColor: !isDark ? '#FFFFFF' : '#000000',
                marginHorizontal: 10,
                marginTop: 30,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
              }}
              placeholderTextColor={colors.text}
              value={status}
              placeholder={buttons[1].placeholder}
              onChangeText={(text) => {
                setStatus(text);
              }}
            />
          </View>
        </View>
        {/* ))} */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 15,
          }}>
          <Button size={'xSmall'} h5 onPress={() => dialog3Hanlder(buttons)}>
            Done
          </Button>
          <Button
            size={'xSmall'}
            containerStyle={{marginLeft: 15}}
            buttonType={'secondary'}
            h5
            buttonTextColor={Colors.orange[0]}
            onPress={() => onRequestClose({status: false})}>
            Cancel
          </Button>
        </View>
      </>
    );
  };

  return (
    <Provider>
      <View>
        <Portal>
          <Dialog
            visible={isVisible}
            onDismiss={() => onRequestClose({status: false})}
            style={{
              borderRadius: 30,
              marginHorizontal: 50,
              backgroundColor: colors.tile,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {dialogType === 1 ? Dialog1() : null}
              {dialogType === 2 ? Dialog2() : null}
            </View>
            {dialogType === 3 ? Dialog3() : null}
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

// const styles = StyleSheet.create({
//   bottomLine: {borderWidth: 0.5, borderColor: Colors.grey[4], width: '100%'},
// });
