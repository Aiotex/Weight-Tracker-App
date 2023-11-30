import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from '../styles/styles.js';

export const Topnav = () => {
    return (
        <View style={styles.topnav}>
            <TouchableOpacity style={styles.openSidenavBtn}><Text style={styles.buttonText}>Open</Text></TouchableOpacity>
            <TouchableOpacity style={styles.addEntryBtn}><Text style={styles.buttonText}>Add</Text></TouchableOpacity>
        </View>   
    )
}

export const Sidenav = () => {
    const handleSidenavClose = () => {
        const updatedEntries = entries.filter((entry) => entry.id !== entryId);
        setEntries(updatedEntries);
    };

    return (
        <View style={styles.sidenav}>
            <TouchableOpacity style={styles.closeSidenavBtn} onClick={() => handleSidenavClose}></TouchableOpacity>
            <TouchableOpacity style={styles.sidenavBtn}><Text style={styles.buttonText}>Option 1</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sidenavBtn}><Text style={styles.buttonText}>Option 2</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sidenavBtn}><Text style={styles.buttonText}>Option 3</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sidenavBtn}><Text style={styles.buttonText}>Option 4</Text></TouchableOpacity>
        </View> 
    )
}