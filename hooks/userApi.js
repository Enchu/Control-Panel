import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const RESP =  async (url, method ,data = {}) => {
  try {
    const response = await fetch(`${url}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return console.log('Network response was not ok') //new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.log('Error: ', error);
  }
}

export const RESPBODY = async (BEARERTOKEN, url, method, timeout) => {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);
  });

  try {
    const responsePromise = fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARERTOKEN}`
      },
    });

    const response = await Promise.race([responsePromise, timeoutPromise]);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.log('Error RESPBODY: ', error);
    throw error;
  }
}
