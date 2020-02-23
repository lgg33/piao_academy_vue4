<template>
  <div>
    <div style="margin-top: 20px;margin-left: 10px">
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline">

        <!-- 所属分类：级联下拉列表 -->
        <!-- 一级分类 -->
        <el-form-item label="课程类别">
          <el-select
            v-model="queryInfo.subjectParentId"
            placeholder="请选择"
            @change="subjectFirstChanged">
            <el-option
              v-for="subject in subjectFirstList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>

          <!-- 二级分类 -->
          <el-select v-model="queryInfo.subjectId" placeholder="请选择" style="margin-left: 3px">
            <el-option
              v-for="subject in subjectSecondList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
        </el-form-item>

        <!-- 标题 -->
        <el-form-item>
          <el-input v-model="queryInfo.title" placeholder="课程标题"/>
        </el-form-item>
        <!-- 讲师 -->
        <el-form-item>
          <el-select
            v-model="queryInfo.teacherId"
            placeholder="请选择讲师">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
          </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
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
      highlight-current-row
      row-class-name="myClassList">

      <el-table-column
        type="index"
        label="序号"
        width="70"
        align="center">
        <!--        <template slot-scope="scope">-->
        <!--          {{ (num - 1) * limit + scope.$index + 1 }}-->
        <!--        </template>-->
      </el-table-column>

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" :alt="scope.row.title" width="150px">
            </div>
            <div class="title">
              <a href="">{{ scope.row.title }}</a>
              <p>{{ scope.row.lessonNum }}课时</p>
            </div>
          </div>

        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate.substr(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtModified.substr(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="100" align="center" >
        <template slot-scope="scope">
          {{ Number(scope.row.price) === 0 ? '免费' :
          '¥' + scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="buyCount" label="付费学员" width="100" align="center" >
        <template slot-scope="scope">
          {{ scope.row.buyCount }}人
        </template>
      </el-table-column>

      <el-table-column prop="status" label="课程状态" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'Draft' ? 'primary' : 'success'">{{scope.row.status === 'Draft' ? '未发布' : '已发布'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
          <router-link :to="'/edu/course/summary/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页导航区域 @size-change(pagesize改变时触发)
                       @current-change(页码发生改变时触发)
                       :current-page(设置当前页码)
                       :page-size(设置每页的数据条数)
                       :total(设置总页数) -->
    <div class="course-pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="this.num" :page-sizes="[3, 2, 5, 10]" :page-size="size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import course from "@/api/course";
  import teacher from "@/api/teacher";
  import subject from "@/api/subject";

  export default {
    name: "courseList",
    data() {
      return {
        listLoading: true, // 是否显示loading信息
        list: null, // 数据列表
        total: 0, // 总记录数
        num: 1, // 页码
        size: 10, // 每页记录数
        queryInfo: {
          subjectParentId: '',
          subjectId: '',
          title: '',
          teacherId: ''
        }, // 查询条件
        subjectFirstList: [],
        subjectSecondList: [],
        teacherList: []
      }
    },
    created() {
      this.fetchData();
      this.getSubjectList();
      this.getTeacherList();
    },
    methods: {
      subjectFirstChanged(value) {
        const subjects = this.subjectFirstList.filter(item => item.id === value);
        this.subjectSecondList = subjects[0].children;
      },
      //获取课程信息
      async fetchData() {
        this.listLoading = true;
        const { data } = await course.getPageBy(this.num, this.size, this.queryInfo).catch(err => err);
        this.list = data.items;
        this.total = data.total;
        this.listLoading = false;
      },
      async getSubjectList() {
        const { data } = await subject.getList().catch(err => err);
        this.subjectFirstList = data.items;
      },
      async getTeacherList() {
        const { data } = await teacher.getList().catch(err => err);
        this.teacherList = data.item;
      },
      resetData() {
        this.queryInfo = {};
        this.subjectSecondList = [];
        this.fetchData();
      },
      handleSizeChange(newPageSize) {
        //pagesize改变时触发，当pagesize发生改变的时候，我们应该
        //以最新的pagesize来请求数据并展示数据
        this.size = newPageSize;
        this.fetchData();
      },
      handleCurrentChange(current) {
        //页码发生改变时触发当current发生改变的时候，我们应该
        //以最新的current页码来请求数据并展示数据
        this.num = current;
        this.fetchData();
      },
      async deleteById(id) {
        // 弹框询问分类是否删除数据
        const confirmResult = await this.$confirm(
          '此操作将永久删除该分类, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err);
        // 如果分类确认删除，则返回值为字符串 confirm
        // 如果分类取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除');
        }
        const result = await course.deleteById(id).catch(err => err);
        if (result.success) {
          this.$message.success("删除成功！");
          this.fetchData();
        }
      }
    }
  }
</script>

<style scoped>
  .myClassList .info {
    width: 450px;
    overflow: hidden;
  }
  .myClassList .info .pic {
    width: 150px;
    height: 90px;
    overflow: hidden;
    float: left;
  }
  .myClassList .info .pic a {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .myClassList .info .pic img {
    display: block;
    width: 100%;
  }
  .myClassList td .info .title {
    width: 280px;
    float: right;
    height: 90px;
  }
  .myClassList td .info .title a {
    display: block;
    height: 48px;
    line-height: 24px;
    overflow: hidden;
    color: #00baf2;
    margin-bottom: 12px;
  }
  .myClassList td .info .title p {
    line-height: 20px;
    margin-top: 5px;
    color: #818181;
  }
  .course-pagination {
    margin-left: 60%;
    margin-top: 20px
  }

</style>
