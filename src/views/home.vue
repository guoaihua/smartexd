<template>
    <div class="home">
        <el-container>
            <el-header>
                <el-row :gutter="24">
                    <el-col :span="6" v-for="(item,index) in list" :key="index">
                        <div class="grid-content bg-purple">
                            <el-button type="primary" plain class="color-black">
                                <router-link :to="item.path" >{{item.name}}</router-link>
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>

    </div>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {
                list: [
                    {
                        name: '网络代理',
                        title: '这是一个可以用来进行修改网络请求响应',
                        path: '/proxy'
                    },
                    {
                        name: '书签',
                        title: '这是一个可以用来进行修改网络请求响应',
                        path: '/bookmarks'
                    },
                    {
                        name: '网络代理',
                        title: '这是一个可以用来进行修改网络请求响应',
                        path: '/proxy'
                    },
                    {
                        name: '书签',
                        title: '这是一个可以用来进行修改网络请求响应',
                        path: '/bookmarks'
                    }
                ]
            }
        }
    }
</script>

<style scoped lang="scss">


    .el-row {
        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .el-header, .el-footer {
        text-align: center;
        line-height: 60px;
    }

    .el-main {
        text-align: center;
        border: 1px solid #E9EEF3;
    }


    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .home {
        height: 100%;
        width: 100%;

        .el-container {
            width: 100%;
            height: 100%;
            .color-black a{
                color: #409EFF
            }
            .color-black:hover a{
                color: #fff
            }
        }

    }
</style>
