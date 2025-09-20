import React from "react";
import { Image, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const NextButton = ({ size = 100, top, left, right, bottom }) => {
    return(
        <Image source={require("../../assets/icons/NextButton.png")} 
        style={{
                position: "absolute",
                width: size,
                height: size,
                top: top ? screenHeight * top : undefined, // Ajuste relativo a la pantalla
                left: left ? screenWidth * left : undefined,
                right: right ? screenWidth * right : undefined,
                bottom: bottom ? screenHeight * bottom : undefined
        }}/>
    )
}

export default NextButton;