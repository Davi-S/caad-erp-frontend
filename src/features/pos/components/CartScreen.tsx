import {
    ActionIcon, Badge, Button, Center, Divider, Group,
    ScrollArea, SimpleGrid, Stack, Text, ThemeIcon, Title, UnstyledButton
} from "@mantine/core"
import { Plus, Minus, ArrowLeft, ShoppingCart } from "lucide-react"
import { ScreenShell } from "@/components/ScreenShell"
import { brl } from "@/helpers"
import type { Salesman, Products, Stock } from "@/types"
import { useCart } from "../hooks/useCart"

interface CartScreenProps {
    salesman: Salesman
    products: Products
    stock: Stock
    cartState: ReturnType<typeof useCart>
    actions: {
        onBack: () => void
        onNext: () => void
    }
}

export function CartScreen({
    salesman,
    products,
    stock,
    cartState,
    actions
}: CartScreenProps) {
    const { cart, cartIterable, total, isEmpty, inc, dec, removeItem } = cartState
    const { onBack, onNext } = actions
    const availableFor = (id: string) => stock[id]

    return (
        <ScreenShell>
            {/* Header */}
            <Group wrap="nowrap">
                <ActionIcon onClick={onBack} variant="subtle" size="lg">
                    <ArrowLeft />
                </ActionIcon>
                <Stack gap={0}>
                    <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
                        Venda em andamento
                    </Text>
                    <Title order={1} size="h5">
                        Venda de {salesman?.salesman_name}
                    </Title>
                </Stack>
            </Group>

            {/* Middle Section */}
            <Stack style={{ flex: 1, minHeight: 0 }} py="lg">
                <Stack gap="sm">
                    <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
                        Toque para adicionar
                    </Text>
                    <SimpleGrid cols={3} spacing="sm">
                        {products.map((product) => {
                            const available = availableFor(product.product_id)
                            const soldOut = available !== undefined && available <= 0
                            const quantity = cart[product.product_id] || 0

                            return (
                                <UnstyledButton
                                    key={product.product_id}
                                    onClick={() => quantity > 0 ? removeItem(product.product_id) : inc(product.product_id)}
                                    disabled={soldOut}
                                    p="sm"
                                    style={(theme) => ({
                                        position: "relative",
                                        borderRadius: theme.radius.md,
                                        border: `2px solid ${quantity > 0 ? theme.colors.teal[6] : theme.colors.gray[3]}`,
                                        backgroundColor: soldOut
                                            ? theme.colors.gray[1]
                                            : quantity > 0
                                                ? theme.colors.teal[0]
                                                : theme.white,
                                        opacity: soldOut ? 0.5 : 1,
                                        textAlign: "center",
                                    })}
                                >
                                    {quantity > 0 && (
                                        <Badge
                                            color="teal"
                                            variant="filled"
                                            radius="xl"
                                            size="sm"
                                            style={{ position: "absolute", top: 4, right: 4 }}
                                        >
                                            {quantity}x
                                        </Badge>
                                    )}
                                    <Stack gap={2} align="center">
                                        <Text size="xs" fw={600} ta="center">
                                            {product.product_name}
                                        </Text>
                                        <Text size="xs" fw={700} c={soldOut ? "dimmed" : "teal"}>
                                            {soldOut ? "Esgotado" : brl(product.sell_price)}
                                        </Text>
                                        {!soldOut && (
                                            <Text size="10px" c="dimmed">
                                                {stock[product.product_id]}u disponíveis
                                            </Text>
                                        )}
                                    </Stack>
                                </UnstyledButton>
                            )
                        })}
                    </SimpleGrid>
                </Stack>

                {isEmpty ? (
                    <Center style={{ flex: 1 }}>
                        <Stack align="center" gap="xs">
                            <ThemeIcon variant="light" color="gray" size={40} radius="xl">
                                <ShoppingCart size={20} />
                            </ThemeIcon>
                            <Text c="dimmed" size="sm" ta="center">
                                Nenhum item ainda.
                            </Text>
                        </Stack>
                    </Center>
                ) : (
                    <ScrollArea type="scroll" style={{ flex: 1, minHeight: 0 }}>
                        <Stack gap={4}>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
                                No carrinho
                            </Text>
                            {cartIterable.map(([productId, quantity], index) => {
                                const product = products.find(p => p.product_id === productId)
                                if (!product) return null
                                return (
                                    <div key={productId}>
                                        {index > 0 && <Divider variant="dashed" my={4} />}
                                        <Group justify="space-between" wrap="nowrap">
                                            <Text size="sm" style={{ flex: 1 }}>{product.product_name}</Text>
                                            <Group gap={4} wrap="nowrap">
                                                <ActionIcon variant="light" color="teal" size="sm" onClick={() => dec(productId)}>
                                                    <Minus size={12} />
                                                </ActionIcon>
                                                <Text size="sm" w={20} ta="center">{quantity}</Text>
                                                <ActionIcon variant="light" color="teal" size="sm" onClick={() => inc(productId)}>
                                                    <Plus size={12} />
                                                </ActionIcon>
                                            </Group>
                                            <Text size="sm" fw={600} ff="monospace" w={72} ta="right">
                                                {brl(quantity * product.sell_price)}
                                            </Text>
                                        </Group>
                                    </div>
                                )
                            })}
                        </Stack>
                    </ScrollArea>
                )}
            </Stack>

            {/* Footer */}
            <Stack gap="xs">
                <Divider />
                <Group justify="space-between">
                    <Text fw={600}>Total</Text>
                    <Text fw={700} size="lg" ff="monospace">{brl(total)}</Text>
                </Group>
                <Button size="lg" color="teal" disabled={total === 0} onClick={onNext}>
                    Fechar venda
                </Button>
            </Stack>
        </ScreenShell>
    )
}
