/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView,
    Platform
} from 'react-native';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';

export default class Sketch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            example: 0,
            color: '#FF0000',
            thickness: 5,
            message: '',
            photoPath: null,
            scrollEnabled: true
        };

    }

    takePicture = async function () {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options)
            this.setState({
                photoPath: data.uri.replace('file://', '')
            })
        }
    };

    render() {
        return (
            <View style={{ flex: 1 , backgroundColor:'transparent'}}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <RNSketchCanvas
                        ref={ref => this.canvas = ref}
                        containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
                        canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                        onStrokeEnd={data => {
                        }}
                        closeComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Close</Text></View>}
                        onClosePressed={() => {
                            this.props.closeSketch();
                        }}
                        undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
                        onUndoPressed={(id) => {
                            // Alert.alert('do something')
                        }}
                        clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
                        onClearPressed={() => {
                            // Alert.alert('do something')
                        }}
                        eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Eraser</Text></View>}
                        strokeComponent={color => (
                            <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                        )}
                        strokeSelectedComponent={(color, index, changed) => {
                            return (
                                <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                            )
                        }}
                        strokeWidthComponent={(w) => {
                            return (<View style={styles.strokeWidthButton}>
                                    <View style={{
                                        backgroundColor: 'white', marginHorizontal: 2.5,
                                        width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                                    }} />
                                </View>
                            )
                        }}
                        defaultStrokeIndex={0}
                        defaultStrokeWidth={5}
                        // saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
                        // savePreference={() => {
                        //     return {
                        //         folder: "RNSketchCanvas",
                        //         filename: String(Math.ceil(Math.random() * 100000000)),
                        //         transparent: false,
                        //         imageType: "png"
                        //     }
                        // }}
                        onSketchSaved={(success, path) => {
                            Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
                        }}
                        onPathsChange={(pathsCount) => {
                            console.log('pathsCount', pathsCount)
                        }}
                    />
                </View>
                <TouchableOpacity style={[styles.functionButton, { backgroundColor: 'black', width: 90 }]} onPress={() => {
                    // Alert.alert(JSON.stringify(this.canvas.getPaths()))
                    this.canvas._sketchCanvas.getBase64('jpg', false, true, true,false, (err, result) => {
                        if(this.props.saveSketch){
                            return this.props.saveSketch(result);
                        }
                    })
                }}>
                    <Text style={{ color: 'white' }}>Save</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    strokeColorButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    strokeWidthButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#39579A'
    },
    functionButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        height: 30,
        width: 60,
        backgroundColor: '#39579A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        alignSelf: 'stretch'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
    page: {
        flex: 1,
        height: 300,
        elevation: 2,
        marginVertical: 8,
        backgroundColor: 'white',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 2
    }
});
