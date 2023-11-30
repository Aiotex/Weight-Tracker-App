import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from '../styles/styles.js';
import { getEntries, sortByDate } from '../scripts/manageEntries.js';
import { format } from 'date-fns'

import { Dimensions, TouchableWithoutFeedback, PanResponder } from "react-native";
const screenWidth = Dimensions.get("window").width;

import Svg, {Circle, Path, Line} from 'react-native-svg';

const Analytics = () => {
    const [graghPeriod, setGraghPeriod] = useState('All') 
    // year, 6 months, 3 months, 2 month, 1 month, 1 week
    const [averageWeight, setAverageWeight] = useState('1 Day')
    // week, month, year
    const [entries, setEntries] = useState(sortByDate(12, 'week'))

    return (
        <SafeAreaView>
            {/* <View style={styles.analyticsOptions}>
                <TouchableOpacity style={styles.selectGraghPeriodBtn}>
                    <Text style={styles.selectGraghPeriodLbl}>{graghPeriod}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectAverageWeightBtn}>
                    <Text style={styles.selectAverageWeightLbl}>{averageWeight}</Text>
                </TouchableOpacity>
            </View> */}
            <EntriesGraph 
                data={entries} 
                padding={35} 
                width={screenWidth} 
                height={250}>
            </EntriesGraph>
            {/* {sortByDate(null, 'year').map((entry, i) => { return <Text key={i} style={{ zIndex: 99, color: 'red' }}>{entry.weight} {format(entry.date, 'dd/MM/yy')}</Text> }) } */}
        </SafeAreaView>  
    )
}

const EntriesGraph = ({ data, padding, width, height, numOfXLabels = 5, numOfYLabels = 3, fontSize = 8 }) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const [tooltipDims, setTooltipDims] = useState({ height: 0, width: 0 });

    let points = []
    let xAxisLabels = []
    let yAxisLabels = []
    const dataLength = data.length
    const weights = data.map(entry => entry.weight)
    const dates = data.map(entry => entry.date )
    const minWeight = Math.min(...weights.map(e => e))
    const maxWeight = Math.max(...weights.map(e => e))
    const firstDate = Math.min(...dates.map(e => e))
    const lastDate = Math.max(...dates.map(e => e))
    const xScale = (width - 2 * padding)
    const yScale = (height - 2 * padding) / (maxWeight - minWeight);

    /*
        convert the data to points that we can draw
    */
    if (dataLength !== 1) {
        points = data.map(entry => {
            const x = padding + ((entry.date - firstDate) / (lastDate - firstDate)) * xScale;
            const y = height - (padding + (entry.weight - minWeight) * yScale);
            return { x: x, y: y };
        })
    } else {
        points = [{ x: padding, y: height / 2 }, { x: width - padding, y: height / 2 }]
    }

    /*
        get the data values at equally spaced intervals and their coordinants
        on the graph for the axis labels
    */
    const getYAxisLabels = () => { // Y axis
        labels = []
        if(dataLength <= numOfYLabels) numOfYLabels = dataLength - 1
        const stepSize = ((maxWeight - minWeight) / (numOfYLabels + 1))

        for (let i = 1; i < numOfYLabels + 1; i++) {
            const value = (minWeight + (stepSize * i))
            const y = height - (padding + (value - minWeight) * yScale);
            labels.push({ value: value.toFixed(1), y: y });
        }
        return labels
    }

    const getXAxisLabels = () => { // X axis
        labels = []
        if (dataLength <= numOfXLabels) numOfXLabels = dataLength
        numOfXLabels = Math.max(2, numOfXLabels)
        const stepSize = ((lastDate - firstDate) / (numOfXLabels - 1))
        
        for (let i = 0; i < numOfXLabels + 1; i++) {
            const date = (firstDate + (stepSize * i))
            const x = padding + ((date - firstDate) / (lastDate - firstDate)) * xScale
            labels.push({ value: format(date, 'dd/MM'), x: x })
        }
        return labels
    }

    if (dataLength !== 1) {
        xAxisLabels = getXAxisLabels()
        yAxisLabels = getYAxisLabels()
    } 
    else {
        xAxisLabels = [{ value: format(dates[0], 'dd/MM'), x: width / 2 }]
        yAxisLabels = [{ value: weights[0], y: height / 2 }]
    } 

    /*
        Tooltip, and tooltip line animation
    */
    const findNearestPoint = (xToCheck) => {
        const nearest = points.reduce((closest, point) => {
            const distance = Math.abs(xToCheck - point.x);
            if (closest === null || distance < Math.abs(xToCheck - closest.x)) return point;
            return closest;
        });

        if(dataLength !== 1)
            return { date: dates[points.indexOf(nearest)], value: weights[points.indexOf(nearest)], x: nearest.x, y: nearest.y };
        else 
            return { date: dates[0], value: weights[0], x: nearest.x, y: nearest.y }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                const { moveX, moveY } = gestureState;
                const nearest = findNearestPoint(moveX);
                setTooltipPosition({ x: nearest.x, y: nearest.y });
                setTooltipVisible(true);
                setTooltipText(`${nearest.value}kg ${format(nearest.date, 'dd/MM/yy')}`)
            },
            onPanResponderRelease: () => {
                setTooltipVisible(false);
            },
        })
    ).current;

    /*
        Gragh renderer
    */
    return (
        <SafeAreaView style={{ height: height, width: width, position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 100)' }} {...panResponder.panHandlers}>
            <Svg height={height} width={width}>

                {yAxisLabels.map((label, index) => {
                    return <YAxisLabel 
                        key={index}
                        graphPadding={padding}
                        graphWidth={width}
                        value={label.value} 
                        y={label.y}
                        fontSize={fontSize}></YAxisLabel>
                })}

                {xAxisLabels.map((label, index) => {
                    return <XAxisLabel
                        key={index}
                        graphPadding={padding}
                        graphHeight={height}
                        value={label.value}
                        x={label.x}
                        fontSize={fontSize}></XAxisLabel>
                })}
                
                <GraphLine points={points}></GraphLine>
                
                {tooltipVisible &&
                    <SafeAreaView style={{ position: 'absolute'}}>
                            <Line
                                y1={padding}
                                y2={height - padding}
                                x1={tooltipPosition.x}
                                x2={tooltipPosition.x}
                                stroke={'grey'}
                                strokeWidth={1}
                            />
                            <Circle 
                                cx={tooltipPosition.x}
                                cy={tooltipPosition.y}
                                fill="grey"
                                r={3}
                            />
                            <Text 
                                onLayout={e => setTooltipDims({ height: e.nativeEvent.layout.height, width: e.nativeEvent.layout.width } )}
                                style={{ 
                                    color: 'grey', 
                                    fontSize: fontSize, 
                                    left: tooltipPosition.x - tooltipDims.width / 2, 
                                    top: padding / 2 - tooltipDims.height / 2
                                }}>
                            {tooltipText}</Text>
                    </SafeAreaView>
                }
                
                <Line
                    y1={height - padding}
                    y2={height - padding}
                    x1={padding}
                    x2={width - padding}
                    stroke={'grey'}
                    strokeWidth={1.5} />
            </Svg>
        </SafeAreaView>
    )
}


