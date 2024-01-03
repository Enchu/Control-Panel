import React, {createContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";

export const AuthContext = createContext({});

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoadingInitial ,setIsLoadingInitial] = useState(true);
  const [isLoading, setIsIsLoading] = useState(true);
  const [ipSetup, setIpSetup] = useState('');

  const loginHandler = async (email, password, ip) => {
    setIsIsLoading(true);
    console.log(ip)

    if(ip != null){
      setIpSetup(ip);
      console.log(ipSetup)
    }else{
      setIpSetup('10.0.2.2:5001')
      console.log(ipSetup)
    }

    if(email != null && password != null){

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'));
        }, 2000);
      });

      try {
        const responsePromise = await fetch(`http://10.0.2.2:5001/api/table/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login: email.text, password: password.text }),
        });

        const response = await Promise.race([responsePromise, timeoutPromise]);

        if (!response || response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        const jwtToken = responseData.result.token;

        await AsyncStorage.setItem('jwtToken', jwtToken);
        setUser(jwtToken);

        return jwtToken;
      }catch(e) {
        console.log('Error login', e.message);
        throw e;
      }finally {
        setIsIsLoading(false);
      }
    }
  }

  const registerHandler = async (email, password) => {
    setIsIsLoading(true);

    if(email != null && password != null){
      try {
        /*await register(email, password)*/
      }catch(e) {
        Alert.alert('Error register', e.message);
      }finally {
        setIsIsLoading(false);
      }
    }
  }

  const logOutHandler = () =>{
    try {
      setUser(null);
    }catch(e) {
      Alert.alert('Error login', e.message);
    }finally {
      setIsIsLoading(false);
    }
  }

  const value = useMemo(() => ({
    user, login: loginHandler, logout: logOutHandler, register: registerHandler(), isLoadingInitial, isLoading
  }), [user, isLoading]);

  useEffect(() => {
    setUser(null)
    setIsLoadingInitial(false)
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!isLoadingInitial && children}
    </AuthContext.Provider >
  );
};

export default AuthProvider;
