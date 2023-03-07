
<template>
  <div class="table-box">

    <!--  标题  -->
    <div class="title">
      <h2>最简单的 CRUD Demo</h2>
    </div>

    <!-- query  -->
    <div class="query-box">
      <el-input class="query-input" v-model="queryInput" placeholder="请输入姓名搜索" @change="handlerQueryName" />
      <div class="btn-list">
        <el-button type="primary" @click="handlerAdd">增加</el-button>
        <el-button type="danger" @click="handleDelList" v-if="multipleSelection.length >0">删除多选</el-button>
      </div>
    </div>
    <!--    table-->
    <el-table
        border
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="150" />
      <el-table-column prop="state" label="电话" width="120" />
      <el-table-column prop="state" label="状态" width="120" />
      <el-table-column prop="address" label="地址" width="300" />

      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleRowDelete(scope.row)" style="color: #F56C6C">删除</el-button>
          <el-button link type="primary" size="small" @click="handlerEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        style="display:flex; justify-content:center; margin-top: 10px;"
        :total="total"
        v-model:current-page="curPage"
        @current-change="handlerChangePage"
    />


    <!--dialog  -->
    <el-dialog v-model="dialogFormVisible" :title="dialogType === 'add' ? '新增': '编辑'">
      <el-form :model="tableForm">
        <el-form-item label="姓名" :label-width="60">
          <el-input v-model="tableForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="60">
          <el-input v-model="tableForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="60">
          <el-input v-model="tableForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" :label-width="60">
          <el-input v-model="tableForm.state" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" :label-width="60">
          <el-input v-model="tableForm.address" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogConfig">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>

  import {ref} from "vue";
  import request from "./utils/request.js"

  /* 数据*/
  let queryInput = $ref("")
  let tableData = $ref([{
    id:"1",
    name: 'Tom1',
    email: '123@qq.com',
    phone: '1380013800',
    state:  '在职',
    address: '广东省珠海',
  },{
    id:"2",
    name: 'Tom2',
    email: '123@qq.com',
    phone: '1380013800',
    state:  '在职',
    address: '广东省珠海',
  },{
    id:"3",
    name: 'Tom3',
    email: '123@qq.com',
    phone: '1380013800',
    state:  '在职',
    address: '广东省珠海',
  },{
    id:"4",
    name: 'Tom4',
    email: '123@qq.com',
    phone: '1380013800',
    state:  '在职',
    address: '广东省珠海',
  },])
  let multipleSelection = $ref([])
  let dialogFormVisible = $ref(false)
  let tableForm = $ref({
    id: "1",
    name:`张三`,
    email:'123@qq.com',
    phone:'1368828385',
    state:'在职',
    address:'北京'
  })
  let dialogType = $ref('add')
  let tableDataCopy = Object.assign(tableData)

  let total = $ref(20)
  let curPage = $ref(1)
  /* 方法*/


  /* request.js */
  const getTableData = async (cur = 1) => {
    // let res = request.get('/list/?pageSize=10&pageNum=&{cur}')

    let res = await request.get('/list', {
      pageSize: 10,
      pageNum: cur
    })  // baseURL: /user
    tableData = res.list
    total = res.total
    curPage = res.pageNum
    console.log(res);
    console.log(total);
  }
  getTableData()
  /* request.js */

  // 请求分页
  const handlerChangePage = (val) => {
    getTableData(curPage)
  }


  // 编辑
  const handlerEdit = (row) => {
    dialogFormVisible = true
    dialogType = 'edit'
    tableForm = {...row}
    // console.log(tableForm);
    // console.log(tableForm.value.id);
  }

  // 删除单个
  const handleRowDelete = async ({ID}) => {
    // console.log(id)
    /*  版本一
    let index = tableData.findIndex(item=>item.id === id)
    tableData.splice(index, 1) */

  await request.delete(`/delete/${ID}`)
    getTableData(curPage)
  }

  // 删除多选
  const handleDelList = () => {
    multipleSelection.forEach(ID=>{
      handleRowDelete({ID})
    })
    multipleSelection = []
  }

  // 选中
  const handleSelectionChange = (val) => {
    // multipleSelection.value = val
    // console.log(val)
    multipleSelection = []
    val.forEach(item=>{
      multipleSelection.push(item.ID)
    })
    // console.log(multipleSelection);
  }

  // 添加
  const handlerAdd = () => {
    dialogFormVisible = true
    tableForm = {}
    dialogType = 'add'
  }

  // 确认
  const dialogConfig = async () => {
    dialogFormVisible = false

    // 判断是新增还是编辑
    if(dialogType === 'add') { // 新增

      /*  版本一
      //1 拿数据
      //2 添加到table
      tableData.push({
        id:(tableData.length + 1).toString(),
        ...tableForm
      })
      */
      // 添加数据
      let res = await request.post("/add",{
        ...tableForm
      })
      // 刷新数据

      await getTableData(curPage)

    } else {  // 编辑

      /*
      let index = tableData.findIndex(item => item.id ===tableForm.id)
      tableData[index] = tableForm
      // console.log(tableData[index]);*/

      await request.put(`/update/${tableForm.ID}`, {
        ...tableForm
      })
      getTableData(curPage)
    }
  }

  // 搜索
  const handlerQueryName = async (val) => {
    // console.log(queryInput);
    // console.log(val)

    /*
    if(val.length > 0) {
      tableData = tableData.filter(item=> item.name.toLowerCase().match(val.toLowerCase()))
    } else {
      tableData = tableDataCopy
    }*/
    if (val.length > 0) {
      tableData = await request.get(`/list/${val}`)
    } else {
      await getTableData(curPage)
    }

  }

</script>

<style scoped>
  .table-box{
    margin: 200px;
    width: 800px;
  }
  .title{
    text-align: center;
  }
  .query-box{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .query-input{
    width: 200px;
  }
</style>
