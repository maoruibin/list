<template lang="html">
    <div>
      <el-container>

        <el-header>
            <Header
            ref="header"
            :project="currentProject"
            :user="user"
            :settingLean="settingLean"
            :isSuperUser="isSuperUser"
            @logout="logout"
            @addProject="showAddProjectDialog"
            @selectProject="selectProject"
            @aboutAction="showAbout"
            @profile="showProfileDialog"
            @dashboard="showDashboard"/>
        </el-header>

        <el-main v-show="!isShowLoginDialog && !isShowRegisterDialog">
          <div>
            <router-view></router-view>
          </div>
        </el-main>


      </el-container>


        <header-bar></header-bar>

    </div>
</template>

<script>

import HeaderBar from './HeaderBar';

export default {
    data() {
        return {
            scrollTop: 0,
        }
    },
    components: {
        HeaderBar,
    }
}
</script>
