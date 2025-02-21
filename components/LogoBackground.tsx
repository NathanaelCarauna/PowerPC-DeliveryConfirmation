import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Image } from "react-native";


export default function LogoBackground({ 
    showLabel = true, 
}: { 
    showLabel?: boolean;
}) {
    const logoSource = require("../assets/images/logo.jpg");
    const externalBackgroundColor = '#d9d9d9';

    return (
        <ThemedView
            style={{
                position: "absolute",
                top: -130,
                padding: '45%',
                backgroundColor: externalBackgroundColor,
                borderRadius: 200,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ThemedView
                style={{
                    width: 150, 
                    height: 150, 
                    backgroundColor: showLabel ? 'white' : externalBackgroundColor,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 180, 
                }}
            >
                <Image 
                    source={logoSource} 
                    style={{ width: 100, height: 100, resizeMode: "contain" }} 
                />
            </ThemedView>
        </ThemedView>
    );
}
