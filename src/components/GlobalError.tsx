import { useRouteError, useNavigate } from "react-router-dom"
import { Button, Center, Text, Stack } from "@mantine/core"
import { AlertTriangle } from "lucide-react"
import { ScreenShell } from "./ScreenShell"

export function GlobalError() {
    const error = useRouteError()
    const navigate = useNavigate()

    const errorMessage = error instanceof Error
        ? error.message
        : typeof error === "string"
            ? error
            : "An unexpected error occurred"

    return (
        <ScreenShell>
            <Center style={{ minHeight: "100svh" }}>
                <Stack align="center">
                    <AlertTriangle />
                    <Stack align="center">
                        <Text>Erro</Text>
                        <Text c="dimmed" ta="center">
                            {errorMessage}
                        </Text>
                    </Stack>

                    <Button onClick={() => navigate(".", { replace: true })}>
                        Tentar de novo
                    </Button>
                </Stack>
            </Center>
        </ScreenShell>
    )
}
