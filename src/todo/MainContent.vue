<template lang="html">
    <div>
      
        <header-bar></header-bar>
        <div>
            <router-view></router-view>
        </div>
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
