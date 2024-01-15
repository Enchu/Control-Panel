import React, {createContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import axios from "axios";

export const AuthContext = createContext({});

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoading, setIsIsLoading] = useState(true);
  const [ipSetup, setIpSetup] = useState('');

  const loginHandler = async (email, password, ip) => {
    setIsIsLoading(true);
    setIpSetup(ip);

    console.log(email);
    console.log(password);
    console.log(ip);

    if (email.trim() !== '' && password.trim() !== '') {
      console.log('прошле email и пароль');

      try {
        console.log('прошле try');
        //Alert.alert(`http://${ip}/api/table/auth`)
        const response = await axios.post(`http://${ip}/api/table/auth`, {
          login: email.text,
          password: password.text
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log(response);

        /*if (!response || response.status !== 200) {
          throw new Error('Network response was not ok');
        }*/

        const responseData = await response.data;
        const jwtToken = responseData.result.token;

        await AsyncStorage.setItem('jwtToken', jwtToken);
        setUser(jwtToken);

        return jwtToken;
      } catch (e) {
        console.log('Error login', e.message);
        throw e;
      } finally {
        setIsIsLoading(false);
      }
    } else {
      return null;
    }
  };

  const registerHandler = async (email, password) => {
    setIsIsLoading(true);

    if (email != null && password != null) {
      try {
        /*await register(email, password)*/
      } catch (e) {
        Alert.alert('Error register', e.message);
      } finally {
        setIsIsLoading(false);
      }
    }
  };

  const logOutHandler = () => {
    try {
      setUser(null);
    } catch (e) {
      Alert.alert('Error login', e.message);
    } finally {
      setIsIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      login: loginHandler,
      logout: logOutHandler,
      register: registerHandler(),
      isLoadingInitial,
      isLoading,
      ipSetup,
    }),
    [user, isLoading],
  );

  useEffect(() => {
    setUser(null);
    setIsLoadingInitial(false);
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!isLoadingInitial && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
