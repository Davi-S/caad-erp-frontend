import { useState } from "react"
import { Button, Stack, Text, Title } from "@mantine/core"
import { Check } from "lucide-react"
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

    return (
        <ScreenShell>
            <Title order={1} size="h2">Quem tá vendendo hoje?</Title>

            <Stack py="xl">
                {salesmen.length === 0 && (
                    <Text c="dimmed">
                        Nenhum vendedor cadastrado ainda.
                    </Text>
                )}

                {salesmen.filter((s) => s.is_active).map((salesman) => (
                    <Button
                        key={salesman.salesman_id}
                        variant={selectedId === salesman.salesman_id ? "outline" : "default"}
                        justify="space-between"
                        rightSection={selectedId === salesman.salesman_id && <Check size={18} />}
                        onClick={() => setSelectedId(salesman.salesman_id)}
                        size="lg"
                    >
                        {salesman.salesman_name}
                    </Button>
                ))}
            </Stack>

            <Button
                disabled={!selectedId}
                onClick={() => selectedId && onNext(selectedId)}
                size="lg"
            >
                Começar venda
            </Button>
        </ScreenShell>
    )
}
