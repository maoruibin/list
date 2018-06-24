<template lang="html">
    <div>

        <loading-block
            v-if="showLoading"
            :done="doneLoading"
            :failed="loadFailed"
        ></loading-block>
    </div>
</template>

<script>
import HamburgerIcon from './HamburgerIcon';
import LoadingBlock from './LoadingBlock';
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            scrollSection: null,
            wait: false
        }
    },
    computed: {
        ...mapGetters({
            header: 'getHeaderState'
        }),
        routeName() {
            return this.$route.name;
        },
        showLoading() {
            return this.header.showLoading;
        },
        doneLoading() {
            return this.header.doneLoading;
        },
        loadFailed() {
            return this.header.loadFailed;
        },
        isUserPage() {
            return this.$route.name === 'USER_DETAIL';
        }
    },
    components: {
        HamburgerIcon,
        LoadingBlock
    },
    methods: {
        ...mapActions(['toggleNavMenu']),
        shouldShowBackBtn() {
            switch (this.$route.name) {
                case 'USER_DETAIL':
                    return false;
                case 'USER_REPO_LIST':
                case 'REPO_DETAIL':
                    return true;
                default:
                    return false;
            }
        },
        handleClick() {
            const isBack = this.shouldShowBackBtn();
            if (isBack) {
                this.$router.push({
                    name: this.$route.name === 'REPO_DETAIL'
                        ? 'USER_REPO_LIST' : 'USER_DETAIL'
                });
            } else {
                this.toggleNavMenu();
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.scrollSection = document.getElementById('scroll-section');
            this.scrollSection.addEventListener('scroll', () => {
                let lastScrollTop = this.scrollSection.scrollTop;
                if (!this.wait) {
                    window.requestAnimationFrame(() => {
                        // Access direct to the DOM for better scrolling performance
                        if (lastScrollTop === 0 && this.isUserPage) {
                            this.$refs.header.classList.add('transparent');
                        } else {
                            this.$refs.header.classList.remove('transparent');
                        }
                        this.wait = false;
                    });
                    this.wait = true;
                }
            });
        });
    }
}
</script>
