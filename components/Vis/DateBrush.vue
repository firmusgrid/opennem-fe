<template>
  <div class="vis brush-vis">
    <svg 
      :width="svgWidth"
      :height="svgHeight"
      :id="id">
      <defs>
        <!-- where to clip -->
        <clipPath :id="`${id}-clip`">
          <rect
            :width="width"
            :height="height"/>
        </clipPath>
      </defs>
      <g 
        :transform="axisTransform" 
        class="x-axis" />
      <g 
        v-if="!readOnly"
        :transform="brushTransform" 
        class="brush-group" />
    </svg>
  </div>
</template>

<script>
import _cloneDeep from 'lodash.clonedeep'
import { select, mouse, event, selectAll } from 'd3-selection'
import { scaleTime } from 'd3-scale'
import { axisBottom } from 'd3-axis'
import { extent } from 'd3-array'
import { brushX } from 'd3-brush'

export default {
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    dataset: {
      type: Array,
      default: () => []
    },
    zoomRange: {
      type: Array,
      default: () => []
    },
    tickFormat: {
      type: Function,
      default: () => ({})
    },
    secondTickFormat: {
      type: Function,
      default: () => ({})
    },
    xTicks: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return {
      svgWidth: 0,
      svgHeight: 30,
      width: 0,
      height: 0,
      margin: { left: 10, right: 1, top: 20, bottom: 10 },
      x: null,
      brushX: null,
      xAxis: null,
      $xAxisGroup: null,
      $brushGroup: null
    }
  },
  computed: {
    id() {
      return `date-brush-${this.uuid}`
    },
    clipPathUrl() {
      return `url(#${this.id}-clip)`
    },
    axisTransform() {
      return `translate(${this.margin.left}, 0)`
    },
    brushTransform() {
      return `translate(${this.margin.left}, 0)`
    },
    xExtent() {
      return extent(this.updatedDataset, d => new Date(d.date))
    },
    updatedDataset() {
      if (this.dataset.length > 0) {
        const updated = _cloneDeep(this.dataset)
        const lastSecondItem = _cloneDeep(updated[updated.length - 2])
        const lastItem = _cloneDeep(updated[updated.length - 1])
        const intervalTime = lastItem.time - lastSecondItem.time
        lastItem.time = lastItem.time + intervalTime
        lastItem.date = new Date(lastItem.time)
        updated.push(lastItem)
        return updated
      }
      return []
    }
  },
  watch: {
    dataset() {
      this.draw()
    },
    zoomRange(newRange) {
      if (newRange.length > 0) {
        this.x.domain(newRange)
      } else {
        this.x.domain(this.xExtent)
      }
      this.redraw()
    },
    xTicks(newTicks) {
      this.xAxis.ticks(newTicks)
      this.redraw()
    },
    tickFormat(newFormat) {
      this.xAxis.tickFormat((d, i) => newFormat(d, i === 0))
      this.redraw()
    }
  },
  mounted() {
    this.setupWidthHeight()
    this.setup()
    window.addEventListener('resize', this.handleResize)
  },
  updated() {
    this.setupWidthHeight()
    this.setup()
    this.draw()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.setupWidthHeight()
      this.resize()
    },

    resize() {
      this.x.range([0, this.width])
      this.xAxis.tickSize(this.height)
      this.$xAxisGroup.call(this.drawXAxis)
      this.brushX.extent([[0, 0], [this.width, this.svgHeight]])
      this.$brushGroup.call(this.brushX)
    },

    setupWidthHeight() {
      const chartWidth = this.$el.offsetWidth
      const width = chartWidth - this.margin.left - this.margin.right
      const height = this.svgHeight - this.margin.top - this.margin.bottom

      this.svgWidth = chartWidth
      this.width = width < 0 ? 0 : width
      this.height = height < 0 ? 0 : height
    },

    setup() {
      const self = this
      const $svg = select(`#${this.id}`)
      // DOM
      this.$xAxisGroup = $svg.select('.x-axis')

      // Define scales
      this.x = scaleTime()
        .range([0, this.width])
        .nice()

      // Axis
      this.xAxis = axisBottom(this.x)
        .tickSize(this.height)
        .ticks(this.xTicks)
        .tickFormat((d, i) => this.tickFormat(d, i === 0))

      // Brush
      this.brushX = brushX()
        .extent([[0, 0], [this.width, this.svgHeight]])
        .on('end', this.brushEnded)
      this.$brushGroup = $svg.select('.brush-group')
      this.$brushGroup.call(this.brushX)

      // Events
      this.$brushGroup.on('touchmove mousemove', function() {
        const date = self.getXAxisDateByMouse(this)
        self.$emit('date-hover', this, date)
      })
      $svg.on('mouseenter', () => {
        this.handleSvgEnter()
      })
      $svg.on('mouseleave', () => {
        this.handleSvgLeave()
      })
    },

    handleSvgEnter() {
      this.$emit('enter')
    },
    handleSvgLeave() {
      this.$emit('date-hover', null, null)
      this.$emit('leave')
    },

    draw() {
      if (this.zoomRange.length > 0) {
        this.x.domain(this.zoomRange)
      } else {
        this.x.domain(this.xExtent)
      }
      this.$xAxisGroup.call(this.drawXAxis)
    },

    redraw() {
      this.$xAxisGroup.call(this.drawXAxis)
    },

    drawXAxis(g) {
      const self = this
      g.select('.x-axis')
        .style('clip-path', this.clipPathUrl)
        .style('-webkit-clip-path', this.clipPathUrl)
      g.call(this.xAxis)
      g.selectAll('.x-axis .tick line').attr('y2', this.svgHeight)
      g.selectAll('.x-axis .tick text').each(function(d, i) {
        const el = select(this)
        const text2 = self.secondTickFormat(d)
        el.attr('x', 2)
        if (text2 !== '') {
          el.append('tspan')
            .text(text2.trim())
            .attr('x', 2)
            .attr('dy', 12)
        }
      })
    },

    brushEnded() {
      // prevent an infinite loop by not moving the brush in response to you moving the brush
      if (!event.selection) {
        this.$emit('date-filter', [])
        return
      }

      // Turn off the brush selection
      this.$brushGroup.call(this.brushX.move, null)

      const s = event.selection
      let start = this.x.invert(s[0])
      let end = this.x.invert(s[1])
      this.$emit('date-filter', [start, end])
    },

    getXAxisDateByMouse(evt) {
      const m = mouse(evt)
      const date = this.x.invert(m[0])
      return date
    }
  }
}
</script>
