import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking, ScrollView, SafeAreaView, StatusBar, Platform } from "react-native";
import { Link } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialIcons';

const App = () => {
    const [report, setReport] = useState({
        week_start: new Date().toLocaleDateString(),
        tasks_completed: '',
        challenges: '',
        recommendations: '',
    });

    const generateEmailContent = () => {
        const { week_start, tasks_completed, challenges, recommendations } = report;
        const subject = `Task Report - ${week_start}`;
        const body = `
Tasks Completed:
${tasks_completed}

Challenges Faced:
${challenges}

Recommendations:
${recommendations}
        `;
        return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleSubmit = () => {
        const emailLink = generateEmailContent();
        Linking.openURL(emailLink).catch(err => console.error("Failed to open email client:", err));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                backgroundColor="#004158"
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
            />
            <View style={styles.header}>
                <Link href="/volunteer/VolunteerDashboard" style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#004158" />
                </Link>
                <Text style={styles.headerTitle}>Task Report</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TextInput
                    style={styles.input}
                    placeholder="Week Start Date (DD-MM-YYYY)"
                    value={report.week_start}
                    onChangeText={text => setReport({ ...report, week_start: text })}
                />
                <TextInput
                    style={[styles.input, styles.largeInput]}
                    placeholder="Tasks completed"
                    multiline
                    value={report.tasks_completed}
                    onChangeText={text => setReport({ ...report, tasks_completed: text })}
                />
                <TextInput
                    style={[styles.input, styles.largeInput]}
                    placeholder="Challenges"
                    multiline
                    value={report.challenges}
                    onChangeText={text => setReport({ ...report, challenges: text })}
                />
                <TextInput
                    style={[styles.input, styles.largeInput]}
                    placeholder="Recommendations"
                    multiline
                    value={report.recommendations}
                    onChangeText={text => setReport({ ...report, recommendations: text })}
                />
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit Report</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'tan',
        marginTop: 26,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: 'tan',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#004158',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 120, // ensures content is above bottom bar
    },
    input: {
        padding: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    largeInput: {
        height: 180,
        textAlignVertical: 'top',
        backgroundColor: 'white',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'tan',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    button: {
        backgroundColor: '#004158',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default App;
