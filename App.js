import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Button,
  Text,
  View,
  ImageBackground,
  ScrollView,
} from "react-native";
import ImagePickerExample from "./ImagePickerExample";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export default function App() {
  return (
    <ScrollView>
      <Text style={{ paddingTop: 200 }}>
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
      <ImagePickerExample />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
