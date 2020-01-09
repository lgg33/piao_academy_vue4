<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="过滤关键词" style="margin-bottom:20px;" />
    <el-button type="text" @click="dialogFormVisible = true">添加一级分类</el-button>
    <el-tree
      ref="subjectTree"
      :data="subjects"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      class="filter-tree"
      default-expand-all
      node-key="id">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level === 1"
            type="text"
            size="mini"
            @click="() => append(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <!--添加对话框-->
    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendSubmit">确 定</el-button>
      </div>
    </el-dialog>


  </div>

</template>

<script>
  import subject from "@/api/subject";

  export default {
    name: 'subjectList',
    data() {
      return {
        //过滤关键字
        filterText: '',
        //分类数据
        subjects: [],
        //绑定属性
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        subject: {
          title: '',
          parentId: ''
        },
        dialogFormVisible: false
      }
    },
    watch: {
      filterText(val) {
        this.$refs.subjectTree.filter(val)
      }
    },
    created() {
      this.fetchNodeList();
    },
    methods: {
      async fetchNodeList() {
        /*subject.getList().then(response => {
          if (response.success === true) {
            this.subjects = response.data.items;
          }
        })*/
        const {data} = await subject.getList();
        this.subjects = data.items;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1
      },
      //添加二级分类打开对话框并赋值
      append(data) {
        this.dialogFormVisible = true;
        this.subject.parentId = data.id;
      },
      appendSubmit() {
        if (!this.subject.parentId) {
          this.appendFirst();
        } else {
          this.appendSecond();
        }
      },
      //添加一级分类
      async appendFirst() {
        const res = await subject.save(this.subject).catch(err => err);
        if (res.success) {
          this.$message.success("添加成功！");
        }
        this.subject.parentId = '';
        this.subject.title = '';
        this.dialogFormVisible = false;
        return this.fetchNodeList();
      },
      //添加二级分类
      async appendSecond() {
        const res = await subject.saveTwo(this.subject).catch(err => err);
        if (res.success) {
          this.$message.success("添加成功！");
        }
        this.subject.parentId = '';
        this.subject.title = '';
        this.dialogFormVisible = false;
        return this.fetchNodeList();
      },
      //删除分类
      async remove(node, data) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该分类，是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const res = await subject.deleteById(data.id).catch(err => err);
        if (res.success) {
          this.$message.success('删除成功！');
          this.$refs.subjectTree.remove(node);
        }
      }
    }
  }
</script>

<style scoped>
  .el-tree {
    width: 170px;
  }
  .custom-tree-node {
    width: 200px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-right: 8px;
  }

</style>
