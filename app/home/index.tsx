import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/Card";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrders, markCompleted, removeCompletedProducts } from "@/lib/api";
import { Toast } from "toastify-react-native";

const index = () => {
  const formatedDate = formatDate(new Date());
  const [user, setUser] = useState<any>({});
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await AsyncStorage.getItem("user");
      console.log("user", user);
      if (user) {
        setUser(JSON.parse(user));
      } else {
        router.push("/login");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const resData = await getOrders();
      if (resData?.success === false) {
        Toast.error(resData.error);
      } else {
        setData(resData.data);
      }
      setLoading(false);
    };
    getData();
  }, []);

  const markAsCompleted = async (id: string) => {
    setData((prevData: any) =>
      prevData.map((item: any) => {
        if (item.id === id) {
          return { ...item, status: "Completed" };
        }
        return item;
      })
    );
    const resData = await markCompleted(id);
    if (resData?.success) {
      setData(resData.data);
      Toast.success("Marked as completed");
    } else {
      Toast.error("Failed to mark as completed");
    }
  };

  const clearCompleted = async () => {
    setData((prevData: any) =>
      prevData.filter((item: any) => item.status === "Pending")
    );
    const resData = await removeCompletedProducts();
    if (resData?.success) {
      setData(resData.data);
      Toast.success("Orders cleared");
    } else {
      Toast.error("Failed to clear orders");
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };
  return (
    <SafeAreaView className="p-5">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row gap-5 items-start">
          <MaterialCommunityIcons name="chef-hat" size={50} color="#3b82f6" />
          <View>
            <Text className="text-2xl font-bold">
              Welcome, {user?.firstName}
            </Text>
            <Text className="text-lg">{formatedDate}</Text>
          </View>
          <View className="h-16 flex justify-center items-center">
            <TouchableOpacity
              onPress={logOut}
              className="bg-red-500 rounded-full px-3 py-1"
            >
              <Text className="text-white">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row justify-evenly mt-8 border border-black/35 rounded-lg p-2">
          <View className="">
            <Text className="text-3xl text-center font-semibold">
              {data.length}
            </Text>
            <Text className="text-lg font-medium">Orders</Text>
          </View>
          <View className="">
            <Text className="text-red-500 text-3xl text-center font-semibold">
              {data.filter((item: any) => item.status === "Pending").length}
            </Text>
            <Text className="text-lg font-medium">Pending</Text>
          </View>
          <View className="">
            <Text className="text-green-500 text-3xl text-center font-semibold">
              {data.filter((item: any) => item.status === "Completed").length}
            </Text>
            <Text className="text-lg font-medium">Completed</Text>
          </View>
        </View>
        <View className="mt-10 flex-col gap-3">
          <Text className="text-2xl font-bold mt-5">Orders</Text>
          {data
            .filter((item: any) => item.status === "Pending")
            .map((item: any) => (
              <Card
                id={item._id}
                dishName={item.dishName}
                quantity={item.quantity}
                isAddon={item.isAddon}
                subscriberNotes={item.subscriberNotes}
                status={item.status}
                markAsCompleted={markAsCompleted}
              />
            ))}
          {loading && <ActivityIndicator size="large" color="#3b82f6" />}
          {data.filter((item: any) => item.status === "Pending").length === 0 &&
            !loading && (
              <Text className="text-center text-lg">No orders found</Text>
            )}
        </View>
        <View className="mt-10 flex-col gap-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold mt-5">Completed</Text>
            <TouchableOpacity
              className="bg-red-500 rounded-full px-3 py-1"
              onPress={() => {
                clearCompleted();
              }}
            >
              <Text className="text-white">Clear</Text>
            </TouchableOpacity>
          </View>
          {data
            .filter((item: any) => item.status === "Completed")
            .map((item: any) => (
              <Card
                id={item.id}
                dishName={item.dishName}
                quantity={item.quantity}
                isAddon={item.isAddon}
                subscriberNotes={item.subscriberNotes}
                status={item.status}
                markAsCompleted={markAsCompleted}
              />
            ))}
          {data.filter((item: any) => item.status === "Completed").length ===
            0 && (
            <Text className="text-center text-lg">No orders Completed</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
