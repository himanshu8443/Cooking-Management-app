import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import OrderModal from "@/components/OrderModal";
import cook from "../assets/images/cook.png";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const getUser = async () => {
      const user = (await AsyncStorage.getItem("user")) || "{}";
      setUser(JSON.parse(user));
    };
    getUser();
  }, []);
  return (
    <View className="flex flex-col items-center justify-center h-full gap-5">
      <Image source={cook} style={{ width: 300, height: 400 }} />
      {user?.email ? (
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center text-2xl px-2 font-extrabold">
            Dashboard
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center text-2xl px-2 font-extrabold">
            Login
          </Text>
        </TouchableOpacity>
      )}
      {user?.email && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center font-extrabold">
            Create Order
          </Text>
        </TouchableOpacity>
      )}
      {user?.email && (
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            setUser({});
          }}
          className="bg-red-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center font-extrabold">Logout</Text>
        </TouchableOpacity>
      )}

      <OrderModal visible={modalVisible} setVisible={setModalVisible} />
    </View>
  );
};

export default index;
