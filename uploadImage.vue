上传格式base64
<el-upload
  class="logo-uploader"
  action="''"
  :show-file-list="false"
  :on-change="upload"
  :before-upload="beforeLogoUpload"
>
  <img
    v-if="logo"
    :src="logo"
    class="logo"
  >
  <i
    v-else
    class="el-icon-plus logo-uploader-icon"
  />
</el-upload>

js部分
upload(file) {
  const reader = new FileReader();
  const img = new Image();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 200;
  canvas.height = 200;
  reader.readAsDataURL(file.raw);
  const that = this;
  reader.onload = (e) => {
    img.src = e.target.result;
    console.log('aaaa', img);
    context.drawImage(img, 0, 0, 200, 200);
    const image = canvas.toDataURL('image/jpeg', 0.9);
    if (this.isUploadSuccess) {
      that.logo = image;
    } else {
      that.logo = '';
    }
  };
  },
  beforeLogoUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  const isLt1M = file.size / 1024 / 1024 < 1;

  if (!isJPG) {
    this.$message.error('上传头像图片只能是 JPG 格式!');
  }
  if (!isLt1M) {
    this.$message.error('上传头像图片大小不能超过 1MB!');
  }
  console.log(111);
  this.isUploadSuccess = isJPG && isLt1M;
  return isJPG && isLt1M;
 },
