import React, {useState} from 'react';
import {Pressable, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import _ from 'lodash';

import GlobalStyles, {Colors} from '../../styles';
import Text from './Text';
import {useTheme} from '~styles/ThemeProvider';

export default (props) => {
  const myProps = _.cloneDeep(props);

  const {
    isDatePicker,
    value,
    label,
    labelStyle,
    style,
    getRef,
    callback,
    handleSubmit,
  } = props;

  const [datePicker, handleDatepicker] = useState(false);
  const {colors} = useTheme();

  const [date, setDate] = useState(value ? value : null);
  const handleChange = (item) => {
    setDate(item);
    callback(item);
  };

  const handleEdit = () => {
    handleDatepicker(false);
    handleSubmit();
  };

  isDatePicker && delete myProps.value;
  isDatePicker && delete myProps.onChangeText;

  return !isDatePicker ? (
    <TextInput
      style={{
        backgroundColor: Colors.grey[6],
        height: 60,
        width: 100,
      }}
      theme={{colors: {primary: Colors.primary[0]}}}
      ref={getRef}
      {...myProps}
    />
  ) : datePicker ? (
    <>
      {label ? (
        <Text bold style={labelStyle || null}>
          {label}
        </Text>
      ) : null}
      <DatePicker
        minimumDate={new Date()}
        style={{
          backgroundColor: colors.inputColor,
          marginHorizontal: 20,
          marginTop: 5,
          borderRadius: 4,
          width: Dimensions.get('screen').width - 70,
          color: colors.text,
        }}
        date={date ? new Date(date) : new Date()}
        onDateChange={(val) => handleChange(val)}
        mode="date"
      />
      <TouchableOpacity
        style={{
          marginBottom: 20,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
        onPress={() => handleEdit()}>
        <Text h4 color={colors.text}>
          Done
        </Text>
      </TouchableOpacity>
    </>
  ) : (
    <Pressable
      style={{
        width: '100%',
      }}
      onPress={() => handleDatepicker(true)}>
      <TextInput
        ref={getRef}
        editable={false}
        style={GlobalStyles().inputStyle}
        value={date ? moment(date).format('YYYY-MM-DD') : ''}
      />
      {/* <TextInput
        ref={getRef}
        editable={false}
        style={[
          style,
          {
            backgroundColor: Colors.grey[6],
            height: 60,
            width: 100,
          },
        ]}
        value={time ? moment(time).utcOffset('+0500').format('hh:mm A') : ''}
        theme={{colors: {primary: Colors.primary[0]}}}
        {...myProps}
      /> */}
    </Pressable>
  );
};
