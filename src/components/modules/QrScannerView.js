import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Easing,
    Text,
    Image,
    AppState, Vibration,
} from 'react-native';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';

const defaultRectStyle = { height: 300, width: 300, borderWidth: 0, borderColor: '#000000', marginBottom: 0 };
const defaultCornerStyle = { height: 32, width: 32, borderWidth: 6, borderColor: '#1A6DD5' };
const defaultScanBarStyle = { marginHorizontal: 8, borderRadius: 2, backgroundColor: '#1A6DD5' };
const defaultHintTextStyle = { color: '#fff', fontSize: 14, backgroundColor: 'transparent', marginTop: 32 };

export class QRScannerRectView extends Component {

    static propTypes = {
        maskColor: PropTypes.string,
        rectStyle: PropTypes.object,

        cornerStyle: PropTypes.object,
        cornerOffsetSize: PropTypes.number,
        isShowCorner: PropTypes.bool,

        isShowScanBar: PropTypes.bool,
        scanBarAnimateTime: PropTypes.number,
        scanBarAnimateReverse: PropTypes.bool,
        scanBarImage: PropTypes.any,
        scanBarStyle: PropTypes.object,

        hintText: PropTypes.string,
        hintTextStyle: PropTypes.object,
    };

    static defaultProps = {
        maskColor: '#0000004D',
        cornerOffsetSize: 0,
        isShowScanBar: true,
        isShowCorner: true,
        scanBarAnimateTime: 3000,
        hintText: 'scanner',
    };

    state = {
        animatedValue: new Animated.Value(0),
    };

    constructor(props){
        super(props);
        this.innerRectStyle = Object.assign(defaultRectStyle, props.rectStyle);
        this.innerCornerStyle = Object.assign(defaultCornerStyle, props.cornerStyle);
        this.innerScanBarStyle = Object.assign(defaultScanBarStyle, props.scanBarStyle);
        this.innerHintTextStyle = Object.assign(defaultHintTextStyle, props.hintTextStyle);
    }

    componentDidMount(){
        this.scanBarMove();
    }

    componentWillUnmount(){
        console.log('componentWillUnmount')
        this.scanBarAnimation && this.scanBarAnimation.stop();
    }

