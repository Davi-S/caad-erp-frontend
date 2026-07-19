import { useState } from "react"
import {
    Button, Center, Group,
    ScrollArea, Stack, Text, ThemeIcon, Title, UnstyledButton
} from "@mantine/core"
import { Check, Users } from "lucide-react"
import { ScreenShell } from "@/components/ScreenShell"
import type { Salesmen } from "@/types"

interface SalesmenScreenProps {
    salesmen: Salesmen
    onNext: (salesmanId: string) => void
}

export function SalesmenScreen({
    salesmen,
    onNext
}: SalesmenScreenProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const active = salesmen.filter((s) => s.is_active)

    return (
        <ScreenShell>
            {/* Header */}
            <Stack gap={4}>
                <Title order={1} size="h2">
                    Quem tá vendendo hoje?
                </Title>
            </Stack>

            {/* Middle Section */}
            <Stack style={{ flex: 1, minHeight: 0 }} py="lg">
                {active.length === 0 ? (
                    <Center style={{ flex: 1 }}>
                        <Stack align="center" gap="xs">
                            <ThemeIcon variant="light" color="gray" size={48} radius="xl">
                                <Users size={22} />
                            </ThemeIcon>
                            <Text c="dimmed" ta="center">
                                Nenhum vendedor cadastrado ainda.
                            </Text>
                        </Stack>
                    </Center>
                ) : (
                    <ScrollArea type="scroll" style={{ flex: 1 }}>
                        <Stack gap="sm">
                            {active.map((salesman) => {
                                const isSelected = selectedId === salesman.salesman_id
                                return (
                                    <UnstyledButton
                                        key={salesman.salesman_id}
                                        onClick={() => setSelectedId(salesman.salesman_id)}
                                        p="sm"
                                        style={(theme) => ({
                                            borderRadius: theme.radius.md,
                                            border: `2px solid ${isSelected ? theme.colors.teal[6] : theme.colors.gray[3]}`,
                                            backgroundColor: isSelected ? theme.colors.teal[0] : theme.white,
                                            transition: "border-color 120ms ease, background-color 120ms ease",
                                        })}
                                    >
                                        <Group justify="space-between" wrap="nowrap">
                                            <Group wrap="nowrap" gap="sm">
                                                <Text fw={600}>{salesman.salesman_name}</Text>
                                            </Group>

                                            {isSelected && (
                                                <Check size={18} />
                                            )}
                                        </Group>
                                    </UnstyledButton>
                                )
                            })}
                        </Stack>
                    </ScrollArea>
                )}
            </Stack>

            {/* Footer */}
            <Button
                disabled={!selectedId}
                onClick={() => selectedId && onNext(selectedId)}
                size="lg"
                color="teal"
            >
                Começar venda
            </Button>
        </ScreenShell>
    )
}
