import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = Constants.manifest.env.API_URL;
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

const HistoryScreen = () => {
  // Sample data for the list
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const histories = await AsyncStorage.getItem("histories");
      if (histories) {
        const loadedData = histories ? JSON.parse(histories) : [];
        setData(loadedData);
      }
    };
    fetch();
    return () => {};
  }, []);

  // Render each item in the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Result", item);
      }}
      style={styles.itemContainer}
    >
      <Image
        style={styles.itemImage}
        source={{ uri: API_URL + item?.image_path }}
      />
      <Text style={styles.itemTitle}>{item?.food_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white", // Set the background color of the container
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 20, // Set the margin-top
    backgroundColor: "#2293f4",
    color: "white", // Set the text color of the title
    padding: 8, // Add padding to the title
    borderRadius: 8, // Add border-radius to the title
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 18,
  },
});
export default HistoryScreen;
