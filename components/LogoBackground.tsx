import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function LogoBackground({ 
    showLabel = true, 
    labelText = "PowerPC" 
}: { 
    showLabel?: boolean;
    labelText?: string;
}) {
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
                {showLabel && (
                    <ThemedText style={{ fontWeight: '900', fontSize: 18 }}>{labelText}</ThemedText>
                )}
            </ThemedView>
        </ThemedView>
    );
}
