import {
    ActionIcon, Button, Divider, Group, Paper,
    SimpleGrid, Stack, Text, Title
} from "@mantine/core"
import { Plus, Minus, ArrowLeft, Pencil } from "lucide-react"
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
            <Group justify="space-between">
                <ActionIcon variant="subtle" onClick={onBack}>
                    <ArrowLeft />
                </ActionIcon>
                <Title order={1} size="h5">Venda de {salesman?.salesman_name}</Title>
                <ActionIcon variant="subtle" onClick={onBack}>
                    <Pencil size={18} />
                </ActionIcon>
            </Group>

            {/* Product Grid */}
            <Stack py="xl">
                <Text size="xs" c="dimmed">
                    TOQUE PARA ADICIONAR
                </Text>
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
                                <Text size="xs" ta="center">{product.product_name}</Text>
                                <Text size="xs" fw={400}>
                                    {soldOut ? "Esgotado" : brl(product.sell_price)}
                                </Text>
                            </Button>
                        )
                    })}
                </SimpleGrid>
            </Stack>

            {/* Cart List */}
            <Stack>
                {isEmpty ? (
                    <Text c="dimmed" ta="center">
                        Nenhum item ainda.
                    </Text>
                ) : (
                    cartIterable.map(([productId, quantity]) => {
                        const product = products.find(p => p.product_id === productId)
                        if (!product) return null
                        return (
                            <Group key={productId} justify="space-between">
                                <Text style={{ flex: 1 }}>{product.product_name}</Text>
                                <Group>
                                    <ActionIcon onClick={() => dec(productId)}>
                                        <Minus size={12} />
                                    </ActionIcon>
                                    <Text ta="center">{quantity}</Text>
                                    <ActionIcon onClick={() => inc(productId)}>
                                        <Plus size={12} />
                                    </ActionIcon>
                                </Group>
                                <Text ta="right">{brl(quantity * product.sell_price)}</Text>
                            </Group>
                        )
                    })
                )}
            </Stack>

            {/* Footer */}
            <Stack mt="auto" pt="md">
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
