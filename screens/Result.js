import * as React from 'react';
import { View, useWindowDimensions, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from 'expo-constants';

const API_URL = Constants.manifest.env.API_URL

function Result({ route }) {
    var { confidence, description, food_name, image_path, cook } = route.params;
    const layout = useWindowDimensions();
    const navigation = useNavigation();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Description' },
        { key: 'second', title: 'How to cook' },
    ]);
    const [isLoading, setIsLoading] = React.useState(false)
    const FirstRoute = (props) => (
        <ScrollView>
            <View style={{ flex: 1, backgroundColor: 'white', paddingVertical: props.layout < 375 ? 10 : 15, paddingHorizontal: props.layout.width < 375 ? 5 : 10 }}>
                <Text style={{ fontSize: props.layout < 375 ? 15 : 17, color: 'black', lineHeight: props.layout < 375 ? 30 : 35, textAlign: 'justify' }}>{'\t'}{props.description}</Text>
            </View>
        </ScrollView>

    );

    const SecondRoute = (props) => (
        <ScrollView>
            <View style={{ flex: 1, backgroundColor: 'white', paddingVertical: props.layout < 375 ? 10 : 15, paddingHorizontal: props.layout.width < 375 ? 5 : 10 }}>
                <Text style={{fontWeight: 'bold', fontSize: props.layout < 375 ? 15 : 17, color: 'black', lineHeight: props.layout < 375 ? 30 : 35, textAlign: 'justify' }}>Ingredients:</Text>
                {
                    props.cook.Ingredients.map((item, index) => <Text key={index} style={{ marginLeft: 5, fontSize: props.layout < 375 ? 15 : 17, color: 'black', lineHeight: props.layout < 375 ? 30 : 35, textAlign: 'justify' }} >+ {item}</Text>)
                }
                <Text style={{ fontWeight: 'bold', fontSize: props.layout < 375 ? 15 : 17, color: 'black', lineHeight: props.layout < 375 ? 30 : 35, textAlign: 'justify' }}>Steps:</Text>
                {
                    props.cook.Steps.map((item, index) => <Text key={index} style={{ marginLeft: 5, fontSize: props.layout < 375 ? 15 : 17, color: 'black', lineHeight: props.layout < 375 ? 30 : 35, textAlign: 'justify' }} >Step {index + 1}: {item}</Text>)
                }
            </View>
        </ScrollView>
    );

    const renderScene = SceneMap({
        first: (props) => <FirstRoute {...props} layout={layout.width} description={description} />,
        second: (props) => <SecondRoute {...props} layout={layout.width} cook={cook} />,
    });

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // Ngăn người dùng quay lại màn hình PickScreen
            e.preventDefault();
        });

        return unsubscribe;

    }, [navigation]);

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
        <View style={{ flex: 1, }}>
            {isLoading ? <Spinner visible={isLoading} /> :
                <>
                    <View style={{ flex: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ marginVertical: layout.width < 375 ? 10 : 20, width: layout.width < 375 ? 110 : 160, height: layout.width < 375 ? 110 : 160, borderColor: 'white', borderWidth: 5, borderRadius: 10 }}>
                            <Image source={{ uri: API_URL + image_path }} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: layout.width < 375 ? 16 : 22 }}>{food_name}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: layout.width < 375 ? 12 : 14, color: 'gray', marginTop: 10 }}>(Confidence: {confidence})</Text>
                        </View>
                    </View>
                    <View style={{ flex: 60, backgroundColor: 'white' }}>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                        />
                    </View>
                    <View style={{ position: 'absolute', bottom: layout.width < 375 ? -40 : -30, right: layout.width < 375 ? 10 : 20, alignItems: 'center', transform: [{ translateY: -50 }] }}>
                        <TouchableOpacity onPress={pickImage} style={{ width: layout.width < 375 ? 50 : 65 , height: layout.width < 375 ? 50 : 65, padding: 3, borderColor: "#f2f2f2", borderWidth: layout.width < 375 ? 2 : 5, borderRadius: 50, backgroundColor: "#f2f2f2" }}>
                            <Icon name="add-a-photo" size={layout.width < 375 ? 35 : 45} color="#2293f4" />
                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
    );
}

export default Result;