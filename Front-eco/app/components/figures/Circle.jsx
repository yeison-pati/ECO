import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Circle = ({ size = 100, top, left, right, bottom, color = "rgba(197, 29, 40, 0.3)" }) => {
    return (
        <View
            style={[
                {
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    top: top ? screenHeight * top : undefined,
                    left: left ? screenWidth * left : undefined,
                    right: right ? screenWidth * right : undefined,
                    bottom: bottom ? screenHeight * bottom : undefined,
                    backgroundColor: color,
                },
            ]}
        />
    );
};

export default Circle;
