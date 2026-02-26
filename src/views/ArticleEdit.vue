<template>
  <div class="article-edit-page">
    <div class="page-header">
      <h2 class="page-title">{{ isEdit ? '编辑文章' : '创建文章' }}</h2>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="info" @click="handleSave('draft')">保存草稿</el-button>
        <el-button type="primary" @click="handleSave('published')">发布文章</el-button>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="article-form"
    >
      <el-row :gutter="24">
        <el-col :xs="24" :lg="16">
          <el-card>
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入文章标题" />
            </el-form-item>

            <el-form-item label="内容" prop="content">
              <div class="editor-container">
                <Toolbar
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  mode="default"
                  style="border-bottom: 1px solid #dcdfe6"
                />
                <Editor
                  v-model="form.content"
                  :defaultConfig="editorConfig"
                  mode="default"
                  style="height: 400px; overflow-y: hidden"
                  @onCreated="handleCreated"
                />
              </div>
            </el-form-item>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="8">
          <el-card>
            <template #header>
              <span>文章设置</span>
            </template>

            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="选择分类" clearable style="width: 100%">
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="标签" prop="tags">
              <el-input v-model="form.tags" placeholder="用逗号分隔多个标签" />
            </el-form-item>

            <el-form-item label="封面" prop="coverImage">
              <el-upload
                class="cover-uploader"
                :action="uploadAction"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="form.coverImage" :src="form.coverImage" class="cover-preview" />
                <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="摘要" prop="excerpt">
              <el-input
                v-model="form.excerpt"
                type="textarea"
                :rows="4"
                placeholder="文章摘要，不填写将自动提取"
              />
            </el-form-item>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { articleApi, categoryApi } from '@/api'
import type { Article, Category } from '@/api'
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor'

const route = useRoute()
const router = useRouter()

// Editor
const editorRef = shallowRef<IDomEditor>()
const toolbarConfig = {}
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入文章内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/api/upload/image',
      fieldName: 'image',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    },
  },
}

// State
const formRef = ref()
const categories = ref<Category[]>([])
const form = ref<Partial<Article>>({
  title: '',
  content: '',
  excerpt: '',
  categoryId: null,
  tags: '',
  coverImage: '',
  status: 'draft',
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

// Computed
const isEdit = computed(() => !!route.params.id)
const articleId = computed(() => parseInt(route.params.id as string))

const uploadAction = '/api/upload/image'
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
}

// Methods
function handleCreated(editor: IDomEditor) {
  editorRef.value = editor
}

async function fetchCategories() {
  try {
    const response = await categoryApi.getAll()
    if (response.success) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

async function fetchArticle() {
  if (!isEdit.value) return
  
  try {
    const response = await articleApi.getById(articleId.value)
    if (response.success) {
      const article = response.data
      form.value = {
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        categoryId: article.categoryId,
        tags: article.tags || '',
        coverImage: article.coverImage || '',
        status: article.status,
      }
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
    ElMessage.error('获取文章失败')
  }
}

function handleUploadSuccess(response: any) {
  if (response.success) {
    form.value.coverImage = response.data.url
    ElMessage.success('上传成功')
  }
}

function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB')
    return false
  }
  return true
}

async function handleSave(status: 'draft' | 'published') {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    const data = { ...form.value, status }
    
    if (isEdit.value) {
      const response = await articleApi.update(articleId.value, data)
      if (response.success) {
        ElMessage.success('更新成功')
        router.push('/articles')
      }
    } else {
      const response = await articleApi.create(data)
      if (response.success) {
        ElMessage.success('创建成功')
        router.push('/articles')
      }
    }
  } catch (error) {
    // Error handled by interceptor
  }
}

function handleCancel() {
  router.back()
}

onMounted(() => {
  fetchCategories()
  fetchArticle()
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})
</script>

<style scoped lang="scss">
.article-edit-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .editor-container {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    z-index: 1;
  }

  .cover-uploader {
    :deep(.el-upload) {
      border: 1px dashed #dcdfe6;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s;
      width: 100%;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        border-color: #409eff;
      }
    }
  }

  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
  }

  .cover-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
