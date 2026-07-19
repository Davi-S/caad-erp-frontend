import {
    ActionIcon, Button, Group,
    SimpleGrid, Stack, Text, Title, ScrollArea,
    Divider, Center
} from "@mantine/core"
import { Plus, Minus, ArrowLeft } from "lucide-react"
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
            <Group>
                <ActionIcon onClick={onBack}>
                    <ArrowLeft />
                </ActionIcon>
                <Title order={1} size="h5">
                    Venda de {salesman?.salesman_name}
                </Title>
            </Group>

            {/* Middle Section */}
            <Stack style={{ flex: 1, minHeight: 0 }} py="xl">
                <Stack>
                    <Text>TOQUE PARA ADICIONAR</Text>
                    <SimpleGrid cols={3}>
                        {products.map((product) => {
                            const available = availableFor(product.product_id)
                            const soldOut = available !== undefined && available <= 0
                            const quantity = cart[product.product_id] || 0

                            return (
                                <Button
                                    key={product.product_id}
                                    onClick={() => quantity > 0 ? removeItem(product.product_id) : inc(product.product_id)}
                                    disabled={soldOut}
                                    h="auto"
                                    py="sm"
                                >
                                    <Stack gap={0} align="center">
                                        <Text size="xs" ta="center">
                                            {product.product_name}
                                        </Text>
                                        <Text size="xs" ta="center">
                                            {soldOut ? "Esgotado" : brl(product.sell_price)}
                                        </Text>
                                        <Text size="xs" ta="center">
                                            {soldOut ? "" : stock[product.product_id] + "u"}
                                        </Text>
                                    </Stack>
                                </Button>
                            )
                        })}
                    </SimpleGrid>
                </Stack>

                {isEmpty ? (
                    <Center style={{ flex: 1 }}>
                        <Text ta="center">
                            Nenhum item ainda.
                        </Text>
                    </Center>
                ) : (
                    <ScrollArea type="scroll" style={{ flex: 1 }}>
                        <Stack>
                            {cartIterable.map(([productId, quantity]) => {
                                const product = products.find(p => p.product_id === productId)
                                if (!product) return null
                                return (
                                    <Group key={productId} justify="space-between">
                                        <Text style={{ flex: 1 }}>{product.product_name}</Text>
                                        <Group>
                                            <ActionIcon onClick={() => dec(productId)}><Minus size={12} /></ActionIcon>
                                            <Text ta="center">{quantity}</Text>
                                            <ActionIcon onClick={() => inc(productId)}><Plus size={12} /></ActionIcon>
                                        </Group>
                                        <Text ta="right">{brl(quantity * product.sell_price)}</Text>
                                    </Group>
                                )
                            })}
                        </Stack>
                    </ScrollArea>
                )}
            </Stack>

            {/* Footer */}
            <Stack>
                <Divider />
                <Group justify="space-between">
                    <Text>Total</Text>
                    <Text>{brl(total)}</Text>
                </Group>
                <Button size="lg" disabled={total === 0} onClick={onNext}>
                    Fechar venda
                </Button>
            </Stack>
        </ScreenShell>
    )
}
