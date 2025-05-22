import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const App = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [activeReplyId, setActiveReplyId] = useState(null); // Tracks which feedback is being replied to
    const [replyText, setReplyText] = useState('');
    const { id: supervisor_id } = useLocalSearchParams();  // Extract supervisor_id from URL

    useEffect(() => {
        if (supervisor_id) {
            // Fetch feedback for the supervisor
            axios.get(`http://192.168.100.47:5050/api/feedback/${supervisor_id}`)
                .then(res => setFeedbackList(res.data))
                .catch(err => console.log('Error fetching feedback:', err));
        }
    }, [supervisor_id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const suffix = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day}${suffix(day)} ${month}, ${year}`;
    };

    const handleReplySubmit = async (feedback_id) => {
        try {
            if (!replyText.trim()) {
                alert('Reply cannot be empty');
                return;
            }
    
            if (!feedback_id) {
                alert('Feedback ID is required');
                return;
            }
    
            const payload = {
                feedback_id: feedback_id,
                reply: replyText
            };
    
            await axios.post(`http://192.168.100.47:5050/api/reply/${feedback_id}`, payload);
    
            alert('Reply sent successfully ✅');
    
            // Reset UI and fetch updated feedback
            setReplyText('');
            setActiveReplyId(null);
            axios.get(`http://192.168.100.47:5050/api/feedback/${supervisor_id}`)
                .then(res => setFeedbackList(res.data));
        } catch (err) {
            console.error('Error submitting reply:', err);
            alert('Failed to send reply ❌');
        }
    };
    

    const renderFeedbackItem = ({ item }) => (
        <View style={styles.feedbackItem}>
            <Text style={styles.volunteerName}>{item.volunteer_name}</Text>
            <Text style={styles.taskName}>{item.task_name}</Text>
            <Text style={styles.feedbackText}>{item.feedback}</Text>
            <Text style={styles.feedbackDate}>Submitted on {formatDate(item.date_submitted)}</Text>

            <TouchableOpacity
                onPress={() => setActiveReplyId(activeReplyId === item.id ? null : item.id)}
                style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}
            >
                <Icon name="message" size={20} color="#004158" />
                <Text style={{ marginLeft: 6, color: '#004158' }}>Reply</Text>
            </TouchableOpacity>

            {activeReplyId === item.id && (
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        placeholder="Write a reply..."
                        value={replyText}
                        onChangeText={setReplyText}
                        style={styles.replyInput}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={() => handleReplySubmit(item.id)} // Pass the feedback_id here
                        style={styles.replyButton}
                    >
                        <Text style={styles.replyButtonText}>Send Reply</Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.reply && (
                <View style={styles.replyBox}>
                    <Text style={styles.replyLabel}>Your Reply:</Text>
                    <Text style={styles.replyText}>{item.reply}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#004158" />
                </Link>
                <Text style={styles.headerTitle}> Feedback</Text>
            </View>

            <FlatList
                data={feedbackList}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.feedbackList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'tan',
        marginTop: 25,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 36,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#004158',
    },
    feedbackList: {
        padding: 12,
    },
    feedbackItem: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    volunteerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#004158',
    },
    taskName: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    feedbackText: {
        fontSize: 15,
        color: '#004158',
        marginTop: 10,
        lineHeight: 20,
    },
    feedbackDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 12,
        textAlign: 'right',
    },
    replyInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        minHeight: 40,
        textAlignVertical: 'top',
    },
    replyButton: {
        backgroundColor: '#004158',
        borderRadius: 6,
        padding: 8,
        alignItems: 'center',
        marginTop: 6,
    },
    replyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    replyBox: {
        marginTop: 10,
        backgroundColor: '#e6f7ff',
        padding: 10,
        borderRadius: 8,
    },
    replyLabel: {
        fontWeight: 'bold',
        color: '#004158',
    },
    replyText: {
        marginTop: 4,
        color: '#004158',
    },
});

export default App;
