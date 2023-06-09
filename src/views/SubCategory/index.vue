<script setup lang="ts">

import { getCategoryFilterAPI, getSubCategoryAPI, type Data } from '@/apis/category'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import GoodsItem from '../Home/components/GoodsItem.vue';
// 获取面包屑导航数据
const route = useRoute()
interface FilterData {
    id: string
    name: string
    parentId: string
    parentName: string
    saleProperties: any[]
}
const filterData = ref<FilterData>({} as FilterData)
const getFilterData = async (id: string | string[]) => {
    const res = await getCategoryFilterAPI<IReturnType<FilterData>>(id)
    filterData.value = res.result
}

onMounted(() => getFilterData(route.params.id))


// 获取基础列表渲染数据
interface GoodList {
    id: string
    name: string
    desc: string
    orderNum: number
    picture: string
    price: string
}
const goodList = ref<GoodList[]>([])
const reqData = ref<Data>({
    categoryId: route.params.id,
    page: 1,
    pageSize: 20,
    sortField: 'publishTime'
})

const getSubCategory = async () => {
    const res = await getSubCategoryAPI<IReturnType<any>>(reqData.value)
    goodList.value = res.result.items
}
onMounted(() => getSubCategory())


// tab切换回调
const tabChange = () => {
    console.log(reqData.value.sortField);
    reqData.value.page = 1
    getSubCategory()
}

// 加载更多
const disabled = ref(false)
const load = async () => {
    // 获取下一页数据
    reqData.value.page++
    const res = await getSubCategoryAPI<IReturnType<any>>(reqData.value)
    goodList.value = [...goodList.value, ...res.result.items]
    // 加载完毕，停止监听
    if (res.result.items === 0) {
        disabled.value = true
    }
}
</script>

<template>
    <div class="container ">
        <!-- 面包屑 -->
        <div class="bread-container">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/' } as string">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `/category/${filterData.parentId}` } as string">{{ filterData.parentName }}
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{ filterData.name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="sub-container">
            <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
                <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
                <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
                <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
            </el-tabs>
            <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
                <!-- 商品列表-->
                <template v-for="item in goodList" :key="item.id">
                    <GoodsItem :goods="item" />
                </template>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.bread-container {
    padding: 25px 0;
    color: #666;
}

.sub-container {
    padding: 20px 10px;
    background-color: #fff;

    .body {
        display: flex;
        flex-wrap: wrap;
        padding: 0 10px;
    }

    .goods-item {
        display: block;
        width: 220px;
        margin-right: 20px;
        padding: 20px 30px;
        text-align: center;

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

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }


}
</style>