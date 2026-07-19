import { Container, Stack } from '@mantine/core'

export function ScreenShell({ children }: { children: React.ReactNode }) {
    return (
        <Container px="xl" py="xl">
            <Stack>
                {children}
            </Stack>
        </Container>
    )
}