    scanBarMove(){
        const { cornerOffsetSize, scanBarAnimateReverse, isShowScanBar } = this.props;
        const scanBarHeight = isShowScanBar ? this.innerScanBarStyle.height || 4 : 0;
        const startValue = this.innerCornerStyle.borderWidth;
        const endValue = this.innerRectStyle.height - (this.innerRectStyle.borderWidth + cornerOffsetSize + this.innerCornerStyle.borderWidth) - scanBarHeight;
        if ( scanBarAnimateReverse ) {
            this.scanBarAnimation = Animated.sequence([
                Animated.timing(this.state.animatedValue, {
                    toValue: endValue,
                    duration: this.props.scanBarAnimateTime,
                    easing: Easing.linear,
                    isInteraction: false,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.animatedValue, {
                    toValue: startValue,
                    duration: this.props.scanBarAnimateTime,
                    easing: Easing.linear,
                    isInteraction: false,
                    useNativeDriver: true,
                }),
            ]).start(() => this.scanBarMove());
        } else {
            this.state.animatedValue.setValue(startValue);  //重置Rotate动画值为0
            this.scanBarAnimation = Animated.timing(this.state.animatedValue, {
                toValue: endValue,
                duration: this.props.scanBarAnimateTime,
                easing: Easing.linear,
                isInteraction: false,
                useNativeDriver: true,
            }).start(() => this.scanBarMove());
        }
    }

    getBackgroundColor = () => {
        return { backgroundColor: this.props.maskColor };
    };

    getRectSize = () => {
        return { height: this.innerRectStyle.height, width: this.innerRectStyle.width };
    };

    getRectOffsetHeight = () => {
        return { height: this.innerRectStyle.marginBottom };
    };

    getBorderStyle(){
        const { cornerOffsetSize } = this.props;
        return {
            height: this.innerRectStyle.height - cornerOffsetSize * 2,
            width: this.innerRectStyle.width - cornerOffsetSize * 2,
            borderWidth: this.innerRectStyle.borderWidth,
            borderColor: this.innerRectStyle.borderColor,
        };
    }

    getCornerStyle(){
        return {
            height: this.innerCornerStyle.height,
            width: this.innerCornerStyle.width,
            borderColor: this.innerCornerStyle.borderColor,
        };
    }

    getScanImageWidth(){
        return this.innerRectStyle.width - this.innerScanBarStyle.marginHorizontal * 2;
    }

    measureScanBarImage = (e) => {
        this.setState({ scanBarImageHeight: Math.round(e.layout.height) });
    };

    renderScanBar(){
        const { isShowScanBar, scanBarImage } = this.props;

        if ( !isShowScanBar ) return;
        return scanBarImage
            ? <Image source={ scanBarImage }
                     style={ [
                         this.innerScanBarStyle,
                         {
                             resizeMode: 'contain',
                             backgroundColor: 'transparent',
                             width: this.getScanImageWidth(),
                         },
                     ] }/>
            : <View style={ [ { height: 4 }, this.innerScanBarStyle ] }/>;
    }

    render(){
        const animatedStyle = {
            transform: [ { translateY: this.state.animatedValue } ],
        };

        const { borderWidth } = this.innerCornerStyle;
        const { isShowCorner } = this.props;

        return (
            <View style={ [ styles.container, { bottom: 0 } ] }>

                <View style={ [ this.getBackgroundColor(), { flex: 1 } ] }/>

                <View style={ { flexDirection: 'row' } }>

                    <View style={ [ this.getBackgroundColor(), { flex: 1 } ] }/>

                    <View style={ [ styles.viewfinder, this.getRectSize() ] }>

                        <View style={ this.getBorderStyle() }>
                            <Animated.View style={ [ animatedStyle ] }>
                                { this.renderScanBar() }
                            </Animated.View>
                        </View>

                        { isShowCorner && <View style={ [
                            this.getCornerStyle(),
                            styles.topLeftCorner,
                            { borderLeftWidth: borderWidth, borderTopWidth: borderWidth },
                        ] }/> }

                        { isShowCorner && <View style={ [
                            this.getCornerStyle(),
                            styles.topRightCorner,
                            { borderRightWidth: borderWidth, borderTopWidth: borderWidth },
                        ] }/> }

                        { isShowCorner && <View style={ [
                            this.getCornerStyle(),
                            styles.bottomLeftCorner,
                            { borderLeftWidth: borderWidth, borderBottomWidth: borderWidth },
                        ] }/> }

                        { isShowCorner && <View style={ [
                            this.getCornerStyle(),
                            styles.bottomRightCorner,
                            { borderRightWidth: borderWidth, borderBottomWidth: borderWidth },
                        ] }/> }
                    </View>

                    <View style={ [ this.getBackgroundColor(), { flex: 1 } ] }/>

                </View>

                <View style={ [ this.getBackgroundColor(), { flex: 1, alignItems: 'center' } ] }>
                    <Text style={ this.innerHintTextStyle } numberOfLines={ 1 }>{ this.props.hintText }</Text>
                </View>

                <View style={ [ this.getBackgroundColor(), this.getRectOffsetHeight() ] }/>

            </View>
        );
    }
}

export default class QRScannerView extends Component {

    static propTypes = {

        maskColor: PropTypes.string,
        rectStyle: PropTypes.object,

        cornerStyle: PropTypes.object,
        cornerOffsetSize: PropTypes.number,
        isShowCorner: PropTypes.bool,

        isShowScanBar: PropTypes.bool,
        scanBarAnimateTime: PropTypes.number,
        scanBarAnimateReverse: PropTypes.bool,
        scanBarImage: PropTypes.any,
        scanBarStyle: PropTypes.object,

        hintText: PropTypes.string,
        hintTextStyle: PropTypes.object,

        renderHeaderView: PropTypes.func,
        renderFooterView: PropTypes.func,

        onScanResult: PropTypes.func,
        scanInterval: PropTypes.number,
        torchOn: PropTypes.bool,
        userFront: PropTypes.bool,
        vibrate: PropTypes.bool,
    };

    static defaultProps = {
        torchOn: false,
        scanInterval: 2000,
        userFront: false,
        vibrate: true,
    };

