<template>
  <header>
    <nuxt-link 
      :to="path" 
      class="back-link">
      <i class="fal fa-chevron-left"/>
      <AppLogo class="logo" />
      <h1>Facilities</h1>
    </nuxt-link>

    <nav v-if="filteredFacilities.length > 1">
      <nuxt-link 
        v-tooltip="prevFacilityName" 
        v-if="prevFacilityPath"
        :to="prevFacilityPath">
        <i class="fal fa-fw fa-arrow-circle-left"/>
      </nuxt-link>
      <span 
        v-else 
        class="is-disabled">
        <i class="fal fa-fw fa-arrow-circle-left"/>
      </span>
      
      <nuxt-link 
        v-tooltip="nextFacilityName" 
        v-if="nextFacilityPath" 
        :to="nextFacilityPath">
        <i class="fal fa-fw fa-arrow-circle-right"/>
      </nuxt-link>
      <span 
        v-else 
        class="is-disabled">
        <i class="fal fa-fw fa-arrow-circle-right"/>
      </span>
    </nav>
  </header>
</template> 

<script>
import { mapGetters } from 'vuex'
import AppLogo from '~/components/ui/Logo'

export default {
  components: {
    AppLogo
  },

  data() {
    return {
      nextFacilityPath: null,
      nextFacilityName: '',
      prevFacilityPath: null,
      prevFacilityName: ''
    }
  },

  computed: {
    ...mapGetters({
      previousPath: 'facility/previousPath',
      filteredFacilities: 'facility/filteredFacilities'
    }),
    facilityId() {
      return this.$route.params.facilityId
    },
    path() {
      return this.previousPath === '' ? '/facilities/all/' : this.previousPath
    }
  },

  watch: {
    facilityId() {
      this.updatePaths()
    }
  },

  mounted() {
    this.updatePaths()
    this.listenToNavKeys()
  },

  methods: {
    listenToNavKeys() {
      window.addEventListener('keydown', e => {
        const isLeft = e.keyCode === 37
        const isRight = e.keyCode === 39

        if (isLeft) {
          e.preventDefault()
          if (this.prevFacilityPath) {
            this.$router.push({ path: this.prevFacilityPath })
          }
        } else if (isRight) {
          e.preventDefault()
          if (this.nextFacilityPath) {
            this.$router.push({ path: this.nextFacilityPath })
          }
        }
      })
    },
    updatePaths() {
      const facilitiesLength = this.filteredFacilities.length
      const currentIndex = this.filteredFacilities.findIndex(
        f => f.facilityId === this.facilityId
      )
      const currentFacility = this.filteredFacilities.find(
        f => f.facilityId === this.facilityId
      )

      if (currentIndex !== -1) {
        const isFirstItem = currentIndex === 0
        const isLastItem = currentIndex === facilitiesLength - 1

        const nextFacility = isLastItem
          ? null
          : this.filteredFacilities[currentIndex + 1]
        const prevFacility = isFirstItem
          ? null
          : this.filteredFacilities[currentIndex - 1]

        const nextFacilityId = nextFacility ? nextFacility.facilityId : null
        const nextFacilityName = nextFacility ? nextFacility.displayName : null
        const nextFacilityNetwork = nextFacility ? nextFacility.network : null
        const prevFacilityId = prevFacility ? prevFacility.facilityId : null
        const prevFacilityName = prevFacility ? prevFacility.displayName : null
        const prevFacilityNetwork = prevFacility ? prevFacility.network : null

        this.nextFacilityPath = nextFacilityId
          ? `/facility/${encodeURIComponent(
              nextFacilityNetwork
            )}/${encodeURIComponent(nextFacilityId)}`
          : null
        this.prevFacilityPath = prevFacilityId
          ? `/facility/${encodeURIComponent(
              prevFacilityNetwork
            )}/${encodeURIComponent(prevFacilityId)}`
          : null
        this.nextFacilityName = nextFacilityName
        this.prevFacilityName = prevFacilityName
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/responsive-mixins.scss';
@import '~/assets/scss/variables.scss';

header {
  display: flex;
  justify-content: space-between;

  nav {
    margin-top: 1.7rem;
    margin-right: 1rem;
    font-size: 2rem;

    @include mobile {
      margin-top: 0.7rem;
      margin-right: 0.5rem;
    }

    .is-disabled {
      color: #ccc;
    }
  }
}
.back-link {
  $item-margin: 0.75rem;

  display: inline-flex;
  align-items: center;
  border-radius: $header-hover-radius;
  margin-top: 1.5rem;
  margin-left: 1.5rem;
  padding: $app-padding / 3 $app-padding / 2;
  background-color: $background-alpha;

  @include mobile {
    margin-top: 0.5rem;
    margin-left: 0rem;
  }

  i {
    font-size: 1.6rem;
    margin-right: $item-margin;
  }

  .logo {
    width: 2.3rem;
    position: relative;
    top: 3px;
    margin-right: $item-margin;
  }

  h1 {
    font-family: $header-font-family;
    font-weight: 700;
    color: #000;
    font-size: 1.2rem;
  }

  &:hover {
    i {
      color: $opennem-link-color;
    }
    background-color: rgba(255, 255, 255, 0.55);
  }
}
</style>
