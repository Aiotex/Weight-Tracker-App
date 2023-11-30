import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';

const root = {
    text: '#f9f5f0',
    background: '#000000',
    primary: '#a2733f',
    secondary: '#21180d',
    accent: '#b48146'
}

const globalStyles = { 
    margin: 0, 
    padding: 0,
    color: root.text
}

const styles = {
    app: {
        backgroundColor: root.background,
        flex: 1,             
        width: '100%',       
        height: '100%',
        paddingTop: StatusBar.currentHeight + 50,
    },
    buttonText: {},
    topnav: {
        backgroundColor: root.secondary,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: StatusBar.currentHeight,
        left: 0,   
        right: 0,
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
    },
    sidenav: {
        backgroundColor: root.secondary,
        zIndex: 99,
        gap: 25,
        position: 'absolute',
        top: StatusBar.currentHeight,
        right: '-60%',   
        bottom: 0,
        width: '60%',
    },
    closeSidenavBtn: {
        backgroundColor: 'red',
        position: 'relative',
        right: -25,   
        bottom: -25,
        width: 45,
        height: 45,
    }
}

for (const key in styles) { styles[key] = { ...globalStyles, ...styles[key] }; }
  
export default StyleSheet.create(styles);
