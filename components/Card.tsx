import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

type CardProps = {
  id: number;
  dishName: string;
  quantity: number;
  isAddon: boolean;
  subscriberNotes: string;
  status: string;
  markAsCompleted: (id: string) => void;
};
const Card = ({
  id,
  dishName,
  quantity,
  isAddon,
  subscriberNotes,
  status,
  markAsCompleted,
}: CardProps) => {
  return (
    <View
      key={id}
      className="border border-black/10 p-2 rounded-lg mt-2 bg-white"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          <MaterialIcons name="food-bank" size={30} color="#3b82f6" />
          <Text className="text-2xl font-semibold">{dishName}</Text>
        </View>
        {isAddon && (
          <Text className="font-semibold text-red-700 border-red-700 border rounded-full p-1 px-2 bg-red-500/15">
            Addon
          </Text>
        )}
        <Text className=" font-semibold border-blue-600 text-blue-700 border rounded-full p-1 px-2 bg-blue-500/15">
          Qty: {quantity}
        </Text>
      </View>
      <View className="flex flex-row gap-1 items-center mt-5">
        <Feather name="info" size={15} color="black" />
        <Text className="text-sm font-medium">{subscriberNotes}</Text>
      </View>
      {status === "completed" ? (
        <Text className="bg-green-500 text-white text-center p-2 rounded-lg mt-2">
          Completed
        </Text>
      ) : (
        <TouchableOpacity
          onPress={() => markAsCompleted(id.toString())}
          className="border-2 border-green-500 p-2 rounded-lg mt-2"
        >
          <Text className="text-green-500 text-center">Mark as completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Card;
