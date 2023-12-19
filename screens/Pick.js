import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from 'expo-constants';

const welcome_image = require('../assets/welcome_image.png')
const API_URL = Constants.manifest.env.API_URL

function Pick({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(false)

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setIsLoading(true)
            const formData = new FormData();
            formData.append('image', {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'my_image.jpg',
            });
            axios.post(
                API_URL,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            .then((response) => {
                setIsLoading(false)
                navigation.navigate('Result', {
                    confidence: response.data.confidence,
                    description: response.data.description,
                    food_name: response.data.food_name,
                    image_path: response.data.image_path,
                    cook: response.data.cook
                });
            })
            .catch((error) => {
                setIsLoading(false)
                alert("Lỗi: " + error)
            })
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? <Spinner visible={isLoading} /> :
                <>
                    <View style={styles.top}>
                        <View style={{ marginTop: 50, width: 150, height: 150, borderRadius: 50, borderColor: '#2293f4', borderWidth: 1, backgroundColor: '#2293f4' }}>
                            <Image source={welcome_image} style={{ marginTop: 10, marginLeft: 10, width: 128, height: 128 }} />
                        </View>
                    </View>
                    <View style={styles.mid}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }} >Nhận Dạng Món Ăn Việt Nam</Text>
                        <Text style={{ fontSize: 16, color: 'gray', marginTop: 20, lineHeight: 30, marginHorizontal: 18 }} >Ứng dụng cho phép nhận dạng và đưa ra thông tin của 30 món ăn đường phố VN</Text>
                    </View>
                    <View style={styles.bottom}>
                        <TouchableOpacity style={styles.button} onPress={pickImage}>
                            <Text style={{ color: 'white' }}>Chọn Ảnh - Đồ Ăn Cần Nhận Dạng</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2'
    },
    top: {
        flex: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mid: {
        flex: 30,
        alignItems: 'center',
    },
    bottom: {
        flex: 20
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#2293f4',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#2293f4',
    },
});


export default Pick
