import { BASE_URL } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const placeOrder = async (data: any) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(BASE_URL + "/api/products/create-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    console.log("res", res);
    const resData = await res.json();
    console.log("resData", resData);
    return resData;
  } catch (error) {
    console.log(error);
  }
};

export const getOrders = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(BASE_URL + "/api/products/get-products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
};

export const markCompleted = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(
      BASE_URL + `/api/products/mark-product-complete/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
};

export const removeCompletedProducts = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(
      BASE_URL + "/api/products/remove-completed-products",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
};
