import {ButtonGroup} from 'react-native-elements';
import React, {useState} from 'react';

const Switcher=({index,onPress=false,buttons=[],containerStyle={}})=>{

    const [currentIndex,setIndex] = useState(index);

    return <ButtonGroup
        onPress={(e)=>{
            setIndex(index===1 ? 0 : 1);
            if(onPress){
                onPress(e)
            }
        }
        }
        selectedIndex={currentIndex}
        buttons={buttons}
        containerStyle={containerStyle}
    />
};
export default Switcher
