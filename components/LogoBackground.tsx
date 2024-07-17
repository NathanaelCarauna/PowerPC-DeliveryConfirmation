import { ThemedText } from "./ThemedText"
import { ThemedView } from "./ThemedView"

export default function LogoBackground() {
    return (
        <ThemedView
            style={{
                position: "absolute",
                top: -120,
                padding: '50%',
                backgroundColor: '#d9d9d9',
                borderRadius: 250,
                justifyContent: "center",
                alignItems: "center",

            }}>
            <ThemedView
                style={{
                    width: 150,
                    height: 150,
                    backgroundColor: 'white',
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 200

                }}>
                <ThemedText style={{ fontWeight: '900', fontSize: 25 }}>PowerPC</ThemedText>
            </ThemedView>
        </ThemedView>
    )
}