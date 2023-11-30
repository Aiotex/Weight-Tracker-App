import React, {useState} from 'react';
import { Text, View, Button, FlatList } from 'react-native';
import styles from '../styles/styles.js';
import { getEntries } from '../scripts/manageEntries.js';


const EntriesList = () => {
    const [entries, setEntries] = useState(getEntries());

    const handleDeleteEntry = (entryId) => {
        const updatedEntries = entries.filter((entry) => entry.id !== entryId);
        setEntries(updatedEntries);
    };
    
    const EntryRow = ({entry}) => {
        return (
            <View style={styles.entryRow} key={entry.id}>
                <View>
                    <Text>{entry.date}</Text>
                    <Text>{entry.weight}</Text>
                </View>
                <Button title='Delete' onPress={() => handleDeleteEntry(entry.id)}></Button>
            </View>
        )
    }

    return (
        <FlatList
            data={entries}
            renderItem={({item}) => <EntryRow entry={item} />}
            keyExtractor={item => item.id}
        />
    )
}

export default EntriesList;
