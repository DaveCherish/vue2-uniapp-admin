<template>
  <div class="list-page">
    <el-card>

      <!-- 使用排序组件 -->
      <SortableList
        :visible.sync="sortDialogVisible"
        title="一级菜单排序"
        width="600px"
        :data-source="firstLevelMenus"
        @confirm="handleSortConfirm"
      />


      <div slot="header" class="clearfix">
        <span>菜单管理</span>
        <div class="header-buttons">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
            新增
          </el-button>
          <el-button type="default" size="small" icon="el-icon-sort" @click="handleSort">
            排序
          </el-button>
        </div>
      </div>

      <div class="menu-container">
        <!-- 移除自定义 default-expand-icon 的 slot，交给数据与 CSS 控制 -->
        <el-tree :data="menuTreeData" :props="defaultProps" node-key="id" default-expand-all class="menu-tree">
          <!-- 节点内容 -->
          <template slot-scope="{ node, data }">
            <div class="tree-node-content">
              <span class="node-label">
                <i class="node-icon el-icon-menu"></i>
                {{ node.label }}
              </span>
              <span class="node-status">
                <el-switch v-model="switchStatus[data.id]" active-color="#13ce66" inactive-color="#909399"
                  style="margin-right: 48px" @change="handleStatusChange(data, $event)" :disabled="!data.id"
                  active-text="启用" inactive-text="禁用" @click.native.stop></el-switch>
              </span>
              <span class="node-is-show">
                <el-switch v-model="isShow[data.id]" active-color="#4096ff" inactive-color="#909399"
                  style="margin-right: 48px" @change="handleIsShowChange(data, $event)" :disabled="!data.id"
                  active-text="显示" inactive-text="隐藏" @click.native.stop></el-switch>
              </span>
              <span class="tree-node-operations">
                <el-button type="warning" size="mini" @click.stop="handleAddSubMenu(data)">新增子菜单</el-button>
                <el-button type="primary" size="mini" @click.stop="handleEdit(data)">编辑</el-button>
                <el-button type="danger" size="mini" @click.stop="handleDelete(data)">删除</el-button>
              </span>
            </div>
          </template>
        </el-tree>

      </div>
    </el-card>

    <!-- 新增/编辑菜单弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="menuForm" :rules="menuRules" ref="menuForm" label-width="100px">
        <el-form-item v-if="menuForm.pid" label="父级菜单" prop="parentName">
          <el-input v-model="menuForm.parentName" placeholder="父级菜单" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="url">
          <el-input v-model="menuForm.url" placeholder="请输入路由路径"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入图标类名，如 el-icon-setting"></el-input>
          <div class="icon-tips">
            <span class="tips-desc">点击图标可快速选择，或直接输入图标类名</span>
            <div class="icon-list">
              <span class="icon-item" @click="selectIcon('el-icon-question')"><i class="el-icon-question"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-platform-eleme')"><i
                  class="el-icon-platform-eleme"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-eleme')"><i class="el-icon-eleme"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-delete-solid')"><i
                  class="el-icon-delete-solid"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-delete')"><i class="el-icon-delete"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-tools')"><i class="el-icon-s-tools"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-setting')"><i class="el-icon-setting"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-user-solid')"><i
                  class="el-icon-user-solid"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-user')"><i class="el-icon-user"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-phone')"><i class="el-icon-phone"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-phone-outline')"><i
                  class="el-icon-phone-outline"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-more')"><i class="el-icon-more"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-more-outline')"><i
                  class="el-icon-more-outline"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-star-on')"><i class="el-icon-star-on"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-star-off')"><i class="el-icon-star-off"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-goods')"><i class="el-icon-s-goods"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-goods')"><i class="el-icon-goods"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-warning')"><i class="el-icon-warning"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-warning-outline')"><i
                  class="el-icon-warning-outline"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-question')"><i class="el-icon-question"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-info')"><i class="el-icon-info"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-remove')"><i class="el-icon-remove"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-circle-plus')"><i
                  class="el-icon-circle-plus"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-success')"><i class="el-icon-success"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-error')"><i class="el-icon-error"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-zoom-in')"><i class="el-icon-zoom-in"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-zoom-out')"><i class="el-icon-zoom-out"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-remove-outline')"><i
                  class="el-icon-remove-outline"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-circle-plus-outline')"><i
                  class="el-icon-circle-plus-outline"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-circle-check')"><i
                  class="el-icon-circle-check"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-circle-close')"><i
                  class="el-icon-circle-close"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-help')"><i class="el-icon-s-help"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-help')"><i class="el-icon-help"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-minus')"><i class="el-icon-minus"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-plus')"><i class="el-icon-plus"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-check')"><i class="el-icon-check"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-close')"><i class="el-icon-close"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-picture')"><i class="el-icon-picture"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-picture-outline')"><i
                  class="el-icon-picture-outline"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-picture-outline-round')"><i
                  class="el-icon-picture-outline-round"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-upload')"><i class="el-icon-upload"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-upload2')"><i class="el-icon-upload2"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-download')"><i class="el-icon-download"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-camera-solid')"><i
                  class="el-icon-camera-solid"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-camera')"><i class="el-icon-camera"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-video-camera-solid')"><i
                  class="el-icon-video-camera-solid"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-video-camera')"><i
                  class="el-icon-video-camera"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-message-solid')"><i
                  class="el-icon-message-solid"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-bell')"><i class="el-icon-bell"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-cooperation')"><i
                  class="el-icon-s-cooperation"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-order')"><i class="el-icon-s-order"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-platform')"><i
                  class="el-icon-s-platform"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-fold')"><i class="el-icon-s-fold"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-unfold')"><i class="el-icon-s-unfold"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-operation')"><i
                  class="el-icon-s-operation"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-promotion')"><i
                  class="el-icon-s-promotion"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-home')"><i class="el-icon-s-home"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-release')"><i class="el-icon-s-release"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-ticket')"><i class="el-icon-s-ticket"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-management')"><i
                  class="el-icon-s-management"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-open')"><i class="el-icon-s-open"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-shop')"><i class="el-icon-s-shop"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-marketing')"><i
                  class="el-icon-s-marketing"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-flag')"><i class="el-icon-s-flag"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-comment')"><i class="el-icon-s-comment"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-finance')"><i class="el-icon-s-finance"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-claim')"><i class="el-icon-s-claim"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-custom')"><i class="el-icon-s-custom"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-opportunity')"><i
                  class="el-icon-s-opportunity"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-data')"><i class="el-icon-s-data"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-check')"><i class="el-icon-s-check"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-s-grid')"><i class="el-icon-s-grid"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-menu')"><i class="el-icon-menu"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-share')"><i class="el-icon-share"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-d-caret')"><i class="el-icon-d-caret"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-caret-left')"><i
                  class="el-icon-caret-left"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-caret-right')"><i
                  class="el-icon-caret-right"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-caret-bottom')"><i
                  class="el-icon-caret-bottom"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-caret-top')"><i class="el-icon-caret-top"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-bottom-left')"><i
                  class="el-icon-bottom-left"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-bottom-right')"><i
                  class="el-icon-bottom-right"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-back')"><i class="el-icon-back"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-right')"><i class="el-icon-right"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-bottom')"><i class="el-icon-bottom"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-top')"><i class="el-icon-top"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-top-left')"><i class="el-icon-top-left"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-top-right')"><i class="el-icon-top-right"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-arrow-left')"><i
                  class="el-icon-arrow-left"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-arrow-right')"><i
                  class="el-icon-arrow-right"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-arrow-down')"><i
                  class="el-icon-arrow-down"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-arrow-up')"><i class="el-icon-arrow-up"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-d-arrow-left')"><i
                  class="el-icon-d-arrow-left"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-d-arrow-right')"><i
                  class="el-icon-d-arrow-right"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-video-pause')"><i
                  class="el-icon-video-pause"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-video-play')"><i
                  class="el-icon-video-play"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-refresh')"><i class="el-icon-refresh"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-refresh-right')"><i
                  class="el-icon-refresh-right"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-refresh-left')"><i
                  class="el-icon-refresh-left"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-finished')"><i class="el-icon-finished"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sort')"><i class="el-icon-sort"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sort-up')"><i class="el-icon-sort-up"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sort-down')"><i class="el-icon-sort-down"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-rank')"><i class="el-icon-rank"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-loading')"><i class="el-icon-loading"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-view')"><i class="el-icon-view"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-c-scale-to-original')"><i
                  class="el-icon-c-scale-to-original"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-date')"><i class="el-icon-date"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-edit')"><i class="el-icon-edit"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-edit-outline')"><i
                  class="el-icon-edit-outline"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-folder')"><i class="el-icon-folder"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-folder-opened')"><i
                  class="el-icon-folder-opened"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-folder-add')"><i
                  class="el-icon-folder-add"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-folder-remove')"><i
                  class="el-icon-folder-remove"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-folder-delete')"><i
                  class="el-icon-folder-delete"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-folder-checked')"><i
                  class="el-icon-folder-checked"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-tickets')"><i class="el-icon-tickets"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-document-remove')"><i
                  class="el-icon-document-remove"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-document-delete')"><i
                  class="el-icon-document-delete"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-document-copy')"><i
                  class="el-icon-document-copy"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-document-checked')"><i
                  class="el-icon-document-checked"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-document')"><i class="el-icon-document"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-document-add')"><i
                  class="el-icon-document-add"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-printer')"><i class="el-icon-printer"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-paperclip')"><i class="el-icon-paperclip"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-takeaway-box')"><i
                  class="el-icon-takeaway-box"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-search')"><i class="el-icon-search"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-monitor')"><i class="el-icon-monitor"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-attract')"><i class="el-icon-attract"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-mobile')"><i class="el-icon-mobile"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-scissors')"><i class="el-icon-scissors"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-umbrella')"><i class="el-icon-umbrella"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-headset')"><i class="el-icon-headset"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-brush')"><i class="el-icon-brush"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-mouse')"><i class="el-icon-mouse"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-coordinate')"><i
                  class="el-icon-coordinate"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-magic-stick')"><i
                  class="el-icon-magic-stick"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-reading')"><i class="el-icon-reading"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-data-line')"><i class="el-icon-data-line"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-data-board')"><i
                  class="el-icon-data-board"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-pie-chart')"><i class="el-icon-pie-chart"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-data-analysis')"><i
                  class="el-icon-data-analysis"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-collection-tag')"><i
                  class="el-icon-collection-tag"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-film')"><i class="el-icon-film"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-suitcase')"><i class="el-icon-suitcase"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-suitcase-1')"><i
                  class="el-icon-suitcase-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-receiving')"><i class="el-icon-receiving"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-collection')"><i
                  class="el-icon-collection"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-files')"><i class="el-icon-files"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-notebook-1')"><i
                  class="el-icon-notebook-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-notebook-2')"><i
                  class="el-icon-notebook-2"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-toilet-paper')"><i
                  class="el-icon-toilet-paper"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-office-building')"><i
                  class="el-icon-office-building"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-school')"><i class="el-icon-school"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-table-lamp')"><i
                  class="el-icon-table-lamp"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-house')"><i class="el-icon-house"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-no-smoking')"><i
                  class="el-icon-no-smoking"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-smoking')"><i class="el-icon-smoking"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-shopping-cart-full')"><i
                  class="el-icon-shopping-cart-full"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-shopping-cart-1')"><i
                  class="el-icon-shopping-cart-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-shopping-cart-2')"><i
                  class="el-icon-shopping-cart-2"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-shopping-bag-1')"><i
                  class="el-icon-shopping-bag-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-shopping-bag-2')"><i
                  class="el-icon-shopping-bag-2"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sold-out')"><i class="el-icon-sold-out"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sell')"><i class="el-icon-sell"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-present')"><i class="el-icon-present"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-box')"><i class="el-icon-box"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-bank-card')"><i class="el-icon-bank-card"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-money')"><i class="el-icon-money"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-coin')"><i class="el-icon-coin"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-wallet')"><i class="el-icon-wallet"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-discount')"><i class="el-icon-discount"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-price-tag')"><i class="el-icon-price-tag"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-news')"><i class="el-icon-news"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-guide')"><i class="el-icon-guide"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-male')"><i class="el-icon-male"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-female')"><i class="el-icon-female"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-thumb')"><i class="el-icon-thumb"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-cpu')"><i class="el-icon-cpu"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-link')"><i class="el-icon-link"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-connection')"><i
                  class="el-icon-connection"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-open')"><i class="el-icon-open"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-turn-off')"><i class="el-icon-turn-off"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-set-up')"><i class="el-icon-set-up"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-chat-round')"><i
                  class="el-icon-chat-round"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-chat-line-round')"><i
                  class="el-icon-chat-line-round"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-chat-square')"><i
                  class="el-icon-chat-square"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-chat-dot-round')"><i
                  class="el-icon-chat-dot-round"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-chat-dot-square')"><i
                  class="el-icon-chat-dot-square"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-chat-line-square')"><i
                  class="el-icon-chat-line-square"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-message')"><i class="el-icon-message"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-postcard')"><i class="el-icon-postcard"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-position')"><i class="el-icon-position"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-turn-off-microphone')"><i
                  class="el-icon-turn-off-microphone"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-microphone')"><i
                  class="el-icon-microphone"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-close-notification')"><i
                  class="el-icon-close-notification"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-bangzhu')"><i class="el-icon-bangzhu"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-time')"><i class="el-icon-time"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-odometer')"><i class="el-icon-odometer"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-crop')"><i class="el-icon-crop"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-aim')"><i class="el-icon-aim"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-switch-button')"><i
                  class="el-icon-switch-button"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-full-screen')"><i
                  class="el-icon-full-screen"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-copy-document')"><i
                  class="el-icon-copy-document"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-mic')"><i class="el-icon-mic"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-stopwatch')"><i class="el-icon-stopwatch"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-medal-1')"><i class="el-icon-medal-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-medal')"><i class="el-icon-medal"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-trophy')"><i class="el-icon-trophy"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-trophy-1')"><i class="el-icon-trophy-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-first-aid-kit')"><i
                  class="el-icon-first-aid-kit"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-discover')"><i class="el-icon-discover"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-place')"><i class="el-icon-place"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-location')"><i class="el-icon-location"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-location-outline')"><i
                  class="el-icon-location-outline"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-location-information')"><i
                  class="el-icon-location-information"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-add-location')"><i
                  class="el-icon-add-location"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-delete-location')"><i
                  class="el-icon-delete-location"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-map-location')"><i
                  class="el-icon-map-location"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-alarm-clock')"><i
                  class="el-icon-alarm-clock"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-timer')"><i class="el-icon-timer"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-watch-1')"><i class="el-icon-watch-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-watch')"><i class="el-icon-watch"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-lock')"><i class="el-icon-lock"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-unlock')"><i class="el-icon-unlock"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-key')"><i class="el-icon-key"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-service')"><i class="el-icon-service"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-mobile-phone')"><i
                  class="el-icon-mobile-phone"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-bicycle')"><i class="el-icon-bicycle"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-truck')"><i class="el-icon-truck"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-ship')"><i class="el-icon-ship"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-basketball')"><i
                  class="el-icon-basketball"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-football')"><i class="el-icon-football"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-soccer')"><i class="el-icon-soccer"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-baseball')"><i class="el-icon-baseball"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-wind-power')"><i
                  class="el-icon-wind-power"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-light-rain')"><i
                  class="el-icon-light-rain"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-lightning')"><i class="el-icon-lightning"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-heavy-rain')"><i
                  class="el-icon-heavy-rain"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sunrise')"><i class="el-icon-sunrise"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sunrise-1')"><i class="el-icon-sunrise-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sunset')"><i class="el-icon-sunset"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sunny')"><i class="el-icon-sunny"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-cloudy')"><i class="el-icon-cloudy"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-partly-cloudy')"><i
                  class="el-icon-partly-cloudy"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-cloudy-and-sunny')"><i
                  class="el-icon-cloudy-and-sunny"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-moon')"><i class="el-icon-moon"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-moon-night')"><i
                  class="el-icon-moon-night"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-dish')"><i class="el-icon-dish"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-dish-1')"><i class="el-icon-dish-1"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-food')"><i class="el-icon-food"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-chicken')"><i class="el-icon-chicken"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-fork-spoon')"><i
                  class="el-icon-fork-spoon"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-knife-fork')"><i
                  class="el-icon-knife-fork"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-burger')"><i class="el-icon-burger"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-tableware')"><i class="el-icon-tableware"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-sugar')"><i class="el-icon-sugar"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-dessert')"><i class="el-icon-dessert"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-ice-cream')"><i class="el-icon-ice-cream"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-hot-water')"><i class="el-icon-hot-water"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-water-cup')"><i class="el-icon-water-cup"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-coffee-cup')"><i
                  class="el-icon-coffee-cup"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-cold-drink')"><i
                  class="el-icon-cold-drink"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-goblet')"><i class="el-icon-goblet"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-goblet-full')"><i
                  class="el-icon-goblet-full"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-goblet-square')"><i
                  class="el-icon-goblet-square"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-goblet-square-full')"><i
                  class="el-icon-goblet-square-full"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-refrigerator')"><i
                  class="el-icon-refrigerator"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-grape')"><i class="el-icon-grape"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-watermelon')"><i
                  class="el-icon-watermelon"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-cherry')"><i class="el-icon-cherry"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-apple')"><i class="el-icon-apple"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-pear')"><i class="el-icon-pear"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-orange')"><i class="el-icon-orange"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-coffee')"><i class="el-icon-coffee"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-ice-tea')"><i class="el-icon-ice-tea"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-ice-drink')"><i class="el-icon-ice-drink"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-milk-tea')"><i class="el-icon-milk-tea"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-potato-strips')"><i
                  class="el-icon-potato-strips"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-lollipop')"><i class="el-icon-lollipop"></i></span>
              <span class="icon-item" @click="selectIcon('el-icon-ice-cream-square')"><i
                  class="el-icon-ice-cream-square"></i></span>
            </div>

          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="menuForm.sort" placeholder="请输入排序号"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="menuForm.is_show" active-color="#4096ff" inactive-color="#909399"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/api'
