import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useLocalSearchParams, useRouter } from "expo-router";

const App = () => {
    const { role, id } = useLocalSearchParams(); // get role & supervisor_id from params
    const supervisor_id = id; // use logged-in supervisor's ID
    console.log("useLocalSearchParams id:", id);
console.log("Supervisor ID being used:", supervisor_id);
    const router = useRouter();
    const [projects, setProjects] = useState([]);

    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        if (supervisor_id) {
            fetchProjects();
        }
    }, [supervisor_id]);
    
    const fetchProjects = async () => {
        try {
            const res = await fetch(`http://192.168.101.180:5000/api/projects/${Number(supervisor_id)}`);
            const data = await res.json();
            console.log("Fetched projects: ", data);
    
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                console.warn("Expected an array but got:", data);
            }
        } catch (err) {
            console.error("Fetch projects error: ", err);
            alert("Error fetching projects");
        }
    };
    
    

    const handleAddProject = async () => {
        const { title, description, start_date, end_date } = newProject;

        if (title && description && start_date && end_date) {
            try {
                const response = await fetch("http://192.168.101.180:5000/api/projects/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: title,
                        description,
                        supervisor_id, // pass the logged-in supervisor's ID
                        start_date,
                        end_date,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setProjects([
                        ...projects,
                        {
                            id: data.projectId,
                            name: title, // ✅ fixed
                            description,
                            supervisor_id,
                            start_date,
                            end_date
                        }
                    ]);
                    setNewProject({ title: '', description: '', start_date: '', end_date: '' });
                    alert("Project added successfully!");
                } else {
                    alert(data.error || "Failed to add project");
                }
            } catch (error) {
                console.error("Add Project Error:", error);
                alert("Something went wrong!");
            }
        } else {
            alert("Please fill all fields!");
        }
    };

    const renderProjectItem = ({ item }) => (
        <TouchableOpacity style={styles.projectItem}>
          <Text style={styles.projectTitle}>{item.name}</Text>
          <Text style={styles.projectDescription}>{item.description}</Text>
          <Text style={styles.projectProjectId}>Project ID: {item.id}</Text> {/* Show Project ID */}
          <Text style={styles.projectDate}>Start date: {new Date(item.start_date).toLocaleDateString()}</Text>
          <Text style={styles.projectDate}>End date: {new Date(item.end_date).toLocaleDateString()}</Text>
        </TouchableOpacity>
      );
      

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
                  <Text> <Icon name="arrow-back" size={24} color="#004158" /> </Text>
                </Link>
                <Text style={styles.headerTitle}>Projects</Text>
            </View>

            <FlatList
                data={projects}
                renderItem={renderProjectItem}
                keyExtractor={(item) => item.id?.toString()}
                scrollEnabled={false}
            />

            <View style={styles.addProjectContainer}>
                <Text style={styles.formTitle}>Add New Project</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={newProject.title}
                    onChangeText={(text) => setNewProject({ ...newProject, title: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Short Description"
                    value={newProject.description}
                    onChangeText={(text) => setNewProject({ ...newProject, description: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Start Date (YYYY-MM-DD)"
                    value={newProject.start_date}
                    onChangeText={(text) => setNewProject({ ...newProject, start_date: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="End Date (YYYY-MM-DD)"
                    value={newProject.end_date}
                    onChangeText={(text) => setNewProject({ ...newProject, end_date: text })}
                />

                <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
                    <Text style={styles.addButtonText}>Add Project</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'tan',
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
    projectItem: {
        padding: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#004158',
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#004158',
    },
    projectDescription: {
        fontSize: 14,
        color: '#004158',
        marginTop: 4,
    },
    projectDate: {
        fontSize: 14,
        color: '#004158',
        marginTop: 4,
    },
    projectVolunteers: {
        fontSize: 14,
        color: '#004158',
        marginTop: 4,
    },
    addProjectContainer: {
        marginTop: 20,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#004158',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#004158',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        paddingHorizontal: 8,
        color: '#004158',
    },
    addButton: {
        backgroundColor: '#004158',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    projectProjectId: {
        fontSize: 14,
        color: '#004158',
        marginTop: 4,
        fontStyle: 'italic',
      },
      
});

export default App;
