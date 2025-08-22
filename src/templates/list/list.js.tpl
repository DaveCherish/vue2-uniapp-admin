<script>
import { ${apiName} } from '@/utils/api';

export default {
  data() {
    return {
      pageTitle: '${pageTitle}',
      moduleName: '${moduleName}',
      listData: [],
      listLoading: false,
      searchParams: {
        ${searchParamsInit}
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true;
      const params = {
        ...this.searchParams,
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };

      ${apiName}.getList(params)
        .then(response => {
          this.listData = response.data.list;
          this.pagination.total = response.data.total;
          this.listLoading = false;
        })
        .catch(error => {
          console.error('获取${moduleName}列表失败:', error);
          this.listLoading = false;
        });
    },

    // 搜索
    handleSearch() {
      this.pagination.currentPage = 1;
      this.getList();
    },

    // 重置搜索
    resetSearch() {
      this.searchParams = {
        ${searchParamsInit}
      };
      this.pagination.currentPage = 1;
      this.getList();
    },

    // 页码改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },

    // 新增
    handleAdd() {
      this.$router.push({ path: '${addPath}' });
    },

    // 编辑
    handleEdit(row) {
      this.$router.push({ path: '${editPath}', query: { id: row.id } });
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确定要删除该${moduleName}吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ${apiName}.delete(row.id)
            .then(() => {
              this.$message({ type: 'success', message: '删除成功' });
              this.getList();
            })
            .catch(error => {
              console.error('删除${moduleName}失败:', error);
              this.$message({ type: 'error', message: '删除失败' });
            });
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });
    }
  }
};
</script>