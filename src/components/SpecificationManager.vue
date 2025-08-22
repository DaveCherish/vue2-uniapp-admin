<template>
    <div class="spec-container">
        <div class="spec-header">
            <el-button type="primary" size="small" @click="addSpec">添加规格</el-button>
        </div>

        <!-- 规格列表 -->
        <div v-for="(spec, specIndex) in specs" :key="'spec-' + specIndex" class="spec-item">
            <div class="spec-row">
                <el-input v-model="spec.name" placeholder="规格名称，如颜色、尺寸" class="spec-name"
                    @change="handleSpecNameChange" />
                <el-button type="danger" size="small" icon="el-icon-delete" circle
                    @click="removeSpec(specIndex)"></el-button>
            </div>

            <!-- 规格值列表 -->
            <div class="spec-values">
                <el-tag v-for="(value, valueIndex) in spec.values" :key="'value-' + valueIndex" closable
                    @close="removeSpecValue(specIndex, valueIndex)" class="spec-value-tag">
                    {{ value }}
                </el-tag>

                <el-input v-model="spec.inputValue" size="small" class="spec-value-input" placeholder="请输入规格值"
                    @keyup.enter="confirmSpecValue(specIndex)" />
                <el-button size="small" class="button-new-tag" @click="confirmSpecValue(specIndex)">+ 添加规格值</el-button>
            </div>
        </div>

        <!-- 规格组合表格 -->
        <div v-if="combinations.length > 0" class="combinations-table">
            <h3>规格组合</h3>
            <el-table :data="combinations" border style="width: 100%">
                <el-table-column v-for="spec in specs" :key="spec.name" :prop="spec.name" :label="spec.name"
                    width="100" />
                <el-table-column label="价格" width="160">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.price" :min="0" :precision="2" :step="0.1" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="库存" width="160">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.stock" :min="0" :precision="0" :step="1" size="small" />
                    </template>
                </el-table-column>

                <el-table-column label="图片" width="110">
                    <template slot-scope="scope">
                        <el-upload class="combination-image-upload" action="" :show-file-list="false"
                            :on-change="(file) => handleCombinationImageChange(file, scope.$index)" :auto-upload="false"
                            accept="image/*">
                            <img v-if="scope.row.image" :src="scope.row.image" class="combination-image">
                            <i v-else class="el-icon-plus combination-image-uploader-icon"></i>
                        </el-upload>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SpecificationManager',
    props: {
        // 接收规格数据
        value: {
            type: Object,
            default: () => ({
                specs: [],
                combinations: []
            })
        }
    },
    data() {
        return {
            // 内部状态，基于props.value初始化
            specs: [...this.value.specs],
            combinations: [...this.value.combinations],
            // 添加防抖计时器
            debounceTimer: null
        }
    },
    watch: {
        // 监听外部传入的value变化
        value: {
            deep: true,
            handler(newVal) {
                this.specs = [...newVal.specs]
                this.combinations = [...newVal.combinations]
            }
        },
        // 监听内部specs和combinations变化，同步到父组件
        specs: {
            deep: true,
            handler() {
                this.debounceEmit()
            }
        },
        combinations: {
            deep: true,
            handler() {
                this.debounceEmit()
            }
        }
    },

    computed: {
        // 判断是否可以生成规格组合
        canGenerateCombinations() {
            return this.specs.length > 0 &&
                this.specs.every(spec => spec.name && spec.values.length > 0);
        }
    },
    methods: {
        debounceEmit() {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer)
            }
            this.debounceTimer = setTimeout(() => {
                this.$emit('input', {
                    specs: [...this.specs],
                    combinations: [...this.combinations]
                })
            }, 300)
        },

        // 添加规格
        addSpec() {
            this.specs.push({
                name: '',
                values: [],
                inputValue: ''
            })
        },

        // 删除规格
        removeSpec(index) {
            this.$confirm('确定删除该规格吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.specs.splice(index, 1)
                // 删除规格后，清空组合并重新生成
                this.combinations = []
                this.generateCombinations()
            }).catch(() => { })
        },

        // 删除规格值后重新生成组合,

        // 确认添加规格值
        confirmSpecValue(specIndex) {
            const spec = this.specs[specIndex]
            const inputValue = spec.inputValue && spec.inputValue.trim()
            if (inputValue) {
                // 检查是否重复
                if (!spec.values.includes(inputValue)) {
                    spec.values.push(inputValue)
                } else {
                    this.$message.warning('该规格值已存在')
                }
            }
            spec.inputValue = ''
            // 自动生成组合
            this.generateCombinations()
        },

        // 删除规格值
        removeSpecValue(specIndex, valueIndex) {
            this.specs[specIndex].values.splice(valueIndex, 1)
            // 删除规格值后，清空组合并重新生成
            this.combinations = []
            this.generateCombinations()
        },

        // 处理规格名称变更
        handleSpecNameChange() {
            // 规格名称变更后，清空组合
            this.combinations = []
        },

        // 生成规格组合
        generateCombinations() {
            if (!this.canGenerateCombinations) return

            // 性能优化：使用requestAnimationFrame避免UI阻塞
            window.requestAnimationFrame(() => {
                // 获取所有规格的值数组
                const specValues = this.specs.map(spec => {
                    return spec.values.map(value => ({
                        [spec.name]: value
                    }))
                })

                // 使用笛卡尔积算法生成所有组合
                const cartesian = (...arrays) => {
                    return arrays.reduce((acc, curr) => {
                        return acc.flatMap(combo => {
                            return curr.map(item => {
                                return { ...combo, ...item }
                            })
                        })
                    }, [{}])
                }

                // 生成组合
                const combinations = cartesian(...specValues)
                // 增量合并组合，保留原有已填写数据
                const oldCombinations = this.combinations || []
                const newCombinations = []
                combinations.forEach(combo => {
                    // 查找是否已存在相同组合
                    const existingCombo = oldCombinations.find(existing => {
                        return this.specs.every(spec => {
                            return existing[spec.name] === combo[spec.name]
                        })
                    })
                    if (existingCombo) {
                        // 保留已有数据
                        newCombinations.push({ ...combo, ...existingCombo })
                    } else {
                        // 创建新数据
                        newCombinations.push({
                            ...combo,
                            price: 0,
                            stock: 0,
                            image: ''
                        })
                    }
                })
                this.combinations = newCombinations
            })
        },

        // 处理组合图片上传
        handleCombinationImageChange(file, index) {
            if (file && file.raw) {
                // 创建临时URL用于预览
                this.combinations[index].image = URL.createObjectURL(file.raw)
            }
        }
    }
}
</script>

<style lang="scss">
.spec-container {
    margin-bottom: 20px;

    .spec-header {
        display: flex;
        margin-bottom: 15px;
        gap: 10px;
    }

    .spec-item {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

        .spec-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .spec-name {
                flex: 1;
                margin-right: 10px;
            }
        }

        .spec-values {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;

            .spec-value-tag {
                margin-right: 0;
            }

            .spec-value-input {
                width: 100px;
                margin-right: 8px;
                vertical-align: bottom;
            }
        }
    }

    .combinations-table {
        margin-top: 20px;

        h3 {
            margin-bottom: 15px;
            font-weight: 500;
            color: #303133;
        }

        .combination-image-upload {
            .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                width: 80px;
                height: 80px;
                display: flex;
                justify-content: center;
                align-items: center;

                &:hover {
                    border-color: #409EFF;
                }

                .combination-image {
                    width: 80px;
                    height: 80px;
                    display: block;
                    object-fit: cover;
                }

                .combination-image-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 80px;
                    height: 80px;
                    line-height: 80px;
                    text-align: center;
                }
            }
        }
    }
}
</style>