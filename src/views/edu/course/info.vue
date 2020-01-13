<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          @change="subjectChange"
          placeholder="请选择">
          <el-option
            v-for="subject in subjectFirstList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择" style="margin-left: 10px">
          <el-option
            v-for="subject in subjectSecondList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <Tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/admin/file/upload?host=cover'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" alt="..." style="width: 500px; height: 300px;">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import course from "@/api/course";
  import subject from "@/api/subject";
  import teacher from "@/api/teacher";
  import Tinymce from  '@/components/Tinymce'

  const defaultForm = {
    title: '',
    subjectId: '',
    teacherId: '',
    lessonNum: 0,
    description: '',
    cover: process.env.VUE_APP_OSS_PATH + '/cover/default.jpg',
    price: 0,
    coverBak: ''
  };

  export default {
    name: "info",
    components: { Tinymce },
    data() {
      return {
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseInfo: defaultForm,
        subjectFirstList: [],
        subjectSecondList: [],
        teacherList: [],
        BASE_API: 'http://localhost:8102',
      }
    },

    created() {
      this.init();
    },

    methods: {
      next() {
        console.log('next');
        // this.$router.push({ path: '/edu/course/summary/1' })
        if (!this.courseInfo.id) {
          this.save();
        } else{
          this.edit();
        }
      },
      init() {
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id;
          this.getCourseInfoById(id);
        } else {
          this.courseInfo = {...defaultForm};
          this.getSubjectList();
          this.getTeacherList();
        }
      },
      //保存数据
      async save() {
        const result = await course.saveCourseInfo(this.courseInfo).catch(err => err);
        if (result.success) {
          this.$message.success("保存成功");
          await this.$router.push({path: '/edu/course/summary/' + result.data.item})
        }
      },
      //修改数据
      async edit() {
        const result = await course.updateById(this.courseInfo).catch(err => err);
        if (result.success) {
          this.$message.success("修改成功");
          await this.$router.push({path: "/edu/course/summary/" + result.data.item})
        }
      },
      //获取分类嵌套数据
      async getSubjectList() {
        const result = await subject.getList().catch(err => err);
        // if (!result.success) {
        //   return this.$message.error("查询课程分类失败！");
        // }
        this.subjectFirstList = result.data.items;
      },
      //change事件，获取级联分类
      subjectChange(value) {
        const subjectFirst = this.subjectFirstList.filter(val => val.id === value);
        // console.log(subjectFirst);
        this.subjectSecondList = subjectFirst[0].children;
        this.courseInfo.subjectId = '';
      },
      //获取教师数据
      async getTeacherList() {
        const result = await teacher.getList();
        this.teacherList = result.data.item;
      },
      handleAvatarSuccess(res, file) {
        console.log(res);// 上传响应
        // console.log(URL.createObjectURL(file.raw));// base64编码
        this.courseInfo.coverBak = res.data.item.myDomain;
        console.log(this.courseInfo.coverBak);
        this.courseInfo.cover = res.data.item.uploadUrl;
      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      async getCourseInfoById(id) {
        const { data } = await course.getById(id).catch(err => err);
        this.courseInfo = data.item;
        const result = await subject.getList().catch(err => err);
        this.subjectFirstList = result.data.items;
        const subjectFirst = this.subjectFirstList.filter(item => item.id === this.courseInfo.subjectParentId);
        this.subjectSecondList = subjectFirst[0].children;
        this.getTeacherList();
      }
    }
  }
</script>

<style scoped>

</style>
