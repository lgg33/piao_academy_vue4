<template>
  <div>
    <div style="margin-top: 20px;margin-left: 10px">
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="queryInfo.name" placeholder="讲师名"/>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryInfo.level" clearable placeholder="讲师头衔">
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
          </el-select>
        </el-form-item>

        <el-form-item label="添加时间">
          <el-date-picker
            v-model="queryInfo.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryInfo.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="getTeachers">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        type="index"
        label="序号"
        width="70"
        align="center">
<!--        <template slot-scope="scope">-->
<!--          {{ (num - 1) * limit + scope.$index + 1 }}-->
<!--        </template>-->
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)" class="teacher-btn-del">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页导航区域 @size-change(pagesize改变时触发)
                      @current-change(页码发生改变时触发)
                      :current-page(设置当前页码)
                      :page-size(设置每页的数据条数)
                      :total(设置总页数) -->
    <div style="margin-left: 60%; margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="this.num" :page-sizes="[3, 2, 5, 10]" :page-size="size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import teacher from '@/api/teacher';

  export default {
    name: 'list',
    data() {
      return {
        listLoading: true, // 是否显示loading信息
        list: null, // 数据列表
        total: 0, // 总记录数
        num: 1, // 页码
        size: 10, // 每页记录数
        queryInfo: {}// 查询条件
      }
    },
    created() {
      this.getTeachers();
    },
    methods: {
      getTeachers() {
        teacher.getPageList(this.num, this.size, this.queryInfo).then((resp) => {
          // console.log(resp);
          if (resp.success === true) {
            this.list = resp.data.item;
            this.total = resp.data.total;
          }
          this.listLoading = false;
        });
      },
      handleSizeChange(newPageSize) {
        //pagesize改变时触发，当pagesize发生改变的时候，我们应该
        //以最新的pagesize来请求数据并展示数据
        this.size = newPageSize;
        this.getTeachers();
      },
      handleCurrentChange(current) {
        //页码发生改变时触发当current发生改变的时候，我们应该
        //以最新的current页码来请求数据并展示数据
        this.num = current;
        this.getTeachers();
      },
      resetData() {
        this.queryInfo = {};
        this.getTeachers();
      },
      removeDataById(id) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return teacher.deleteById(id)
        }).then(() => {
          this.getTeachers()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch((response) => { // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

  .teacher-btn-del {
    margin-left: 5px;
  }

</style>
