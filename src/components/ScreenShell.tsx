import { Container, Stack } from '@mantine/core'

export function ScreenShell({ children }: { children: React.ReactNode }) {
    return (
        <Container>
            <Stack>
                {children}
            </Stack>
        </Container>
    )
}
