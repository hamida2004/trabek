import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import colors from '../../assets/colors';
import logo from '../../assets/images/logo.png';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import { readFromDatabase } from "../../firebaseConfig";

export default function Page02() {
    const [soilData, setSoilData] = useState(null);
    const id = 1; // Define id as a constant

    const [selectedCrop, setSelectedCrop] = useState("not");
    const [nextCrop, setNextCrop] = useState("");
    const [recommendations, setRecommendations] = useState(["اختر المحصول أولاً للحصول على التوصيات المتعلقة به."]);

    useEffect(() => {
        // Read soil data only once on component mount
        readFromDatabase("data")
            .then((data) => {
                setSoilData(data);
            })
            .catch((error) => {
                console.error("Error reading data from database:", error);
            });
    }, [soilData]); // Empty dependency array ensures this only runs once.

    const handleAdviceClick = async () => {
        if (!soilData) return;

        const payload = {
            N: soilData.sensors_data.N,
            P: soilData.sensors_data.P,
            K: soilData.sensors_data.K,
            temperature: soilData.sensors_data.temperature,
            humidity: soilData.sensors_data.humidity,
            ph: soilData.sensors_data.ph,
            rainfall: soilData.sensors_data.rainfall,
        };

        try {
            let response;
            let resp;

            if (selectedCrop === "not") {
                // User has not planted yet => crop suggestion
                response = await axios.post("http://localhost:8000/crop", payload);
                setNextCrop(response.data.recommended_crop); // Show next crop suggestion based on soil data
            } else {
                // User has planted => next crop suggestion
                response = await axios.post("http://localhost:8000/next", {
                    ...payload,
                    previous_crop: selectedCrop,
                });

                // Fetch general recommendations for the selected crop
                resp = await axios.post("http://localhost:8000/general", {
                    ...payload,
                    selected_crop: selectedCrop,
                });

                // Update recommendations based on the response
                setRecommendations(resp.data.recommendations);
                setNextCrop(response.data.recommended_crop); // Show next crop suggestion based on the soil data and the selected crop
            }
        } catch (error) {
            console.error("Failed to fetch recommendation:", error);
            setNextCrop("حدث خطأ أثناء الاتصال بالخادم.");
        }
    };

    if (!soilData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
            </View>
        );
    }

    if (soilData.device_id !== Number(id)) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>لا توجد بيانات لهذا المعرف: {id}</Text>
            </View>
        );
    }

    const crops = [
        "أرز", "البسلة الهندية", "الجرام الأسود", "الجوت", "الفاصوليا الحمراء", "الفاصوليا العثة",
        "المونج", "بابايا", "برتقال", "بطاطا", "بطيخ", "تفاح", "جوز الهند", "حمص", "ذرة", "رمان",
        "زيتون", "شعير", "شمام", "طماطم", "عدس", "عنب", "فول", "قمح", "قهوة", "مانجو", "موز",
    ];

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image 
                source={logo}
                style={styles.logo}
                resizeMode='contain'
            />

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                احصل على توصيات محاصيل مخصصة بناءً على تربة أرضك ومناخها
            </Text>

            {/* Recommendations */}
            <View style={styles.recommendations}>
                <Text style={styles.title}>توصيات المحاصيل</Text>
                {recommendations.map((rec, index) => (
                    <Text key={index} style={styles.recommendationText}>
                        {rec}
                    </Text>
                ))}
            </View>

            {/* Next Crop Picker */}
            <View style={styles.nextCrop}>
                <Text style={styles.nextCropLabel}>المحصول السابق</Text>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCrop}
                        onValueChange={(itemValue) => setSelectedCrop(itemValue)}
                        style={styles.picker}
                        itemStyle={{ textAlign: 'right', color: colors.olive }}
                    >
                        <Picker.Item label="اختر محصولك" value="not" />
                        {crops.map((crop, index) => (
                            <Picker.Item label={crop} value={crop} key={index} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.nextCropValue}>
                    محصولك القادم هو: {nextCrop || "لم يتم تحديد محصول بعد"}
                </Text>
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={handleAdviceClick}>
                <Text style={styles.buttonText}>احصل على التوصيات</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
        paddingVertical: 60,
    },
    logo: {
        position: 'absolute',
        top: 40,
        right: 40,
        height: 80,
        width: 120,
    },
    subtitle: {
        fontSize: 16,
        color: colors.olive,
        textAlign: 'center',
        marginBottom: 120,
        marginTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.green,
        textAlign: 'center',
        marginBottom: 10,
    },
    recommendations: {
        marginBottom: 20,
    },
    recommendationText: {
        color: colors.olive,
        marginBottom: 10,
    },
    nextCrop: {
        marginBottom: 20,
    },
    nextCropLabel: {
        color: colors.green,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.olive,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 16,
        width: '100%',
    },
    picker: {
        height: 40,
        width: '100%',
    },
    nextCropValue: {
        color: colors.olive,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 120,
    },
    button: {
        backgroundColor: colors.green,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    loadingText: {
        fontSize: 18,
        color: colors.olive,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    errorText: {
        fontSize: 18,
        color: colors.red,
    },
});