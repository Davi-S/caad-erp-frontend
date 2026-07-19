import { useState, useEffect } from "react"
import {
    ActionIcon, Alert, Badge, Button, Center,
    CopyButton, Group, Paper, SegmentedControl,
    Stack, Text, Title
} from "@mantine/core"
import { Check, Copy, ArrowLeft, AlertTriangle, QrCode, Banknote, CreditCard, MoreHorizontal } from "lucide-react"
import { brl, buildQrGrid, QR_SIZE } from "@/helpers"
import { ScreenShell } from "@/components/ScreenShell"
import type { PaymentType } from "@/types"
import type { Salesman } from "@/types"
import { useCart } from "../hooks/useCart"
import { useCheckout } from "../hooks/useCheckout"

const QR_GRID = buildQrGrid()

interface PaymentScreenProps {
    salesman: Salesman
    cartState: ReturnType<typeof useCart>
    checkoutState: ReturnType<typeof useCheckout>
    actions: {
        onConfirm: (method: PaymentType) => void
        onNewSale: () => void
        onEdit: () => void
        onCancel: () => void
    }
}

const METHOD_OPTIONS = [
    { value: "PIX", label: <MethodLabel icon={<QrCode size={16} />} text="Pix" /> },
    { value: "Cash", label: <MethodLabel icon={<Banknote size={16} />} text="Dinheiro" /> },
    { value: "OnCredit", label: <MethodLabel icon={<CreditCard size={16} />} text="Fiado" /> },
    { value: "Other", label: <MethodLabel icon={<MoreHorizontal size={16} />} text="Outro" /> },
]

export function PaymentScreen({ salesman, cartState, checkoutState, actions }: PaymentScreenProps) {
    const [method, setMethod] = useState<PaymentType>("PIX")

    const { status, error, resetCheckout } = checkoutState
    const { onConfirm, onNewSale, onEdit, onCancel } = actions

    useEffect(() => {
        resetCheckout()
    }, [])

    const confirmed = status === "success"
    const confirming = status === "pending"
    const isLocked = status === "pending" || status === "success"

    return (
        <ScreenShell>
            {/* Header */}
            <Group justify="space-between">
                <ActionIcon onClick={onEdit} disabled={isLocked}>
                    <ArrowLeft />
                </ActionIcon>
                <Title order={1} size="h5">
                    Venda de {salesman?.salesman_name}
                </Title>
                <Button onClick={onCancel} disabled={isLocked} color="red" size="compact-sm">
                    Cancelar
                </Button>
            </Group>

            {/* Middle Section */}
            <Stack style={{ flex: 1, minHeight: 0 }} justify="center" py="md">
                <Paper withBorder shadow="sm" radius="md" p="lg" mx="auto" w="100%" maw={360}>
                    <Stack align="center" gap="xs">
                        <Badge
                            color={confirmed ? "teal" : "yellow"}
                            variant="light"
                            leftSection={confirmed ? <Check size={12} /> : undefined}
                        >
                            {confirmed ? "Pagamento confirmado" : "Aguardando pagamento"}
                        </Badge>

                        <Text size="32px" fw={700}>
                            {brl(cartState.total)}
                        </Text>

                        <SegmentedControl
                            data={METHOD_OPTIONS}
                            value={method}
                            onChange={(value) => setMethod(value as PaymentType)}
                            disabled={isLocked}
                            fullWidth
                            mt="sm"
                        />

                        <Paper withBorder radius="md" p="md" mt="sm" w="100%" mih={180}>
                            <Center style={{ flexDirection: "column", height: "100%" }}>
                                {method === "PIX" && (
                                    <Stack align="center" gap="sm">
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: `repeat(${QR_SIZE}, 10px)`,
                                                gridTemplateRows: `repeat(${QR_SIZE}, 10px)`,
                                            }}
                                        >
                                            {QR_GRID.flatMap((row, r) =>
                                                row.map((cell, c) => (
                                                    <div
                                                        key={r + "-" + c}
                                                        style={{
                                                            width: 10,
                                                            height: 10,
                                                            backgroundColor: cell ? "var(--mantine-color-dark-9)" : "transparent",
                                                        }}
                                                    />
                                                ))
                                            )}
                                        </div>
                                        <CopyButton value="pix-8f2a91cd" timeout={1500}>
                                            {({ copied, copy }) => (
                                                <Button
                                                    onClick={copy}
                                                    disabled={isLocked}
                                                    variant="default"
                                                    size="xs"
                                                    leftSection={<Copy size={14} />}
                                                    color={copied ? "teal" : undefined}
                                                >
                                                    {copied ? "Copiado!" : "pix •••• 8f2a-91cd"}
                                                </Button>
                                            )}
                                        </CopyButton>
                                    </Stack>
                                )}

                                {method === "Cash" && (
                                    <Text size="sm" c="dimmed" ta="center">
                                        Receba o valor em espécie e confirme abaixo.
                                    </Text>
                                )}

                                {method === "OnCredit" && (
                                    <Text size="sm" c="dimmed" ta="center">
                                        O valor será adicionado à conta do cliente.
                                    </Text>
                                )}

                                {method === "Other" && (
                                    <Text size="sm" c="dimmed" ta="center">
                                        Utilize a maquininha de cartão ou outro método externo.
                                    </Text>
                                )}
                            </Center>
                        </Paper>
                    </Stack>
                </Paper>

                {error && (
                    <Alert color="red" icon={<AlertTriangle size={16} />} mx="auto" w="100%" maw={360}>
                        {error}
                    </Alert>
                )}
            </Stack>

            {/* Footer */}
            <Stack mx="auto" w="100%" maw={360}>
                {!confirmed ? (
                    <Button
                        size="lg"
                        color="teal"
                        onClick={() => onConfirm(method)}
                        loading={confirming}
                    >
                        Já recebi o pagamento
                    </Button>
                ) : (
                    <Button size="lg" variant="outline" color="teal" onClick={onNewSale}>
                        Nova venda
                    </Button>
                )}
            </Stack>
        </ScreenShell>
    )
}

function MethodLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <Stack gap={2} align="center" py={4}>
            {icon}
            <Text size="10px" fw={600} tt="uppercase">
                {text}
            </Text>
        </Stack>
    )
}
