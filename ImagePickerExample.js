import React, { useState, useEffect } from "react";
import { Button, Text, View, ImageBackground, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import uuidV4 from "./uuid";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export default function ImagePickerExample() {
  const [statusCam, requestCamPermission] = ImagePicker.useCameraPermissions();
  const [statusMedia, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();
  let [images, setImages] = useState([]);

  useEffect(() => {}, []);

  useEffect(async () => {
    let result = await getData("@images");
    if (result) {
      setImages(result);
    } else {
      await storeData("@images", []);
    }
  }, []);

  useEffect(async () => {
    await storeData("@images", images);
  }, [images]);

  let reset = async () => {
    const imagesDir = FileSystem.documentDirectory + "images/";
    await FileSystem.deleteAsync(imagesDir);

    setImages([]);
  };

  let saveImage = async (image) => {
    // This represents the directory we are  putting all images into.
    let file = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "images/"
    );
    let uuid = uuidV4();

    // If this dir isnt created yet, make it
    !file.exists &&
      (await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "images/",
        { intermediates: true }
      )) &&
      console.log("made images Directory");

    // we are creating a file name.
    let filename = `images/${uuid}.jpg`;

    // add the uri to the list.

    //writing the image to the filesystem.
    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + `images/${uuid}.jpg`,
      image.base64,
      { encoding: FileSystem.EncodingType.Base64 }
    );
    return FileSystem.documentDirectory + `images/${uuid}.jpg`;
  };

  //
  const TakeImage = async () => {
    requestMediaPermission();
    requestCamPermission();
    let stored = await getData("@images");

    if (!statusCam || !statusMedia) {
      console.log("no permission");
      return;
    } else {
      let { status } = await ImagePicker.getCameraPermissionsAsync();
      console.log(status);
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      let uri = await saveImage(result);
      setImages([...stored, uri]);
    }
  };

  const pickImage = async () => {
    requestMediaPermission();
    let stored = await getData("@images");
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    console.log(result);

    if (!result.cancelled) {
      let uri = await saveImage(result);
      setImages([...stored, uri]);
    }
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={reset} title="reset"></Button>
        <Button onPress={() => console.log(images)} title="Log"></Button>

        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <Button title="Take a picture" onPress={TakeImage} />
      </View>
      {images &&
        images.map((el) => {
          return (
            <ImageBackground
              key={el}
              source={{ uri: el }}
              style={{ width: 200, height: 200 }}
            >
              <Text style={{ color: "white" }}>{el}</Text>
            </ImageBackground>
          );
        })}
    </ScrollView>
  );
}
