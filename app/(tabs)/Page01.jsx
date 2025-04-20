import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import colors from '../../assets/colors';
import logo from '../../assets/images/logo.png';
import { useEffect, useState } from 'react';
import { readFromDatabase } from "../../firebaseConfig";

export default function Page01() {
    const [soilData, setSoilData] = useState(null); // Initialize as null to indicate loading
    const id = 1; // Define id as a constant

    useEffect(() => {
        // Fetch data from the database only once when the component mounts
        const fetchData = async () => {
            try {
                const data = await readFromDatabase('data');
                setSoilData(data);
            } catch (error) {
                console.error("Error reading data from database:", error);
            }
        };

        fetchData();
    }, [soilData]); // Empty dependency array ensures this runs only once

    // Display loading message while data is being fetched
    if (!soilData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
            </View>
        );
    }

    // Check if the device ID matches
    if (soilData.device_id !== Number(id)) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>لا توجد بيانات لهذا المعرف: {id}</Text>
            </View>
        );
    }

    // Destructure sensor data from soilData
    const { N, P, K, ph, temperature, humidity, rainfall ,soil_moisture } = soilData.sensors_data;

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

            {/* Table */}
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.header}>العنصر</Text>
                    <Text style={styles.header}>القيمة</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>N (kg/ha)</Text>
                    <Text style={styles.cell}>{N}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>P (kg/ha)</Text>
                    <Text style={styles.cell}>{P}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>K (kg/ha)</Text>
                    <Text style={styles.cell}>{K}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>PH</Text>
                    <Text style={styles.cell}>{ph}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>درجة الحرارة (C°)</Text>
                    <Text style={styles.cell}>{temperature}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>الرطوبة (%)</Text>
                    <Text style={styles.cell}>{humidity}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>تساقط الأمطار (mm)</Text>
                    <Text style={styles.cell}>{rainfall}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}> رطوبة التربة(%)</Text>
                    <Text style={styles.cell}>{soil_moisture}</Text>
                </View>
            </View>

            {/* Button */}
            <Link href="/Page02" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>توصيات</Text>
                </TouchableOpacity>
            </Link>
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
    table: {
        borderWidth: 1,
        borderColor: colors.green,
        borderRadius: 10,
        marginBottom: 120,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.green,
    },
    header: {
        fontWeight: 'bold',
        color: colors.green,
    },
    cell: {
        color: colors.olive,
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