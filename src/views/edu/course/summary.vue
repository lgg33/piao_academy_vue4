<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-button type="text" @click="dialogChapterFormVisible = true">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chapter-list-ul">
      <li
        v-for="chapter in chapterNestedList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                <el-button type="text" @click="addVideo(chapter.id)">添加课时</el-button>
                <el-button style="" type="text" @click="editChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chapter-list-ul videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                    </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/admin/vod/video/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelVod">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

  import chapter from "@/api/chapter";
  import video from "@/api/video";
  import vod from "@/api/vod";

  export default {
    name: "courseSummary",
    data() {
      return {
        saveBtnDisabled: false,
        courseId: '',
        chapterNestedList: [],
        dialogChapterFormVisible: false, //是否显示章节表单
        chapter: {// 章节对象
          title: '',
          sort: 1
        },
        saveVideoBtnDisabled: false, // 课时按钮是否禁用
        dialogVideoFormVisible: false, // 是否显示课时表单
        chapterId: '', // 课时所在的章节id
        video: {// 课时对象
          title: '',
          sort: 1,
          isFree: false,
          videoSourceId: '',
          videoOriginalName: ''
        },
        fileList: [],//上传文件列表
        BASE_API: process.env.VUE_APP_BASE_API // 接口API地址
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        if (this.$route.params && this.$route.params.id) {
          this.courseId = this.$route.params.id;
          this.fetchData();
        }
      },
      async fetchData() {
        const { data } = await chapter.getNestedChapter(this.courseId);
        this.chapterNestedList = data.items;
        // console.log(data);
      },
      previous() {
        this.$router.push({path: '/edu/course/info/' + this.courseId});
      },
      next() {
        this.$router.push({path: '/edu/course/publish/' + this.courseId})
      },
      saveOrUpdate() {
        this.saveBtnDisabled = true;
        if (!this.chapter.id) {
          this.saveData()
        } else {
          this.updateData()
        }
      },
      async saveData() {
        this.chapter.courseId = this.courseId;
        const result = await chapter.save(this.chapter).catch(err => err);
        if (result.success) {
          this.$message.success("保存成功！")
        }
        this.helpDialog();
      },
      helpDialog() {
        this.dialogChapterFormVisible = false;// 如果保存成功则关闭对话框
        this.fetchData();// 刷新列表
        this.chapter.title = '';// 重置章节标题
        this.chapter.sort = 0;// 重置章节标题
        this.saveBtnDisabled = false;
      },
      async updateData() {
        const result = await chapter.updateById(this.chapter).catch(err => err);
        if (result.success) {
          this.$message.success("修改成功！");
        }
        this.helpDialog();
      },
      async editChapter(chapterId) {
        this.dialogChapterFormVisible = true;
        const { data } = await chapter.getById(chapterId).catch(err => err);
        this.chapter = data.item;
      },
      async deleteChapter(chapterId) {
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
        const result = await chapter.deleteById(chapterId).catch(err => err);
        if (result.success) {
          this.$message.success("删除成功！");
          this.fetchData();
        }
      },
      cancel() {
        this.dialogChapterFormVisible = false;// 如果保存成功则关闭对话框
        this.chapter.title = '';// 重置章节标题
        this.chapter.sort = 1;// 重置章节标题
        this.saveBtnDisabled = false;
      },
      cancelVod() {
        this.dialogVideoFormVisible = false;
        this.video.id = null;
        this.video.title = '';  // 重置章节标题
        this.video.sort = 1;  // 重置章节标题
        this.video.videoSourceId = '';  // 重置视频资源id
        this.video.videoOriginalName = '';
        this.fileList = [];
        this.saveVideoBtnDisabled = false;
      },
      addVideo(id) {
        this.dialogVideoFormVisible = true;
        this.chapterId = id
      },
      //课时管理
      saveOrUpdateVideo() {
        this.saveVideoBtnDisabled = true;
        if (!this.video.id) {
          this.saveDataVideo()
        } else {
          this.updateDataVideo()
        }
      },
      async saveDataVideo() {
        this.video.courseId = this.courseId;
        this.video.chapterId = this.chapterId;
        const result = await video.saveVideo(this.video).catch(err => err);
        if (result.success) {
          this.$message.success("保存成功！");
        }
        this.helpSaveVideo()
      },
      async updateDataVideo() {
        const result = await video.updateById(this.video).catch(err => err);
        if (result.success) {
          this.$message.success("修改成功");
        }
        this.helpSaveVideo();
      },
      helpSaveVideo() {
        this.dialogVideoFormVisible = false;  // 如果保存成功则关闭对话框
        this.fetchData(); // 刷新列表
        this.video.id = null;
        this.video.title = '';  // 重置章节标题
        this.video.sort = 1;  // 重置章节标题
        this.video.videoSourceId = '';  // 重置视频资源id
        this.video.videoOriginalName = '';
        this.fileList = [];
        this.saveVideoBtnDisabled = false;
      },
      async editVideo(id) {
        this.dialogVideoFormVisible = true;
        const { data } = await video.findById(id).catch(err=> err);
        this.video = data.item;
        if (this.video.videoOriginalName !== null) {
          this.fileList = [{'name': this.video.videoOriginalName}]
        }
      },
      async deleteVideo(id) {
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
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除');
        }
        const result = await video.deleteById(id).catch(err => err);
        if (result.success) {
          this.$message.success("删除成功！");
          this.fetchData();
        }
      },
      //视频上传
      //上传成功后回调
      handleVodUploadSuccess(response, file, fileList) {
        this.video.videoSourceId = response.data.item;
        this.video.videoOriginalName = file.name;
        console.log(this.video.videoSourceId)
      },
      async handleVodRemove(file, fileList) {
        const result = await vod.deleteVideoById(this.video.videoSourceId).catch(err => err);
        if (result.success) {
          this.video.videoSourceId = '';
          this.video.videoOriginalName = '';
          this.fileList = [];
          this.$message.success(result.message);
        }
      },
      beforeVodRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      //处理超过一个文件
      handleUploadExceed() {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      }
    }
  }
</script>

<style scoped>

  .chapter-list-ul{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chapter-list-ul li{
    position: relative;
  }
  .chapter-list-ul p{
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }
  .chapter-list-ul .acts {
    float: right;
    font-size: 14px;
  }

  .videoList{
    padding-left: 50px;
  }
  .videoList p{
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }

</style>
