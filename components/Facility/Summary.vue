<template>
  <summary> 
    <p>
      {{ description }}

      <v-popover 
        v-if="hasWikiLink" 
        class="wiki-link-text" 
        placement="auto">
        <i class="fal fa-info-circle"/>

        <template slot="popover">
          Copied content from <a
            :href="wikiLink"
            class="wiki-link" 
            target="facility-wiki-link">
            Wikipedia
            <i class="fal fa-external-link"/>
          </a>; see that page's history for attribution.
        </template>
      </v-popover>
    </p>

    

  </summary>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: ''
    },
    wikiLink: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasWikiLink() {
      return this.wikiLink && this.wikiLink !== ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/responsive-mixins.scss';
@import '~/assets/scss/variables.scss';

summary {
  margin-bottom: 1rem;
  line-height: 1.45em;
  font-size: 1.05em;
  padding: 0 $facility-tablet-padding;

  @include mobile {
    padding: 0 $facility-mobile-padding;
    font-size: 0.9em;
    margin-bottom: 0;
  }

  p {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .wiki-link-text {
    display: inline-block;
    font-size: 0.8em;
  }
}
</style>
