import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface SkuObj {
  skuId: string
  price: string
  oldPrice?: string
  inventory?: number
  specsText?: string
}

export interface CartObj extends SkuObj {
  id: string
  name: string
  picture: string
  count: number
  selected: boolean
  attrsText?: string
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const cartList = ref<CartObj[]>([])

    // 添加购物车
    const addCart = (cartObj: CartObj) => {
      const tarObj = cartList.value.find(item => item.skuId === cartObj.skuId)
      if (tarObj) {
        tarObj.count++
      } else {
        cartList.value.push(cartObj)
      }
    }

    // 删除购物车
    const delCart = skuId => {
      const idx = cartList.value.findIndex(item => item.skuId === skuId)
      cartList.value.splice(idx, 1)
    }
    // 计算属性
    const totalCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    const totalPrice = computed(() => cartList.value.reduce((a, c) => a + +c.price * c.count, 0))
    return {
      cartList,
      addCart,
      delCart,
      totalCount,
      totalPrice,
    }
  },
  {
    persist: true,
  }
)