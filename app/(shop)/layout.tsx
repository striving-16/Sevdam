import { Navbar }             from '@/components/layout/navbar'
import { Footer }             from '@/components/layout/footer'
import { CartDrawer }         from '@/components/cart/cart-drawer'
import { FloatingCartButton } from '@/components/cart/floating-cart-button'
import { getWhatsAppNumber }  from '@/actions/settings-actions'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const whatsappNumber = await getWhatsAppNumber()
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer whatsappNumber={whatsappNumber} />
      <CartDrawer whatsappNumber={whatsappNumber} />
      <FloatingCartButton />
    </>
  )
}
