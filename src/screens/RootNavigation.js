
import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function addListener(event,fn){
navigationRef.current?.addListener(event,()=>{fn})

}
  
export function goBack(name){
  navigationRef.current?.goBack()
  
  }
    
  export function popToTop(){
    navigationRef.current?.popToTop()
    
    }