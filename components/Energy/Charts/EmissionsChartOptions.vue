<template>
  <chart-header>
    <template 
      v-slot:options 
      v-if="!readOnly">
      <chart-options 
        :options="options"
        :chart-type="chartType"
        :chart-curve="chartCurve"
        :chart-shown="chartShown"
        :show="chartOptions" 
        @show-change="s => chartOptions = s"
        @type-click="handleTypeClick"
        @curve-click="handleCurveClick"/>
    </template>

    <template v-slot:label-unit>
      <strong>Emissions Volume</strong>
      <small>{{ emissionsVolumeUnit }}/{{ interval | intervalLabel }}</small>
    </template>
    <template 
      v-slot:average-value 
      v-if="!readOnly">
      Av.
      <strong>
        {{ averageEmissionsVolume | formatValue }}
        {{ emissionsVolumeUnit }}/{{ interval | intervalLabel }}
      </strong>
    </template>
    <template v-slot:hover-date>
      {{ hoverDisplayDate }}
    </template>
    <template v-slot:hover-values>
      <span
        v-if="hoverValue"
        class="ft-value">
        <em
          :style="{ 'background-color': hoverDomainColour }"
          class="colour-square" />
        {{ hoverDomainLabel }}
        <strong>{{ hoverValue | formatValue2 }} {{ emissionsVolumeUnit }}</strong>
      </span>
      <span>
        Total
        <strong>{{ hoverTotal | formatValue2 }} {{ emissionsVolumeUnit }}</strong>
      </span>
    </template>
  </chart-header>
</template>

<script>
import { mapGetters } from 'vuex'
import ChartHeader from '@/components/Vis/ChartHeader'
import ChartOptions from '@/components/Vis/ChartOptions'

export default {
  components: {
    ChartHeader,
    ChartOptions
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          type: [],
          curve: [],
          yAxis: []
        }
      }
    },
    chartShown: {
      type: Boolean,
      default: false
    },
    chartType: {
      type: String,
      default: ''
    },
    chartCurve: {
      type: String,
      default: ''
    },
    interval: {
      type: String,
      default: ''
    },
    averageEmissionsVolume: {
      type: Number,
      default: 0
    },
    emissionsVolumeUnit: {
      type: String,
      default: ''
    },
    hoverDisplayDate: {
      type: String,
      default: ''
    },
    hoverValue: {
      type: Number,
      default: 0
    },
    hoverDomainColour: {
      type: String,
      default: ''
    },
    hoverDomainLabel: {
      type: String,
      default: ''
    },
    hoverTotal: {
      type: Number,
      default: 0
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chartOptions: false
    }
  },
  methods: {
    handleTypeClick(type) {
      this.$store.commit('chartOptionsEmissionsVolume/chartType', type)
    },
    handleCurveClick(curve) {
      this.$store.commit('chartOptionsEmissionsVolume/chartCurve', curve)
    }
  }
}
</script>
