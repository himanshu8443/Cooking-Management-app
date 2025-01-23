import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { BASE_URL } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const TEST_USERNAME = "cook@mail.com";
  const TEST_PASSWORD = "123";

  const onLogin = async () => {
    try {
      setLoading(true);
      console.log("username", Username);
      console.log("password", Password);
      const res = await fetch(BASE_URL + "/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: Username, password: Password }),
      });
      const data = await res.json();
      console.log(data.token);

      if (data?.success === false) {
        ToastAndroid.show(data.error, ToastAndroid.SHORT);
      } else {
        await AsyncStorage.setItem("user", JSON.stringify(data?.data));
        router.push("/home");
      }
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("token");
      console.log("user", user);
      if (user) {
        router.replace("/");
      }
    };
    checkUser();
  }, []);
  return (
    <View className="p-20">
      <Text className="text-5xl font-extrabold w-full text-center">Login</Text>
      <View className="mt-[50%] flex flex-col gap-14">
        <View className=" ">
          <Text className="text-lg font-semibold">Username or Email</Text>
          <TextInput
            className="border-2 border-gray-300"
            value={Username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View className=" ">
          <Text className="text-lg font-semibold">Password</Text>
          <TextInput
            className="border-2 border-gray-300"
            value={Password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity
          onPress={onLogin}
          className="bg-blue-500 p-3 rounded-lg"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-center">Login</Text>
          )}
        </TouchableOpacity>
      </View>
      {/* test credentials */}
      <View className="mt-8 flex-col gap-5">
        <Text className="text-lg font-semibold">Test Credentials</Text>
        <View className="flex-row gap-5">
          <Text className="text-xl">Username: {TEST_USERNAME}</Text>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(TEST_USERNAME);
              ToastAndroid.show(
                "Username copied to clipboard",
                ToastAndroid.SHORT
              );
            }}
          >
            <FontAwesome5 name="copy" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-5">
          <Text className="text-xl">Password: {TEST_PASSWORD}</Text>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(TEST_PASSWORD);
              ToastAndroid.show(
                "Password copied to clipboard",
                ToastAndroid.SHORT
              );
            }}
          >
            <FontAwesome5 name="copy" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default index;
