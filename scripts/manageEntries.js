import { format } from 'date-fns'

/*
    takes a group type: week / month / year
    calculate the starting date to fetch the data from
    and return all the data starting from there
*/
const getDataInTimePeriod = (data, numOfGroups, type) => {
    const result = []
    const dataLength = data.length
    const dates = data.map(entry => entry.date)
    const lastDate = new Date(Math.max(...dates.map(e => e))) 
    let startingDate;

    if (numOfGroups === null || numOfGroups === 0 || numOfGroups >= dataLength) return data

    switch (type) { // calculate starting date
        case 'week':
            startingDate = lastDate.setDate(lastDate.getDate() - lastDate.getDay() - (7 * numOfGroups))
            break;
        case 'month':
            startingDate = lastDate.setMonth(lastDate.getMonth() - numOfGroups, 1)
            break;
        case 'year':
            startingDate = lastDate.setMonth(- 12 * numOfGroups, 1)
            break;
        default:
            return data
    }

    for (let i = dataLength - numOfGroups; i < dataLength; i++) // only check the data that can be in the time frame
        if (startingDate - data[i].date <= 0) // check if the entry is in the calculated time period
            result.push(data[i])

    return result
}

/*
    takes a group type: week / month / year
    returns the starting dates of those groups
    and the average weights in those time periods
*/
const groupDataByType = (data, type) => {
    const groupedData = [];
    const result = [];

    data.forEach(entry => { // sort data to groups
        let groupKey;
        const date = entry.date

        switch (type) {
            case 'week':
                groupKey = date.setDate(date.getDate() - date.getDay())
                break;
            case 'month':
                groupKey = date.setDate(1)
                break;
            case 'year':
                groupKey = date.setMonth(0, 1)
                break;
            default:
                groupKey = date
        }

        groupKey = new Date(groupKey).toISOString().split('T')[0]; // convert to dd/mm/yyyy format
        if (!groupedData[groupKey]) groupedData[groupKey] = []
        groupedData[groupKey].push(entry.weight);
    });

    for (const groupKey in groupedData) { // average weights in each group
        const groupedDataLength = groupedData[groupKey].length;
        const averageWeight = Object.values(groupedData[groupKey]).reduce((sum, weight) => sum + weight, 0) / groupedDataLength;
        result.push({ date: new Date(groupKey), weight: averageWeight.toFixed(1) });
    }

    return result;
}

/*
    get the data from the specified period of time
    and sort by the avarage weight
*/
export const sortByDate = (numOfGroups, groupType) => {
    const data = getEntries(1)
    return groupDataByType(getDataInTimePeriod(data, numOfGroups, groupType), groupType)
}

