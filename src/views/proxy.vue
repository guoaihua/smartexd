<template>
    <div class="proxy">
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple-dark lable-text">
                    target :
                </div>
            </el-col>
            <el-col :span="18">
                <div class="grid-content bg-purple-dark">
                    <el-input
                            placeholder="if target match"
                            v-model="rules.target"
                            type="text"
                           clearable
                            >
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <div class="ph-div-20"></div>
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple-dark lable-text">
                    response :
                </div>
            </el-col>
            <el-col :span="18">
                <div class="grid-content bg-purple-dark">
                    <el-input
                            placeholder="your response"
                            v-model="rules.response"
                            type="text"
                            clearable
                            >
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <div class="ph-div-20"></div>
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple-dark lable-text">
                    confirm :
                </div>
            </el-col>
            <el-col :span="18">
                <div class="grid-content bg-purple-dark">
                    <el-button type="primary" @click="saveRule">save<i class="el-icon-upload el-icon--right"></i></el-button>
                    <el-button type="primary" @click="clearAll">clerall<i class="el-icon-upload el-icon--right"></i></el-button>
                </div>
            </el-col>
        </el-row>
        <P style="text-align: left">已存储信息，详细信息请移动鼠标到上方</P>
        <el-table
                :data="tablelist"
                border
                class="table-list"
                size="small"
                style="width: 100%;"
                max-height="350"
                :row-class-name="tableRowClassName"
        >
            <el-table-column
                    prop="rule"
                    label="rule"
                    width="168"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="response"
                    label="response"
                    show-overflow-tooltip
                    width="168">
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button @click="modifyRule(scope.row)" type="text" size="small" >修改</el-button>
                    <el-button @click="disableRule(scope.row)" type="text" size="small">{{ scope.row.disable ? '启用' :'禁用'}}</el-button>
                    <el-button @click="removeRule(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    export default {
        name: "proxy",
        data() {
            return {
                rules: {
                    target: '',
                    response: ''
                },
                isModify: false,
                list: {
                    "123131":{
                        rule: "htpps://12313",
                        response: "q23131",
                        disable: true
                    },
                    "123adad":{
                        rule: "htpps://12313",
                        response: "q23131",
                        disable: false
                    }
                }
            }
        },
        created() {
            this.updateList();
        },
        mounted(){

        },
        computed:{
            tablelist:function () {
                // 将list 对象类型数据进行装换
                let tablist = [];
                let listkeys = Object.keys(this.list);

                if(!listkeys.length){
                    return tablist
                }
                listkeys.forEach((item,index)=>{
                    tablist.push({
                        rule: this.list[item]['rule'],
                        response: this.list[item]['response'],
                        disable: this.list[item]['disable'],
                        id: item
                    })
                })
                return tablist
            }
        },
        methods: {
            tableRowClassName({row}){
                if(row.disable){
                    return 'warning-row';
                }
            },

            saveRule(){
                let self = this;
                let id = Date.now();
                // 保存规则之前要对规则做一个检查
                var {rule,value} = self.checkRules(self.rules);
                if(self.isModify){
                    // 数据检验成功，
                    id = self.rules.id;
                    self.isModify = false;
                }

                // 增加key 结构 object, timestamp: {
                //  rule
                //    response
                // }
                chrome.storage.local.set({
                      [id]: {
                        rule: rule,
                        response: value,
                          disable: false
                    }
                }, function() {
                    // 更新list
                    self.updateList(function (newlist) {
                        // 并通知backgroundjs
                        let bg = chrome.extension.getBackgroundPage();
                        bg.updateRules(newlist);
                    });

                });
            },
            removeRule(e){
                var self = this;
                console.log(e);
                chrome.storage.local.remove(e.id,function () {
                    self.updateList(function (newlist) {
                        console.log("移除成功");
                        // 并通知backgroundjs
                        let bg = chrome.extension.getBackgroundPage();
                        bg.updateRules(newlist);
                    });
                })
            },
            modifyRule(e){
                this.rules = {
                    target: e.rule,
                    response: e.response,
                    id: e.id
                }
                // 标识当前操作为修改操作，save的时候要把之前的替换了
                this.isModify = true;
            },
            disableRule(e){
                console.log(e);
                let self = this;
                chrome.storage.local.set({
                    [e.id]: {
                        rule: e.rule,
                        response: e.response,
                        disable: !e.disable
                    }
                }, function() {
                    // 更新list
                    self.updateList(function (newlist) {
                        // 并通知backgroundjs
                        let bg = chrome.extension.getBackgroundPage();
                        bg.updateRules(newlist);
                    });

                });
            },
            clearAll(){
                var self = this;
                chrome.storage.local.clear(function (res) {
                    console.log(res);
                    // 更新list
                    self.updateList(function (newlist) {
                        // 并通知backgroundjs
                        let bg = chrome.extension.getBackgroundPage();
                        bg.updateRules(newlist);
                    });

                })
            },
            checkRules(rule){
                // 去掉空格
                return {
                    rule: rule.target.trim(),
                    value: rule.response.trim()
                }
            },
            checkDuplicated(key,value){
                return (key in this.list && this.list[key] === value) ? true: false;
            },
            updateList(cb){
                let self = this;
                // 更新拿到最新的list，然后返回
                chrome.storage.local.get(null,function (newlist) {
                    // 直接改变对象，触发跟新
                    self.list = newlist
                    cb && cb(newlist)
                })
            }

        }

    }
</script>

<style  lang="scss">
    .ph-div-20 {
        width: 100%;
        height: 20px;
    }
    .el-table .warning-row {
        background: oldlace;
    }

    .proxy {
        .lable-text {
            font-size: 18px;
            height: 40px;
            line-height: 40px;
        }
        .input-textarea {
            height: 40px;
        }
        .table-list {
            margin-top: 20px;
            background: beige;
        }
    }
</style>
