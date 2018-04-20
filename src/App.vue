<template>
  <div id="app">
    <svg width="1000" height="500">
      <g transform="scale(10)">
        <g v-for="wall in parallelLines">
          <polyline  :points="createPolyline(wall.location)" />
          <!-- <path :d="createWallPath(wall)" /> -->
          <circle :cx="wall.right[0][0]"    :cy="wall.right[0][1]"    r=".3" fill="red"   stroke="none" />
          <circle :cx="wall.right[1][0]"    :cy="wall.right[1][1]"    r=".3" fill="red"   stroke="none" />
          <circle :cx="wall.left[0][0]"     :cy="wall.left[0][1]"     r=".3" fill="red"   stroke="none" />
          <circle :cx="wall.left[1][0]"     :cy="wall.left[1][1]"     r=".3" fill="red"   stroke="none" />
          <circle :cx="wall.location[0][0]" :cy="wall.location[0][1]" r=".3" fill="black" stroke="none" />
          <circle :cx="wall.location[1][0]" :cy="wall.location[1][1]" r=".3" fill="black" stroke="none" />
          <polyline stroke="red" :points="createPolyline(wall.right)" />
          <polyline stroke="red" :points="createPolyline(wall.left)" />
        </g>


        <g v-for="wall in walls" transform="translate(30, 0)">
          <polyline  :points="createPolyline(wall.location)"  />
          <!-- <path :d="createWallPath(wall)" /> -->
          <circle :cx="wall.right[0][0]"    :cy="wall.right[0][1]"    r=".3" fill="red"   stroke="none" />
          <circle :cx="wall.right[1][0]"    :cy="wall.right[1][1]"    r=".3" fill="red"   stroke="none" />
          <circle :cx="wall.left[0][0]"     :cy="wall.left[0][1]"     r=".3" fill="red"   stroke="none" />
          <circle :cx="wall.left[1][0]"     :cy="wall.left[1][1]"     r=".3" fill="red"   stroke="none" />
          <circle :cx="wall.location[0][0]" :cy="wall.location[0][1]" r=".3" fill="black" stroke="none" />
          <circle :cx="wall.location[1][0]" :cy="wall.location[1][1]" r=".3" fill="black" stroke="none" />
          <polyline stroke="red" :points="createPolyline(wall.right)" />
          <polyline stroke="red" :points="createPolyline(wall.left)" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import {constructWallOutline, constructOutline} from './outline'

const walls = [
  [[10,10],[20,10]],
  [[10,10],[10,20]],
  [[20,10],[30,10]],
  [[20,10],[20,20]],
  [[10,20],[20,20]],
  [[20,20],[20,30]],
  [[30,10],[30,20]],
  [[20,20],[30,20]],
  [[30,20],[20,30]],
]
const outlines = constructWallOutline(walls, 1)
const parallelLines = constructOutline(walls.map(o => ({
  location: o,
  type: 0
})), 1)
// for (const o of outlines) {
//   console.log(o)
// }

export default {
  name: 'app',
  data () {
    return {
      walls: outlines,
      parallelLines,
    }
  },
  components: {
  },
  methods: {
    createWallPath(w) {
      return `M${w.right[0][0]} ${w.right[0][1]}
              L${w.right[1][0]} ${w.right[1][1]}
              L${w.location[1][0]} ${w.location[1][1]}
              L${w.left[1][0]} ${w.left[1][1]}
              L${w.left[0][0]} ${w.left[0][1]}
              L${w.location[0][0]} ${w.location[0][1]} Z` 
    },
    createPolyline(points) {
      return points.map(p => p.join(',')).join(' ')
    },
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

svg {
  stroke: black;
  stroke-width: 0.2px;
  fill: none;
}

path {
  stroke: red;
}

.wrong {
  stroke-width: 1px;
}

</style>
