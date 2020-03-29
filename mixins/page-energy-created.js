import EventBus from '~/plugins/eventBus.js'
import _debounce from 'lodash.debounce'

const pageEnergyCreated = {
  head() {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.pageTitle
        },
        {
          hid: 'twitter:image:src',
          name: 'twitter:image:src',
          content: this.pageImage
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.pageTitle
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.pageImage
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.pageUrl
        }
      ]
    }
  },

  data() {
    return {
      mounted: false,
      ready: false,
      originalDataset: [],
      dataset: [],
      energyDomains: [],
      fuelTechEnergyOrder: [],
      emissionsOrder: [],
      marketValueDomains: [],
      temperatureDomains: [],
      temperatureMeanId: '',
      temperatureMinId: '',
      temperatureMaxId: '',
      priceDomains: [],
      emissionDomains: [],
      responses: [],
      hoverDate: null,
      hoverDomain: null,
      hoverEmissionVolumeDomain: null,
      focusDate: null,
      mouseLoc: null,
      tooltipLeft: 0,
      filteredDataset: [],
      visHeight: 0,
      hoverOn: false,
      lineColour: '#e34a33',
      windowWidth: 0,
      energyMin: 0,
      energyMax: 1000,
      emissionsVolumeDataset: [],
      emissionsMin: 0,
      emissionsMax: 1000,
      emissionsIntensityDataset: [],
      emissionsIntensityMin: 0,
      emissionsIntensityMax: 1000,
      isTouchDevice: false,
      compareData: [],
      summary: null,
      renewablesPercentageDataset: []
    }
  },

  created() {
    this.$store.dispatch('currentView', 'energy')
    EventBus.$on('dataset.filter', this.handleDatasetFilter)
    EventBus.$on('vis.mousemove', this.handleVisMouseMove)
    EventBus.$on('vis.mouseenter', this.handleVisEnter)
    EventBus.$on('vis.mouseleave', this.handleVisLeave)
  },

  mounted() {
    function is_touch_device() {
      var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
      var mq = function(query) {
        return window.matchMedia(query).matches
      }

      if (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
      ) {
        return true
      }

      // include the 'heartz' as a way to have a non matching MQ to help terminate the join
      // https://git.io/vznFH
      var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
        ''
      )
      return mq(query)
    }

    this.isTouchDevice = is_touch_device()
    this.windowWidth = window.innerWidth
    this.visHeight = this.widthBreak ? 578 : 350
    this.$nextTick(() => {
      window.addEventListener(
        'resize',
        _debounce(() => {
          this.windowWidth = window.innerWidth
          this.visHeight = this.widthBreak ? 578 : 350
        }, 200)
      )
    })
    this.fetchData(this.regionId, this.range)
    this.mounted = true
  },

  beforeDestroy() {
    EventBus.$off('dataset.filter')
    EventBus.$off('vis.mousemove')
    EventBus.$off('vis.mouseenter')
    EventBus.$off('vis.mouseleave')
  }
}

export default pageEnergyCreated