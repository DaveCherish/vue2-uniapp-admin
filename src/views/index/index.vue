<template>
  <div class="index-container">
    <div class="index-header">
      <h2>欢迎来到后台管理系统</h2>
    </div>

    <div class="index-stats">
      <div class="stat-card">
        <div class="stat-title">今日销售额</div>
        <div class="stat-value">¥12,580</div>
        <div class="stat-change">+12.5% <span class="text-green">较昨日</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-title">总订单数</div>
        <div class="stat-value">286</div>
        <div class="stat-change">+5.2% <span class="text-green">较昨日</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-title">新增用户</div>
        <div class="stat-value">156</div>
        <div class="stat-change">+8.7% <span class="text-green">较昨日</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-title">转化率</div>
        <div class="stat-value">3.25%</div>
        <div class="stat-change">-0.3% <span class="text-red">较昨日</span></div>
      </div>
    </div>

    <div class="index-charts">
      <div class="chart-card">
        <div class="chart-title">最近7天销售额</div>
        <v-chart :options="salesOptions" style="width: 100%; height: 300px;"></v-chart>
      </div>
      <div class="chart-card">
        <div class="chart-title">销售类别占比</div>
        <v-chart :options="categoryOptions" style="width: 100%; height: 300px;"></v-chart>
      </div>
      <div class="chart-card">
        <div class="chart-title">最近30天用户增长</div>
        <v-chart :options="userGrowthOptions" style="width: 100%; height: 300px;"></v-chart>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      // 最近7天销售额图表配置
      salesOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['销售额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '¥{value}'
          }
        },
        series: [
          {
            name: '销售额',
            type: 'bar',
            data: [8200, 9320, 9010, 12000, 11000, 13000, 12580],
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      },

      // 销售类别占比图表配置
      categoryOptions: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '销售类别',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 35,
                name: '电子产品',
                itemStyle: { color: '#409EFF' }
              },
              {
                value: 25,
                name: '服装',
                itemStyle: { color: '#67C23A' }
              },
              {
                value: 20,
                name: '食品',
                itemStyle: { color: '#E6A23C' }
              },
              {
                value: 15,
                name: '图书',
                itemStyle: { color: '#F56C6C' }
              },
              {
                value: 5,
                name: '其他',
                itemStyle: { color: '#909399' }
              }
            ]
          }
        ]
      },

      // 用户增长趋势图表配置
      userGrowthOptions: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增用户', '活跃用户']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Array.from({length: 30}, (_, i) => `5/${i+2}`)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '新增用户',
            type: 'line',
            stack: '总量',
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 50),
            smooth: true,
            itemStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '活跃用户',
            type: 'line',
            stack: '总量',
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 200) + 150),
            smooth: true,
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/variables.scss';

.index-container {
  padding: 20px;
}

.index-header {
  margin-bottom: 20px;
}

.index-header h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 5px;
}

.index-header p {
  color: #909399;
}

.index-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: $card-shadow;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 12px;
}

.text-green {
  color: #67C23A;
}

.text-red {
  color: #F56C6C;
}

.index-charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-card {
  flex: 1;
  min-width: 300px;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: $card-shadow;
}

.chart-title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 15px;
  font-weight: 500;
}
</style>