/*
    Return an svg Path with smooth bazier curves
*/
const GraphLine = ({ points, smoothing = 0.05 }) => {
    // Properties of a line
    const line = (pointA, pointB) => {
        const lengthX = pointB.x - pointA.x;
        const lengthY = pointB.y - pointA.y;
        return {
            length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
            angle: Math.atan2(lengthY, lengthX),
        };
    };

    // Position of a control point
    const controlPoint = (current, previous, next, reverse) => {
        // When 'current' is the first or last point of the array
        // 'previous' or 'next' don't exist.
        // Replace with 'current'
        const p = previous || current;
        const n = next || current;

        // Properties of the opposed-line
        const o = line(p, n);

        // If is end-control-point, add PI to the angle to go backward
        const angle = o.angle + (reverse ? Math.PI : 0);
        const length = o.length * smoothing;

        // The control point position is relative to the current point
        const x = current.x + Math.cos(angle) * length;
        const y = current.y + Math.sin(angle) * length;
        return { x: x, y: y };
    };

    // Create the bezier curve command
    const bezierCommand = (point, i, a) => {
        const cps = controlPoint(a[i - 1], a[i - 2], point, false); // start control point
        const cpe = controlPoint(point, a[i - 1], a[i + 1], true); // end control point
        return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
    };

    const svgPath = () =>
        points.reduce((acc, point, i, a) => (i === 0 ? `M ${point.x},${point.y}` : `${acc} ${bezierCommand(point, i, a)}`), '');

    return (
        <Path
            d={svgPath()}
            stroke={"#36c481"}
            strokeLinecap={"round"}
            strokeWidth={1.5}
            fill={'none'}>
        </Path>
    )
}

/*
    x and y axis labels
*/
const YAxisLabel = ({ graphPadding, graphWidth, y, value, fontSize }) => {
    const [labelDims, setLabelDims] = useState({ height: 0, width: 0 })
    const handleTextLayout = e => setLabelDims({ height: e.nativeEvent.layout.height, width: e.nativeEvent.layout.width })

    return (
        <SafeAreaView>
            <Line
                x1={graphPadding}
                y1={y}
                x2={graphWidth - graphPadding}
                y2={y}
                stroke="grey"
                strokeWidth="0.8"
            />
            <Text
                onLayout={handleTextLayout}
                style={{
                    position: 'absolute',
                    color: 'grey',
                    fontSize: fontSize,
                    right: graphWidth - graphPadding + 3,
                    top: y - labelDims.height / 2
                }}>
                {value}</Text>
        </SafeAreaView>
    )
}

const XAxisLabel = ({ graphPadding, graphHeight, x, value, fontSize }) => {
    const [labelDims, setLabelDims] = useState({ height: 0, width: 0 })
    const handleTextLayout = e => setLabelDims({ height: e.nativeEvent.layout.height, width: e.nativeEvent.layout.width })
    return (
        <Text
            onLayout={handleTextLayout}
            style={{
                position: 'absolute',
                color: 'grey',
                fontSize: fontSize,
                left: x - labelDims.width / 2,
                top: graphHeight - graphPadding,
            }}>
            {value}</Text>
    )
}

export default Analytics