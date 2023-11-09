import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  // StyleSheet,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {Formik} from 'formik';
import Icons from 'react-native-vector-icons/Entypo';
import {RootSiblingParent} from 'react-native-root-siblings';

import GlobalStyles, {Colors} from '../../../styles';
import {Text, InputBox} from '../../../components/common';
import {useTheme} from '~styles/ThemeProvider';

function ClientDetailModal({
  visible = false,
  numOfPersons = 0,
  onClose,
  callback,
}) {
  const [clientDetail] = useState([]);
  const [persons, setPersons] = useState([]);

  const {colors} = useTheme();
  useEffect(() => {
    setPersons(
      Array(numOfPersons)
        .fill()
        .map((_, i) => ({key: `${i}`})),
    );
  }, [visible]);

  const handleFormSubmit = (val, key) => {
    const {fullName, nationality, documentNo, passportExp} = val;
    let passportExpiry = passportExp
      ? moment(passportExp).format('YYYY-MM-DD')
      : '';
    let personObj = {
      index: key,
      fullName: fullName,
      nationality: nationality,
      documentNo: documentNo,
      passportExpiry: passportExpiry,
    };
    const index = clientDetail
      .map((object) => object.index)
      .indexOf(personObj.index);
    clientDetail.length === 0
      ? clientDetail.push(personObj)
      : index > -1
      ? clientDetail.splice(index, 1, personObj)
      : clientDetail.push(personObj);
    callback(clientDetail);
  };

  const Wrapper = RootSiblingParent;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Wrapper>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <TouchableWithoutFeedback
            onPress={() => {
              onClose();
            }}>
            <View needsOffscreenAlphaCompositing style={{height: 150}} />
          </TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              borderTopRightRadius: 50,
              borderTopLeftRadius: 50,
              elevation: 8,
              paddingBottom: 20,
              backgroundColor: colors.modal,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.modal,
                paddingHorizontal: 15,
                borderTopRightRadius: 50,
                borderTopLeftRadius: 50,
              }}>
              {persons.map((item) => (
                <Formik
                  initialValues={{
                    fullName:
                      clientDetail &&
                      clientDetail[item.key] &&
                      clientDetail[item.key].fullName
                        ? clientDetail[item.key].fullName
                        : '',
                    nationality:
                      clientDetail &&
                      clientDetail[item.key] &&
                      clientDetail[item.key].nationality
                        ? clientDetail[item.key].nationality
                        : '',
                    documentNo:
                      clientDetail &&
                      clientDetail[item.key] &&
                      clientDetail[item.key].documentNo
                        ? clientDetail[item.key].documentNo
                        : '',
                    passportExp:
                      clientDetail &&
                      clientDetail[item.key] &&
                      clientDetail[item.key].passportExp
                        ? clientDetail[item.key].passportExpß
                        : '',
                  }}
                  onSubmit={
                    (data) => handleFormSubmit(data, item.key)
                    // setClientDetail((clientDetail[item.key] = data))
                  }>
                  {({handleChange, handleSubmit, values}) => (
                    <View
                      style={{
                        backgroundColor: colors.modal,
                        marginTop: 30,
                      }}>
                      <Text
                        h4
                        style={{marginTop: 5, marginLeft: 20}}
                        color={colors.text}>
                        {`Customer ID ${parseFloat(item.key) + 1}`}
                      </Text>
                      <Text
                        h4
                        style={{marginTop: 5, marginLeft: 20}}
                        color={colors.text}>
                        Full Name
                      </Text>
                      <TextInput
                        value={values.fullName}
                        onChangeText={handleChange('fullName')}
                        style={GlobalStyles().inputStyle}
                        onEndEditing={handleSubmit}
                      />

                      <Text
                        h4
                        style={{marginTop: 5, marginLeft: 20}}
                        color={colors.text}>
                        Nationality
                      </Text>
                      <TextInput
                        value={values.nationality}
                        onChangeText={handleChange('nationality')}
                        style={GlobalStyles().inputStyle}
                        onEndEditing={handleSubmit}
                      />

                      <Text
                        h4
                        style={{marginTop: 5, marginLeft: 20}}
                        color={colors.text}>
                        Document No.
                      </Text>
                      <TextInput
                        value={values.documentNo}
                        onChangeText={handleChange('documentNo')}
                        style={GlobalStyles().inputStyle}
                        keyboardType="numeric"
                        onEndEditing={handleSubmit}
                      />

                      <Text
                        h4
                        style={{marginTop: 5, marginLeft: 20}}
                        color={colors.text}>
                        Passport Expiry
                      </Text>
                      <InputBox
                        value={values.passportExp}
                        theme={{colors: {primary: Colors.primary[0]}}}
                        style={{height: 50, width: 95, borderRadius: 10}}
                        underlineColor="transparent"
                        isDatePicker
                        callback={(val) => (values.passportExp = val)}
                        handleSubmit={handleSubmit}
                      />
                      {/* {datePicker === true ? (
                        <>
                          <DatePicker
                            key={item.key}
                            minimumDate={new Date()}
                            style={{
                              backgroundColor: colors.inputColor,
                              marginHorizontal: 20,
                              marginTop: 5,
                              borderRadius: 4,
                              width: Dimensions.get('screen').width - 70,
                              color: colors.text,
                            }}
                            date={
                              values.passportExpiry
                                ? new Date(values.passportExpiry)
                                : new Date()
                            }
                            onDateChange={(date) =>
                              (values.passportExpiry =
                                moment(date).format('YYYY-MM-DD'))
                            }
                            onConfirm={handleSubmit}
                            mode="date"
                          />
                          <TouchableOpacity
                            style={{
                              marginBottom: 20,
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}
                            onPress={
                              () => handleDate()
                              //  setDatePicker(false)
                            }>
                            <Text h4 color={colors.text}>
                              Done
                            </Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          onPress={
                            () => handleDate()
                            // setDatePicker(true)
                          }>
                          <TextInput
                            style={GlobalStyles().inputStyle}
                            editable={false}
                            value={
                              values.passportExpiry
                                ? moment(values.passportExpiry).format(
                                    'YYYY-MM-DD',
                                  )
                                : ''
                            }
                          />
                        </TouchableOpacity>
                      )} */}

                      {/* <View style={{paddingHorizontal: 20, marginVertical: 10}}>
                        <Button
                          h4
                          onPress={
                            handleSubmit
                            // this.onHandleSubmit(params.tour.id, city, stop)
                          }>
                          Save Info
                        </Button>
                      </View> */}
                    </View>
                  )}
                </Formik>
              ))}

              <TouchableOpacity
                onPress={() => {
                  onClose();
                }}
                style={{
                  position: 'absolute',
                  right: 30,
                  top: 20,
                }}>
                <Icons name="cross" size={25} color={Colors.grey[3]} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Wrapper>
    </Modal>
  );
}

// const styles = StyleSheet.create({
//   inputContainerStyle: {
//     height: 50,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderBottomWidth: 1,
//     backgroundColor: Colors.grey[5],
//   },
// });

const mapStateToProps = (state) => {
  const {profileData} = state.profile;

  return {
    profileData,
  };
};

export default connect(mapStateToProps, {})(ClientDetailModal);
