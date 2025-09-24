import React from "react";
import { Image, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Logo = ({ size = 100, top, left, right, bottom }) => {
    return(
        <Image source={require("../../../assets/images/logoEco.png")} 
        style={{
                width: size,
                height: size,
                position: "absolute",
                resizeMode: "cover",
                top: top ? screenHeight * top : undefined,
                left: left ? screenWidth * left : undefined,
                right: right ? screenWidth * right : undefined,
                bottom: bottom ? screenHeight * bottom : undefined
        }}/>
    )
}


export default Logo;