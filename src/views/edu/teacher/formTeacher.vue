<template>
  <div class="app-container">
    <el-form :model="teacher" label-width="120px" ref="teacherFormRef" :rules="teacherRules">
      <el-form-item label="教师名称" prop="name">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="教师排序" prop="sort">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="1"/>
      </el-form-item>
      <el-form-item label="教师头衔" prop="level">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级教师"/>
          <el-option :value="2" label="首席教师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="教师资历" prop="career">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="教师简介" prop="intro">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 教师头像：TODO -->
      <!-- 教师头像 -->
      <el-form-item label="教师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatarBak"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/admin/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import teacher from '@/api/teacher';
  import ImageCropper from '@/components/ImageCropper';
  import PanThumb from '@/components/PanThumb';

  export default {
    name: 'formTeacher',
    components: {ImageCropper, PanThumb},
    data() {
      const checkTeacher = (rule, value, callback) => {
        teacher.getByName(value).then(resp => {
            callback();
        }).catch(e => {
          callback(new Error('名称重复'));
        });
      };
      return {
        teacherRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur'},
            { min: 2, max: 10, message: '长度在2到10个字符之间', trigger: 'blur'},
            { validator: checkTeacher, trigger: 'blur'}
          ],
        },
        teacher: {
          name: '',
          sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: '',
          avatarBak: ''
        },
        saveBtnDisabled: false, // 保存按钮是否禁用,
        BASE_API: 'http://localhost:8102', // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0 // 上传组件id
      }
    },
    created() {
      // this.$refs.teacherFormRef.resetFields();
    },
    mounted() {
      this.init();
    },
    watch: {
      $route() {
        this.init()
      }
    },
    methods: {
      init() {
        if (this.$route.params && this.$route.params.id) {
          this.getTeacherById(this.$route.params.id);
        } else {
          this.$refs.teacherFormRef.resetFields();
        }
      },
      saveOrUpdate() {
        this.saveBtnDisabled = true
        if (!this.teacher.id) {
          this.saveData()
        } else {
          this.updateTeacher()
        }
      },
      // 保存
      saveData() {
        this.$refs.teacherFormRef.validate(valid => {
          if (!valid) return;
          teacher.saveTeacher(this.teacher).then(resp => {
            this.$message.success('保存成功');
          }).then(resp => {
            this.$router.push('/edu/teacher');
          }).catch(resp => {
            this.$message.error('保存失败');
          })
        });
      },
      //根据Id查询教师赋值回显到页面
      getTeacherById(id) {
        teacher.getById(id).then(resp => {
          this.teacher = resp.data.item;
        }).catch(resp => {
          this.$message.error('获取数据失败')
        })
      },
      //修改教师信息
      updateTeacher() {
        this.$refs.teacherFormRef.validate(valid => {
          if (!valid) return;
          // console.log(this.teacher)
          this.saveBtnDisabled = true
          teacher.update(this.teacher).then(response => {
            return this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }).then(resposne => {
            this.$router.push({ path: '/edu/teacher' })
          }).catch((response) => {
            // console.log(response)
            this.$message({
              type: 'error',
              message: '保存失败'
            })
          })
        });

      },
      // 上传成功后的回调函数
      cropSuccess(data) {
        console.log(data);
        this.imagecropperShow = false;
        this.teacher.avatar = data.item.uploadUrl;
        this.teacher.avatarBak = data.item.myDomain;
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1;
      },

      // 关闭上传组件
      close() {
        this.imagecropperShow = false
        // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      }
    }
  }
</script>

<style scoped>

</style>
