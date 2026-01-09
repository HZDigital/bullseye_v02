import BullseyePage from '@/pages/bullseye-page'
import BullseyeCheckoutPage from '@/pages/bullseye-checkout-page'
import BullseyeLeverDocsPage from '@/pages/bullseye-lever-docs-page'

export const routes = [
  {
    path: '/',
    component: BullseyePage,
    title: 'BullsEye'
  },
  {
    path: '/checkout',
    component: BullseyeCheckoutPage,
    title: 'BullsEye'
  },
  {
    path: '/docs',
    component: BullseyeLeverDocsPage,
    title: 'BullsEye'
  },
]