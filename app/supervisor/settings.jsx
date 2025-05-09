import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';

const app = () => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="#004158" />
                </Link>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Link href="" style={styles.option}>
                    <Icon name="notifications" size={30} color="#004158" />
                    <Text style={styles.optionText}>    Notification Settings</Text>
                </Link>
                <Link href="" style={styles.option}>
                    <Icon name="security" size={30} color="#004158" />
                    <Text style={styles.optionText}>    Privacy & Security</Text>
                </Link>
                <Link href="/supervisor/help" style={styles.option}>
                    <Icon name="help" size={30} color="#004158" />
                    <Text style={styles.optionText}>    Help & Support</Text>
                </Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'tan',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 30,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#004158',
    },
    content: {
        padding: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
        width: '100%',
        color: '#004158',
        textAlign: 'center',
    },
});

export default app;