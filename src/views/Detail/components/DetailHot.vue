<script setup lang="ts">

import {computed, onMounted, ref} from 'vue';
import {getHotGoodsAPI} from '@/apis/detail';
import {useRoute} from 'vue-router';

const props = defineProps({
    hotType: {
        type: Number,
        default: 1
    }
})

type IndexType = {
    [index: string | number]: string
}
//动态渲染title
const TYPEMAP: IndexType = {
    1: '24小时热榜',
    2: '周热榜'
}
const title = computed(() => TYPEMAP[props.hotType])

// 获取商品热榜
interface HotGoods {
    desc: string
    id: string
    name: string
    orderNum: number
    picture: string
    price: string
}

const hotList = ref<HotGoods[]>([])
const route = useRoute()
const getHotGoods = async () => {
    const res = await getHotGoodsAPI<IReturnType<HotGoods[]>>({
        id: route.params.id, type: props.hotType as number
    })
    hotList.value = res.result
}
onMounted(() => getHotGoods())


// count

</script>


<template>
    <div class="goods-hot">
        <h3>{{ title }}</h3>
        <!-- 商品区块 -->
        <RouterLink to="/" class="goods-item" v-for="item in hotList" :key="item.id">
            <img :src="item.picture" alt=""/>
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="desc ellipsis">{{ item.desc }}</p>
            <p class="price">&yen;{{ item.price }}</p>
        </RouterLink>
    </div>
</template>


<style scoped lang="scss">
.goods-hot {
  h3 {
    height: 70px;
    background: $helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }

  .goods-item {
    display: block;
    padding: 20px 30px;
    text-align: center;
    background: #fff;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }
}
</style>