    constructor(props){
        super(props);
        this.onScanResult = throttle(this.onScanResult, this.props.scanInterval, { maxWait: 0, trailing: false });
    }

    componentDidMount(){
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.rnCamera && this.rnCamera.pausePreview();
    }

    handleAppStateChange = (currentAppState) => {
        if ( currentAppState !== 'active' ) {
            this.rnCamera && this.rnCamera.pausePreview();
        } else {
            this.rnCamera && this.rnCamera.resumePreview();
        }
    };

    onScanResult = (e) => {
        if (this.props.vibrate) {
            Vibration.vibrate();
        }
        this.props.onScanResult(e)
    };

    render(){
        const { renderHeaderView, renderFooterView, torchOn, userFront } = this.props;

        return (
            <RNCamera
                ref={ ref => this.rnCamera = ref }
                captureAudio={ false }
                onBarCodeRead={ this.onScanResult }
                type={ userFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back }
                flashMode={ torchOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off }
                style={ { flex: 1 } }
            >

                <QRScannerRectView
                    maskColor={ this.props.maskColor }
                    rectStyle={ this.props.rectStyle }
                    isShowCorner={ this.props.isShowCorner }
                    cornerStyle={ this.props.cornerStyle }
                    cornerOffsetSize={ this.props.cornerOffsetSize }
                    isShowScanBar={ this.props.isShowScanBar }
                    scanBarAnimateTime={ this.props.scanBarAnimateTime }
                    scanBarAnimateReverse={ this.props.scanBarAnimateReverse }
                    scanBarImage={ this.props.scanBarImage }
                    scanBarStyle={ this.props.scanBarStyle }
                    hintText={ this.props.hintText }
                    hintTextStyle={ this.props.hintTextStyle }
                />

                { renderHeaderView && <View style={ [ styles.topContainer ] }>{ renderHeaderView() }</View> }

                { renderFooterView && <View style={ [ styles.bottomContainer ] }>{ renderFooterView() }</View> }

            </RNCamera>
        );
    }
}

const styles = StyleSheet.create({
    topContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        flex: 1,
    },
    viewfinder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    topLeftCorner: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    topRightCorner: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    bottomLeftCorner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    bottomRightCorner: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
});

// Copy from lodash
function throttle(func, wait, options){
    let leading = true;
    let trailing = true;

    if ( typeof func !== 'function' ) {
        throw new TypeError('Expected a function');
    }
    if ( isObject(options) ) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
        leading,
        trailing,
        'maxWait': wait,
    });
}

// Copy from lodash
function debounce(func, wait, options){
    let lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime;

    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
    const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function');

    if ( typeof func !== 'function' ) {
        throw new TypeError('Expected a function');
    }
    wait = +wait || 0;
    if ( isObject(options) ) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time){
        const args = lastArgs;
        const thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }

    function startTimer(pendingFunc, wait){
        if ( useRAF ) {
            root.cancelAnimationFrame(timerId);
            return root.requestAnimationFrame(pendingFunc);
        }
        return setTimeout(pendingFunc, wait);
    }

    function cancelTimer(id){
        if ( useRAF ) {
            return root.cancelAnimationFrame(id);
        }
        clearTimeout(id);
    }

    function leadingEdge(time){
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = startTimer(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time){
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;

        return maxing
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    }

    function shouldInvoke(time){
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
            (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired(){
        const time = Date.now();
        if ( shouldInvoke(time) ) {
            return trailingEdge(time);
        }
        // Restart the timer.
        timerId = startTimer(timerExpired, remainingWait(time));
    }

    function trailingEdge(time){
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if ( trailing && lastArgs ) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }

    function cancel(){
        if ( timerId !== undefined ) {
            cancelTimer(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush(){
        return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function pending(){
        return timerId !== undefined;
    }

    function debounced(...args){
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastThis = this;
        lastCallTime = time;

        if ( isInvoking ) {
            if ( timerId === undefined ) {
                return leadingEdge(lastCallTime);
            }
            if ( maxing ) {
                // Handle invocations in a tight loop.
                timerId = startTimer(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if ( timerId === undefined ) {
            timerId = startTimer(timerExpired, wait);
        }
        return result;
    }

    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    return debounced;
}

// Copy from lodash
function isObject(value){
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}
