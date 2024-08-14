import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function LogoBackground({ showLabel = true }: { showLabel?: boolean }) {
    const externalBackgroundColor = '#d9d9d9';

    return (
        <ThemedView
            style={{
                position: "absolute",
                top: -120,
                padding: '50%',
                backgroundColor: externalBackgroundColor,
                borderRadius: 250,
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
                    borderRadius: 200,
                }}
            >
                {showLabel && (
                    <ThemedText style={{ fontWeight: '900', fontSize: 25 }}>PowerPC</ThemedText>
                )}
            </ThemedView>
        </ThemedView>
    );
}
