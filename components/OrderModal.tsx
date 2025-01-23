import { View, Text, Modal, TextInput } from "react-native";
import React, { useState } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import { TouchableOpacity } from "react-native";
import { Toast } from "toastify-react-native";
import { placeOrder } from "@/lib/api";

const OrderModal = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const [data, setData] = useState({
    dishName: "",
    quantity: "",
    isAddon: false,
    subscriberNotes: "",
  });

  const onSumbit = async () => {
    console.log(data);
    const resData = await placeOrder(data);
    if (resData?.success) {
      Toast.success("Order successfull");
      setVisible(false);
    } else {
      Toast.error("Order failed");
    }
  };

  return (
    <Modal visible={visible} transparent={true} statusBarTranslucent={true}>
      <View className="w-full h-full bg-black/50 flex justify-center items-center">
        <View className="bg-white p-5 rounded-lg w-[90%]">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-semibold">Order</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Fontisto name="close-a" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-col gap-3 mt-5">
            <View className="flex-row gap-3">
              <Text className="text-lg font-semibold w-24">Dish Name</Text>
              <TextInput
                className="border-2 border-gray-300 min-w-[50%] p-2 rounded-lg"
                value={data.dishName}
                onChangeText={(text) => setData({ ...data, dishName: text })}
              />
            </View>
            <View className="flex-row gap-3">
              <Text className="text-lg font-semibold w-24">Quantity</Text>
              <TextInput
                keyboardType="numeric"
                className="border-2 border-gray-300 min-w-[50%] p-2 rounded-lg"
                value={data.quantity.toString()}
                onChangeText={(text) => {
                  setData({ ...data, quantity: text });
                }}
              />
            </View>
            <View className="flex-row gap-3">
              <Text className="text-lg font-semibold w-24">Notes</Text>
              <TextInput
                className="border-2 border-gray-300 min-w-[50%] p-2 rounded-lg"
                value={data.subscriberNotes}
                onChangeText={(text) =>
                  setData({ ...data, subscriberNotes: text })
                }
              />
            </View>
            {/* <View className="flex-row gap-3">
              <Text className="text-lg font-semibold">Addon</Text>
              <TextInput
                className="border-2 border-gray-300 min-w-[50%] p-2 rounded-lg"
                value={data.isAddon.toString()}
                onChangeText={(text) =>
                  setData({ ...data, isAddon: text === "true" })
                }
              />
            </View> */}

            <View className="flex-row justify-center mt-5">
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-lg"
                onPress={() => {
                  onSumbit();
                }}
              >
                <Text className="text-white text-center font-extrabold">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OrderModal;