export const getEntries = (test = 1) => { 
    const tests = [[{id: 0, date: new Date('2022-09-04') , weight: 75.0 },
            {id: 1, date: new Date('2022-09-11') , weight: 72.3 },
            {id: 2, date: new Date('2022-09-18') , weight: 72.1 },
            {id: 3, date: new Date('2022-09-25') , weight: 71.3 },
            {id: 4, date: new Date('2022-10-02') , weight: 71.9 },
            {id: 5, date: new Date('2022-10-09') , weight: 69.5 },
            {id: 6, date: new Date('2022-10-16') , weight: 70.9 },
            {id: 7, date: new Date('2022-10-23') , weight: 69.9 },
            {id: 8, date: new Date('2022-10-30') , weight: 70.4 },
            {id: 9, date: new Date('2022-11-06') , weight: 72.3 },
            {id: 10, date: new Date('2022-11-13') , weight: 72.9 },
            {id: 11, date: new Date('2022-11-20') , weight: 74.1 },
            {id: 12, date: new Date('2022-11-27') , weight: 74.5 },
            {id: 13, date: new Date('2022-12-04') , weight: 73.8 },
            {id: 14, date: new Date('2022-12-11') , weight: 74.1 },
            {id: 15, date: new Date('2022-12-18') , weight: 74.4 },
            {id: 16, date: new Date('2022-12-25') , weight: 75.6 },
            {id: 17, date: new Date('2023-01-01') , weight: 76.5 },
            {id: 18, date: new Date('2023-01-08') , weight: 77.6 },
            {id: 19, date: new Date('2023-01-15') , weight: 76.6 },
            {id: 20, date: new Date('2023-01-22') , weight: 77.6 },
            {id: 21, date: new Date('2023-01-23') , weight: 76.5 },
            {id: 22, date: new Date('2023-01-24') , weight: 77.2 },
            {id: 23, date: new Date('2023-01-25') , weight: 77.4 },
            {id: 24, date: new Date('2023-01-26') , weight: 77.4 },
            {id: 25, date: new Date('2023-01-27') , weight: 76.6 },
            {id: 26, date: new Date('2023-01-29') , weight: 75.6 },
            {id: 27, date: new Date('2023-01-30') , weight: 75.2 },
            {id: 28, date: new Date('2023-01-31') , weight: 76.0 },
            {id: 29, date: new Date('2023-02-01') , weight: 75.7 },
            {id: 30, date: new Date('2023-02-02') , weight: 75.8 },
            {id: 31, date: new Date('2023-02-03') , weight: 75.5 },
            {id: 32, date: new Date('2023-02-06') , weight: 74.4 },
            {id: 33, date: new Date('2023-02-07') , weight: 74.5 },
            {id: 34, date: new Date('2023-02-08') , weight: 75.1 },
            {id: 35, date: new Date('2023-02-09') , weight: 74.4 },
            {id: 36, date: new Date('2023-02-10') , weight: 75.8 },
            {id: 37, date: new Date('2023-02-12') , weight: 76.5 },
            {id: 38, date: new Date('2023-02-13') , weight: 75.4 },
            {id: 39, date: new Date('2023-02-14') , weight: 76.4 },
            {id: 40, date: new Date('2023-02-15') , weight: 76.7 },
            {id: 41, date: new Date('2023-02-16') , weight: 76.9 },
            {id: 42, date: new Date('2023-02-17') , weight: 76.8 },
            {id: 43, date: new Date('2023-02-19') , weight: 77.5 },
            {id: 44, date: new Date('2023-02-20') , weight: 76.6 },
            {id: 45, date: new Date('2023-02-21') , weight: 78.2 },
            {id: 46, date: new Date('2023-02-24') , weight: 78.9 },
            {id: 47, date: new Date('2023-02-26') , weight: 76.7 },
            {id: 48, date: new Date('2023-02-27') , weight: 78.6 },
            {id: 49, date: new Date('2023-02-28') , weight: 78.9 },
            {id: 50, date: new Date('2023-03-01') , weight: 78.2 },
            {id: 51, date: new Date('2023-03-02') , weight: 78.0 },
            {id: 52, date: new Date('2023-03-03') , weight: 78.4 },
            {id: 53, date: new Date('2023-03-05') , weight: 78.2 },
            {id: 54, date: new Date('2023-03-06') , weight: 78.1 },
            {id: 55, date: new Date('2023-03-07') , weight: 78.2 },
            {id: 56, date: new Date('2023-03-08') , weight: 78.5 },
            {id: 57, date: new Date('2023-03-09') , weight: 77.6 },
            {id: 58, date: new Date('2023-03-10') , weight: 77.9 },
            {id: 59, date: new Date('2023-03-12') , weight: 78.1 },
            {id: 60, date: new Date('2023-03-13') , weight: 77.8 },
            {id: 61, date: new Date('2023-03-14') , weight: 78.1 },
            {id: 62, date: new Date('2023-03-15') , weight: 78.0 },
            {id: 63, date: new Date('2023-03-16') , weight: 77.7 },
            {id: 64, date: new Date('2023-03-17') , weight: 78.1 },
            {id: 65, date: new Date('2023-03-19') , weight: 77.5 },
            {id: 66, date: new Date('2023-03-20') , weight: 77.5 },
            {id: 67, date: new Date('2023-03-21') , weight: 77.3 },
            {id: 68, date: new Date('2023-03-22') , weight: 77.7 },
            {id: 69, date: new Date('2023-03-23') , weight: 78.4 },
            {id: 70, date: new Date('2023-03-24') , weight: 77.8 },
            {id: 71, date: new Date('2023-03-26') , weight: 77.7 },
            {id: 72, date: new Date('2023-03-27') , weight: 77.6 },
            {id: 73, date: new Date('2023-03-28') , weight: 77.9 },
            {id: 74, date: new Date('2023-04-05') , weight: 77.8 },
            {id: 75, date: new Date('2023-04-07') , weight: 77.9 },
            {id: 76, date: new Date('2023-04-08') , weight: 77.9 },
            {id: 77, date: new Date('2023-04-09') , weight: 77.7 },
            {id: 78, date: new Date('2023-04-10') , weight: 78.4 },
            {id: 79, date: new Date('2023-04-11') , weight: 78.2 },
            {id: 80, date: new Date('2023-04-12') , weight: 78.4 },
            {id: 81, date: new Date('2023-04-13') , weight: 78.0 },
            {id: 82, date: new Date('2023-04-14') , weight: 78.4 },
            {id: 83, date: new Date('2023-04-15') , weight: 77.7 },
            {id: 84, date: new Date('2023-04-16') , weight: 78.2 },
            {id: 85, date: new Date('2023-04-17') , weight: 78.3 },
            {id: 86, date: new Date('2023-04-18') , weight: 79.4 },
            {id: 87, date: new Date('2023-04-20') , weight: 78.0 },
            {id: 88, date: new Date('2023-04-21') , weight: 78.9 },
            {id: 89, date: new Date('2023-04-23') , weight: 78.5 },
            {id: 90, date: new Date('2023-04-24') , weight: 78.9 },
            {id: 91, date: new Date('2023-04-25') , weight: 78.5 },
            {id: 92, date: new Date('2023-04-26') , weight: 78.8 },
            {id: 93, date: new Date('2023-04-27') , weight: 79.4 },
            {id: 94, date: new Date('2023-04-28') , weight: 78.7 },
            {id: 95, date: new Date('2023-04-30') , weight: 78.5 },
            {id: 96, date: new Date('2023-05-01') , weight: 78.8 },
            {id: 97, date: new Date('2023-05-02') , weight: 78.2 },
            {id: 98, date: new Date('2023-05-03') , weight: 78.9 },
            {id: 99, date: new Date('2023-05-04') , weight: 79.5 },
            {id: 100, date: new Date('2023-05-05') , weight: 78.6 },
            {id: 101, date: new Date('2023-05-07') , weight: 79.0 },
            {id: 102, date: new Date('2023-05-14') , weight: 78.6 },
            {id: 103, date: new Date('2023-05-21') , weight: 79.5 },
            {id: 104, date: new Date('2023-05-28') , weight: 80.5 },
            {id: 105, date: new Date('2023-05-29') , weight: 79.8 },
            {id: 106, date: new Date('2023-05-30') , weight: 78.7 },
            {id: 107, date: new Date('2023-05-31') , weight: 79.3 },
            {id: 108, date: new Date('2023-06-01') , weight: 79.1 },
            {id: 109, date: new Date('2023-06-02') , weight: 79.8 },
            {id: 110, date: new Date('2023-06-04') , weight: 79.9 },
            {id: 111, date: new Date('2023-06-05') , weight: 78.9 },
            {id: 112, date: new Date('2023-06-06') , weight: 79.1 },
            {id: 113, date: new Date('2023-06-07') , weight: 79.2 },
            {id: 114, date: new Date('2023-06-08') , weight: 78.6 },
            {id: 115, date: new Date('2023-06-09') , weight: 78.8 },
            {id: 116, date: new Date('2023-06-12') , weight: 78.8 },
            {id: 117, date: new Date('2023-06-13') , weight: 79.0 },
            {id: 118, date: new Date('2023-06-14') , weight: 78.7 },
            {id: 119, date: new Date('2023-06-16') , weight: 78.0 },
            {id: 120, date: new Date('2023-06-18') , weight: 79.2 },
            {id: 121, date: new Date('2023-06-19') , weight: 79.2 },
            {id: 122, date: new Date('2023-06-20') , weight: 78.6 },
            {id: 123, date: new Date('2023-06-21') , weight: 78.8 },
            {id: 124, date: new Date('2023-06-22') , weight: 78.4 },
            {id: 125, date: new Date('2023-06-25') , weight: 79.6 },
            {id: 126, date: new Date('2023-06-26') , weight: 78.5 },
            {id: 127, date: new Date('2023-06-27') , weight: 80.5 },
            {id: 128, date: new Date('2023-06-28') , weight: 79.5 },
            {id: 129, date: new Date('2023-06-29') , weight: 78.2 },
            {id: 130, date: new Date('2023-06-30') , weight: 78.8 },
            {id: 131, date: new Date('2023-07-02') , weight: 78.8 },
            {id: 132, date: new Date('2023-07-03') , weight: 78.5 },
            {id: 133, date: new Date('2023-07-04') , weight: 79.2 },
            {id: 134, date: new Date('2023-07-05') , weight: 78.1 },
            {id: 135, date: new Date('2023-07-06') , weight: 79.7 },
            {id: 136, date: new Date('2023-07-07') , weight: 79.0 },
            {id: 137, date: new Date('2023-07-09') , weight: 79.1 },
            {id: 138, date: new Date('2023-07-10') , weight: 78.5 },
            {id: 139, date: new Date('2023-07-11') , weight: 78.0 },
            {id: 140, date: new Date('2023-07-12') , weight: 78.4 },
            {id: 141, date: new Date('2023-07-13') , weight: 78.1 },
            {id: 142, date: new Date('2023-07-14') , weight: 78.2 },
            {id: 143, date: new Date('2023-07-16') , weight: 79.8 },
            {id: 144, date: new Date('2023-07-17') , weight: 80.7 },
            {id: 145, date: new Date('2023-07-18') , weight: 79.6 },
            {id: 146, date: new Date('2023-07-19') , weight: 79.0 },
            {id: 147, date: new Date('2023-07-20') , weight: 78.9 },
            {id: 148, date: new Date('2023-07-21') , weight: 78.8 },
            {id: 149, date: new Date('2023-07-23') , weight: 79.9 },
            {id: 150, date: new Date('2023-07-24') , weight: 79.1 },
            {id: 151, date: new Date('2023-07-25') , weight: 79.9 },
            {id: 152, date: new Date('2023-07-26') , weight: 79.0 },
            {id: 153, date: new Date('2023-07-27') , weight: 78.3 },
            {id: 154, date: new Date('2023-07-30') , weight: 77.6 },
            {id: 155, date: new Date('2023-07-31') , weight: 78.2 },
            {id: 156, date: new Date('2023-08-01') , weight: 79.1 },
            {id: 157, date: new Date('2023-08-02') , weight: 78.6 },
            {id: 158, date: new Date('2023-08-03') , weight: 79.5 },
            {id: 159, date: new Date('2023-08-04') , weight: 79.8 },
            {id: 160, date: new Date('2023-08-06') , weight: 78.2 },
            {id: 161, date: new Date('2023-08-07') , weight: 78.1 },
            {id: 162, date: new Date('2023-08-08') , weight: 78.6 },
            {id: 163, date: new Date('2023-08-09') , weight: 78.3 },
            {id: 164, date: new Date('2023-08-10') , weight: 79.5 },
            {id: 165, date: new Date('2023-08-11') , weight: 79.2 },
            {id: 166, date: new Date('2023-08-13') , weight: 79.5 },
            {id: 167, date: new Date('2023-08-14') , weight: 79.4 },
            {id: 168, date: new Date('2023-08-15') , weight: 79.8 },
            {id: 169, date: new Date('2023-08-16') , weight: 79.7 },
            {id: 170, date: new Date('2023-08-17') , weight: 78.9 },
            {id: 171, date: new Date('2023-08-18') , weight: 78.5 },
            {id: 172, date: new Date('2023-08-20') , weight: 78.2 },
            {id: 173, date: new Date('2023-08-21') , weight: 79.1 },
            {id: 174, date: new Date('2023-08-22') , weight: 79.1 },
            {id: 175, date: new Date('2023-08-23') , weight: 79.3 },
            {id: 176, date: new Date('2023-08-24') , weight: 78.7 },
            {id: 177, date: new Date('2023-08-25') , weight: 78.4 },
            {id: 178, date: new Date('2023-08-27') , weight: 78.5 },
            {id: 179, date: new Date('2023-08-28') , weight: 78.2 },
            {id: 180, date: new Date('2023-08-29') , weight: 78.3 },
            {id: 181, date: new Date('2023-08-30') , weight: 80.3 },
            {id: 182, date: new Date('2023-08-31') , weight: 80.0 },
            {id: 183, date: new Date('2023-09-01') , weight: 79.3 },
            {id: 184, date: new Date('2023-09-03') , weight: 79.8 },
            {id: 185, date: new Date('2023-09-04') , weight: 78.8 },
            {id: 186, date: new Date('2023-09-05') , weight: 79.7 },
            {id: 187, date: new Date('2023-09-06') , weight: 79.5 },
            {id: 188, date: new Date('2023-09-07') , weight: 78.9 },
            {id: 189, date: new Date('2023-09-08') , weight: 78.8 },
            {id: 190, date: new Date('2023-09-10') , weight: 78.5 },
            {id: 191, date: new Date('2023-09-11') , weight: 78.3 },
            {id: 192, date: new Date('2023-09-12') , weight: 78.4 },
            {id: 193, date: new Date('2023-09-13') , weight: 78.1 },
            {id: 194, date: new Date('2023-09-14') , weight: 78.1 },
            {id: 195, date: new Date('2023-09-15') , weight: 78.1 },
            {id: 196, date: new Date('2023-09-18') , weight: 79.4 },
            {id: 197, date: new Date('2023-09-19') , weight: 77.8 },
            {id: 198, date: new Date('2023-09-20') , weight: 79.3 },
            {id: 199, date: new Date('2023-09-21') , weight: 79.3 },
            {id: 200, date: new Date('2023-09-22') , weight: 79.7 },
            {id: 201, date: new Date('2023-09-24') , weight: 78.7 },
            {id: 202, date: new Date('2023-09-26') , weight: 78.4 },
            {id: 203, date: new Date('2023-09-27') , weight: 78.9 },
            {id: 204, date: new Date('2023-09-28') , weight: 78.6 },
            {id: 205, date: new Date('2023-09-29') , weight: 78.8 },
            {id: 206, date: new Date('2023-10-01') , weight: 79.2 },
            {id: 207, date: new Date('2023-10-02') , weight: 79.6 },
            {id: 208, date: new Date('2023-10-03') , weight: 79.2 },
            {id: 209, date: new Date('2023-10-06') , weight: 79.9 },
            {id: 210, date: new Date('2023-10-08') , weight: 80.4 },
            {id: 211, date: new Date('2023-10-09') , weight: 80.3 },
            {id: 212, date: new Date('2023-10-10') , weight: 79.7 },
            {id: 213, date: new Date('2023-10-11') , weight: 80.5 },
            {id: 214, date: new Date('2023-10-12') , weight: 80.3 },
            {id: 215, date: new Date('2023-10-13') , weight: 79.9 },
            {id: 216, date: new Date('2023-10-15') , weight: 79.6 },
            {id: 217, date: new Date('2023-10-16') , weight: 79.3 },
            {id: 218, date: new Date('2023-10-17') , weight: 79.7 },
            {id: 219, date: new Date('2023-10-19') , weight: 79.7 },
            {id: 220, date: new Date('2023-10-20') , weight: 79.4 },
            {id: 221, date: new Date('2023-10-22') , weight: 80.2 }],

            [{ id: 1, date: new Date('2023-10-21'), weight: 54.6 },
            { id: 2, date: new Date('2023-10-22'), weight: 61.4 },
            { id: 3, date: new Date('2023-10-23'), weight: 47.3 },
            { id: 3, date: new Date('2023-10-26'), weight: 60.3 },
            { id: 4, date: new Date('2023-10-28'), weight: 49.3 },
            { id: 5, date: new Date('2023-11-2'), weight: 58.9 },
            { id: 6, date: new Date('2023-11-3'), weight: 71 },],
        
            [{ id: 1, date: new Date('2023-10-21'), weight: 54.6 },],

            [{ id: 1, date: new Date('2023-10-21'), weight: 54.6 },
            { id: 2, date: new Date('2023-10-25'), weight: 62.6 },],]

        return tests[test - 1]
}