import SortableList from '@/components/SortableList.vue'
export default {
  components: {
    SortableList
  },
  data() {
    return {
      switchStatus: {},
      isShow: {},

      sortDialogVisible: false,
      firstLevelMenus: [],
      menuList: [],
      dialogVisible: false,
      dialogTitle: '新增菜单',
      menuForm: {
        id: '',
        name: '',
        url: '',
        icon: '',
        sort: 0,
        is_show: true,
        pid: 0,
        parentName: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        sort: [
          { required: true, message: '请输入排序号', trigger: 'blur' },
          { type: 'number', message: '排序号必须为数字', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.fetchMenuList();
  },
  computed: {
    menuTreeData() {
      return this.buildMenuTree(this.menuList);
    }
  },
  methods: {
    // 处理排序确认
    handleSortConfirm(sortedList) {
      // 调用排序接口
      api.post('/Admin/menu/sort', { list: sortedList })
        .then(res => {
          if (res.result === 1) {
            this.$message({ type: 'success', message: res.msg });
            // 刷新菜单列表
            this.fetchMenuList();
          } else {
            this.$message({ type: 'error', message: res.msg });
          }
        })
        .catch(error => {
          this.$message({ type: 'error', message: '排序出错，请重试' });
        });
    },

    fetchMenuList() {
      api.get('/Admin/menu/getList')
        .then(data => {
          if (data.result === 1) {
            // 保存原始数据，包含level
            this.menuList = data.data.map(item => ({
              id: item.id,
              name: item.name,
              url: item.url,
              icon: item.icon || '',
              sort: item.sort,
              status: item.status === 1, // 0表示禁用，1表示启用
              is_show: item.is_show === 1, // 0表示隐藏，1表示显示
              pid: item.pid,
              level: item.level || 1, // 从API获取level，如果没有则默认为1
              parentName: '' // 初始化父级菜单名称字段
            }));
            
            // 为每个菜单项设置父级菜单名称
            this.menuList.forEach(item => {
              if (item.pid !== 0) {
                const parentItem = this.menuList.find(parent => parent.id === item.pid);
                if (parentItem) {
                  item.parentName = parentItem.name;
                }
              }
              this.$set(this.switchStatus, item.id, item.status);
              this.$set(this.isShow, item.id, item.is_show);
            });

          } else {
            this.$message.error('获取菜单数据失败: ' + response.data.msg);
          }
        })
        .catch(error => {
          console.error('获取菜单数据出错:', error);
          this.$message.error('获取菜单数据出错，请重试');
        });
    },
    handleAdd() {
      this.dialogTitle = '新增菜单';
      this.menuForm = {
        id: '',
        name: '',
        url: '',
        icon: '',
        sort: 0,
        status: true,
        is_show: true,
        pid: 0,
        level: 1 // 新增顶级菜单默认为level 1
      };
      this.dialogVisible = true;
    },
    // 选择图标
    selectIcon(iconName) {
      this.menuForm.icon = iconName;
      this.$message({ type: 'success', message: '已选择图标: ' + iconName });
    },
    handleEdit(row) {
      this.dialogTitle = '编辑菜单';
      this.menuForm = { ...row };
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('确定要删除菜单 ' + row.name + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除菜单API接口
        api.post('/Admin/menu/delete', { id: row.id })
          .then(res => {
            if (res.result === 1) {
              this.$message({ type: 'success', message: res.msg });
              // 刷新菜单列表
              this.fetchMenuList();
            } else {
              this.$message({ type: 'error', message: res.msg });
            }
          })
          .catch(error => {
            this.$message({ type: 'error', message: '删除数据出错，请重试' });
          });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    handleSubmit() {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          // 准备提交数据
          const submitData = {
            id: this.menuForm.id || 0,
            name: this.menuForm.name,
            url: this.menuForm.url,
            icon: this.menuForm.icon,
            sort: this.menuForm.sort,
            status: Number(this.menuForm.status),
            is_show: Number(this.menuForm.is_show),
            pid: this.menuForm.pid,
            level: this.menuForm.level
          };

          // 使用POST请求并设置合适的请求头
          api.post('/Admin/menu/addOrEdit', submitData)
            .then(res => {
              if (res.result === 1) {
                this.dialogVisible = false;
                this.$message({ type: 'success', message: res.msg });
                // 刷新菜单列表
                this.fetchMenuList();
              } else {
                this.$message({ type: 'error', message: res.msg });
              }
            })
            .catch(error => {
              this.$message({ type: 'error', message: '提交数据出错，请重试' });
            });
        }
      });
    },
    handleStatusChange(data, value) {
      const index = this.menuList.findIndex(item => item.id === data.id);
      if (index !== -1) {
        api.get('/Admin/menu/doStatus', { id: data.id, status: Number(value) }).then(res => {
          if (res.result === 1) {
            this.menuList[index].status = value;
            this.$set(this.switchStatus, data.id, value);
            this.$message({ type: 'success', message: res.msg });
          } else {
            this.$message({ type: 'error', message: res.msg });
          }
        })
      } else {
        this.$message({ type: 'error', message: res.msg });
      }
    },

    handleIsShowChange(data, value) {
      const index = this.menuList.findIndex(item => item.id === data.id);
      if (index !== -1) {
        api.get('/Admin/menu/doIsShow', { id: data.id, is_show: Number(value) }).then(res => {
          if (res.result === 1) {
            this.menuList[index].is_show = value;
            this.$set(this.isShow, data.id, value);
            this.$message({ type: 'success', message: res.msg });
          } else {
            this.$message({ type: 'error', message: res.msg });
          }
        })
      } else {
        this.$message({ type: 'error', message: res.msg });
      }
    },

    // —— 关键：构建树并移除空 children，避免叶子节点被识别成“父节点” —— //
    buildMenuTree(menuList) {
      const tree = [];
      const map = {};

      menuList.forEach(item => {
        map[item.id] = { ...item }; // 不先加 children
      });

      menuList.forEach(item => {
        if (item.pid === 0) {
          tree.push(map[item.id]);
        } else if (map[item.pid]) {
          if (!map[item.pid].children) map[item.pid].children = [];
          map[item.pid].children.push(map[item.id]);
        }
      });

      // 递归移除空 children，确保真正的叶子没有 children 字段
      const prune = (nodes) => {
        nodes.forEach(n => {
          if (n.children && n.children.length === 0) {
            delete n.children;
          } else if (n.children) {
            prune(n.children);
            if (n.children.length === 0) delete n.children;
          }
        });
      };
      prune(tree);

      return tree;
    },

    handleSort() {
      this.firstLevelMenus = this.menuList.filter(item => item.pid === 0);
      this.sortDialogVisible = true;
    },
    // 移除不再需要的syncMenuListOrder和confirmSort方法

    handleAddSubMenu(row) {
      this.dialogTitle = '新增子菜单';
      // 根据父菜单level设置子菜单level，父菜单level+1
      const parentLevel = row.level || 1;
      this.menuForm = {
        id: '',
        name: '',
        url: '',
        icon: '',
        sort: 0,
        status: true,
        is_show: true,
        pid: row.id,
        parentName: row.name,
        level: parentLevel + 1
      };
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/styles/variables.scss';

body .menu-container .el-tree .el-tree-node {
  margin-top: 32px !important;
  position: relative !important;
  display: block !important;
  box-sizing: border-box !important;
  clear: both !important;
  margin-bottom: 12px;
}

/* —— 关键 CSS：隐藏“叶子节点”的占位展开图标 —— */
/* 兼容 Element UI 与 Element Plus：叶子图标都会带 .is-leaf */
/* 使用visibility:hidden而非display:none，保留占位空间以保持对齐 */
.menu-tree .el-tree-node__expand-icon.is-leaf {
  visibility: hidden !important;
}

/* 移除或修改节点内容容器的背景 */
.menu-tree .el-tree-node__content {
  background-color: transparent !important;
}

.sort-list {
  background-color: white;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;

  .sort-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    margin-bottom: 10px;
    border-radius: 6px;
    border: 1px solid transparent;
    background-color: #fff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: move;

    &:hover {
      background-color: #f0f7ff;
      border-color: #e6f7ff;
      transform: translateX(3px);
    }

    &.dragging {
      background-color: #e6f7ff;
      border: 1px dashed #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
      opacity: 0.9;
    }

    &.active {
      background-color: #e6f7ff;
      border-color: #bae7ff;
    }

    .sort-icon {
      color: #1890ff;
      margin-right: 15px;
      font-size: 18px;
    }

    .sort-name {
      font-size: 16px;
      font-weight: 500;
      flex: 1;
    }
  }
}
</style>

<style lang="scss">
.list-page {
  padding-bottom: 80px;
  background-color: $bg-color-light;
  min-height: 100vh;
  box-sizing: border-box;

  .el-card__body {
    background-color: #FFFFFF;
  }

  .el-card {
    border: none;
    box-shadow: $card-shadow;
    border-radius: $radius;
    overflow: hidden;
    background-color: $bg-color;
    transition: $transition;

    &:hover {
      box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12);
    }

    .el-card__header {
      padding: 20px 24px;
      background-color: #FFFFFF;
      border-bottom: 1px solid $border-color;

      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
      }

      .el-card__header__title {
        font-size: 16px;
        font-weight: 600;
        color: $text-color;
        margin: 0;
      }

      .header-buttons {
        display: flex;
        gap: 12px;
      }
    }
  }

  .icon-tips {
    margin-top: 10px;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
  }

  .icon-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 8px;
    overflow-y: scroll;
    height: 160px;
  }

  .icon-item {
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
  }

  .icon-item:hover {
    border-color: #4096ff;
    background-color: #f0f7ff;
  }

  .icon-item i {
    font-size: 18px;
    color: #4096ff;
  }

  .tips-desc {
    font-size: 12px;
    color: #909399;
    margin: 0;
  }

  .menu-container {
    padding: 20px;
    background-color: #FFFFFF;
    border-radius: $radius;
    box-shadow: $card-shadow;
    overflow: visible;
    min-height: 500px;

    .menu-tree {
      border: none;
      background-color: transparent;
      padding: 0;

      .el-tree-node {
        &.is-expanded {
          .el-tree-node__children {
            animation: fadeIn 0.3s ease-in-out;
          }
        }

        &:not(.is-parent)>.el-tree-node__content>.tree-node-content {
          border-left: 3px solid $primary-color;
        }

        &:not(.is-parent)>.el-tree-node__content>.tree-node-content .node-icon {
          color: $primary-color;
        }

        .el-tree-node__expand-icon {
          color: $text-color-placeholder;
          font-size: 16px;
          transition: transform 0.3s ease;
          margin-right: 10px;

          &.is-expanded {
            transform: rotate(90deg);
            color: $primary-color;
          }
        }

        .el-tree-node__indent {
          width: 32px;
        }

        .el-tree-node__children {
          padding-left: 10px;
        }

        .el-tree__empty-block {
          padding: 40px 0;
          color: $text-color-placeholder;
        }
      }

      .tree-node-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 14px 16px;
        border-radius: $radius;
        margin-bottom: 8px;
        background-color: $bg-color;
        border: 1px solid $border-color;
        transition: $transition;

        .node-status,
        .node-is-show {
          margin-right: 15px;
          display: flex;
          align-items: center;
        }

        .node-label {
          font-size: 14px;
          font-weight: 500;
          color: $text-color;
          display: flex;
          align-items: center;
          flex: 1;

          .node-icon {
            margin-right: 10px;
            font-size: 16px;
          }
        }

        .tree-node-operations {
          display: flex;
          align-items: center;
          gap: 6px; // 按钮之间间距
          flex-shrink: 0; // 避免按钮被挤压
        }

        .tree-node-operations .el-button {
          flex-shrink: 0; // 按钮宽度固定
        }
      }

      .el-tree-node:not(.is-parent)>.el-tree-node__content>.tree-node-content:hover {
        background-color: $primary-light;
        border-color: $primary-color;
        transform: translateX(0);
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
      }
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
