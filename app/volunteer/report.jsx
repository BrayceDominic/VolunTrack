import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Link } from "expo-router";
import { ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icon library

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
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Link href="/volunteer/VolunteerDashboard" style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#004158" />
                    </Link>
                    <Text style={styles.headerTitle}>Task Report</Text>
                </View>
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
                    value={report.challenges} // Fix: Use report.challenges
                    onChangeText={text => setReport({ ...report, challenges: text })}
                />
                <TextInput
                    style={[styles.input, styles.largeInput]}
                    placeholder="Recommendations"
                    multiline
                    value={report.recommendations}
                    onChangeText={text => setReport({ ...report, recommendations: text })}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit Report</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'tan',
        color: 'tan',
    },
    title: {
        fontSize: 25,
        marginTop: 25,
        marginBottom: 20,
        color: '#004158',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
    input: {
        // borderWidth: 1,
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
    button: {
        backgroundColor: '#004158',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default App;