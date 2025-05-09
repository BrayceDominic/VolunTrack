import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const app = () => {
    const [profile, setProfile] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        organization: '',
        location: '',
        image: 'https://placeimg.com/140/140/any',
    });

    useEffect(() => {
        const loadProfile = async () => {
            const saved = await AsyncStorage.getItem('userProfile');
            if (saved) {
                setProfile(JSON.parse(saved));
            }
        };
        loadProfile();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#004158" />
                </Link>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Image
                    source={{ uri: profile.image }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.role}>{profile.role}</Text>

                <Link href="/supervisor/editProfile" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </Link>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{profile.email}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>{profile.phone}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Organization</Text>
                    <Text style={styles.infoValue}>{profile.organization}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{profile.location}</Text>
                </View>
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
        borderBottomColor: '#004158',
        marginTop: 38,
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
        alignItems: 'center',
        padding: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#004158',
    },
    role: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 14,
        width: '20%',
    },
    button: {
        backgroundColor: '#004158',
        padding: 16,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: -8,
    },
    buttonText: {
        color: 'tan',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoContainer: {
        width: '100%',
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 14,
        color: 'gray',
    },
    infoValue: {
        fontSize: 16,
        color: '#004158',
    },
});

export default app;