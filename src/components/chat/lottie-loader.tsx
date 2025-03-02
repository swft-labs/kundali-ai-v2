import loaderAnimation from "@/assets/loader-three-dots.json";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { View } from "react-native";

export const LottieLoader = ({ width = 60, height = 60 }) => {
  const animationRef = useRef<LottieView>(null);

  return (
    <View
      className="ml-0"
      style={{
        width: width,
        height: height,
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <LottieView
        ref={animationRef}
        source={loaderAnimation}
        autoPlay
        loop
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};
