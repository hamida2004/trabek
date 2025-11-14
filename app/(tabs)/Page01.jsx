import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import colors from '../../assets/colors';
import logo from '../../assets/images/logo.png';
import { useEffect, useState } from 'react';
import { readFromDatabase } from "../../firebaseConfig";

export default function Page01() {
    const [soilData, setSoilData] = useState(null);
    const id = 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await readFromDatabase('data');
                setSoilData(data);
            } catch (error) {
                console.error("Error reading data from database:", error);
            }
        };
        fetchData();
    }, []); // Run only once

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

    const { N, P, K, ph, temperature, humidity, rainfall, soil_moisture } = soilData.sensors_data;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image 
                source={logo}
                style={styles.logo}
                resizeMode='contain'
            />

            <Text style={styles.subtitle}>
                احصل على توصيات محاصيل مخصصة بناءً على تربة أرضك ومناخها
            </Text>

            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.header}>العنصر</Text>
                    <Text style={styles.header}>القيمة</Text>
                </View>
                {[
                    ['N (kg/ha)', N],
                    ['P (kg/ha)', P],
                    ['K (kg/ha)', K],
                    ['PH', ph],
                    ['درجة الحرارة (C°)', temperature],
                    ['الرطوبة (%)', humidity],
                    ['تساقط الأمطار (mm)', rainfall],
                    ['رطوبة التربة(%)', soil_moisture],
                ].map(([label, value], index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.cell}>{label}</Text>
                        <Text style={styles.cell}>{value}</Text>
                    </View>
                ))}
            </View>

            <Link href="/Page02" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>توصيات</Text>
                </TouchableOpacity>
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        marginVertical: 60,
        marginBottom: 120,
    },
    table: {
        borderWidth: 1,
        borderColor: colors.green,
        borderRadius: 10,
        marginBottom: 40,
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
