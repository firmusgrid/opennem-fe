<template>
  <div
    v-on-clickaway="onClickAway"
    :class="{ 'is-active': dropdownActive }"
    class="dropdown">
    <button
      :class="{ 'is-inverted': selected.length === 0 }"
      class="dropdown-trigger button is-small is-rounded is-primary"
      @click="dropdownActive = !dropdownActive"
    >
      <div class="dropdown-label">
        <strong v-if="selected.length === 0">Status</strong>
        <strong v-if="selected.length > 0">{{ getStatusLabel(selected) }}</strong>
      </div>
      <i class="fal fa-chevron-down" />
    </button>

    <transition name="slide-down-fade">
      <div
        v-if="dropdownActive"
        class="dropdown-menu">
        <div class="dropdown-content">
          <a
            v-for="(d, index) in statuses"
            :key="index"
            class="dropdown-item"
            @click="handleClick(d.id)"
          >
            <span class="status-checkbox">
              <i
                v-if="isSelected(d.id)"
                class="checkmark-icon fal fa-check" />
            </span>
            {{ d.label }}
          </a>

          <div class="buttons">
            <a
              class="button is-rounded is-small is-inverted"
              @click="clearSelected">Clear</a>
            <a
              class="button is-rounded is-small is-primary is-outlined"
              @click="dropdownActive = false">Close</a>
          </div>
        </div>
      </div>
    </transition> 
  </div>
</template>

<script>
import _includes from 'lodash.includes'
import _cloneDeep from 'lodash.clonedeep'
import { mixin as clickaway } from 'vue-clickaway'
import { FacilityStatus } from '~/constants/facility-status.js'

export default {
  mixins: [clickaway],

  props: {
    selectedStatuses: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      statuses: _cloneDeep(FacilityStatus),
      selected: [],
      dropdownActive: false
    }
  },

  watch: {
    selectedStatuses(selected) {
      this.selectedStatus = selected
    }
  },

  mounted() {
    this.selectedStatus = this.status
    this.selected = _cloneDeep(this.selectedStatuses)
  },

  methods: {
    onClickAway() {
      this.dropdownActive = false
    },
    isSelected(status) {
      return _includes(this.selected, status)
    },
    handleClick(status) {
      const isIncluded = _includes(this.selected, status)
      if (isIncluded) {
        this.selected = this.selected.filter(d => d !== status)
      } else {
        this.selected.push(status)
      }

      this.$emit('selectedStatuses', _cloneDeep(this.selected))
    },
    clearSelected() {
      this.selected = []
      this.$emit('selectedStatuses', _cloneDeep(this.selected))
    },
    getStatusLabel(selected) {
      return selected.length > 1
        ? `Status (${selected.length})`
        : this.statuses.find(s => s.id === selected[0]).label
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables.scss';

.dropdown-label {
  font-family: $family-primary;
  margin-right: 0.5rem;
  font-size: 11px;

  strong {
    font-weight: 600;
  }
}
.dropdown-menu {
  min-width: 150px;
}
.dropdown-content {
  font-family: $family-primary;

  .dropdown-item {
    font-size: 12px;
  }
}
.status-checkbox {
  width: 15px;
  height: 15px;
  background-color: #fff;
  display: inline-block;
  vertical-align: text-bottom;
  margin-right: 0.4rem;
  position: relative;
  top: 1px;
  border: 1px solid #000;
  border-radius: 1px;

  .checkmark-icon {
    position: relative;
    left: 2px;
    bottom: 1px;
    color: #000;
  }
}

.buttons {
  border-top: 1px solid #eee;
  padding: 0.4rem 0.5rem 0.1rem;
  margin-top: 0.3rem;
  display: flex;
  justify-content: space-between;
  text-align: right;

  .button {
    font-size: 10px;
    margin-left: 0;
    border: 1px solid #eee;
  }
}
</style>
