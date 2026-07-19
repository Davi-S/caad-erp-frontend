import { Container } from '@mantine/core'

export function ScreenShell({ children }: { children: React.ReactNode }) {
    return (
        <Container
            px="xl"
            py="xl"
            h="100svh"
            display="flex"
            style={{ flexDirection: 'column' }}
        >
            {children}
        </Container>
    )
}
