import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";

export const RESP = async (url, method, data = {}) => {
  try {
    const config = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
      config.data = data;
    }

    const response = await axios(`${url}`, config);

    if (!response.data) {
      throw new Error('Network response was not ok');
    }

    return response.data;
  } catch (error) {
    console.log('Error: ', error.message);
    return null;
  }
};

export const RESPBODY = async (BEARERTOKEN, url, method, timeout) => {
  const config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARERTOKEN}`
    },timeout: timeout
  };

  try {
    const response = await axios(url, config);

    return response.data;
  } catch (error) {
    console.log('Error RESPBODY: ', error);
    throw error;
  }
};
