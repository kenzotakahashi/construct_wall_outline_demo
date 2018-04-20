const WIDTH = 1

function magnitude(vx, vy) {
  return Math.sqrt(vx**2 + vy**2)
}

function slope(x1, y1, x2, y2) {
  return (y2 - y1) / (x2 - x1)
}

function isParallel(l1, l2) {
  const [[x1,y1],[x2,y2]] = l1
  const [[x3,y3],[x4,y4]] = l2
  return (x1 === x2 && x3 === x4) || slope(x1,y1,x2,y2) === slope(x3,y3,x4,y4)
}

function sortPoints(points) {
  const [[x1,y1],[x2,y2]] = points
  return (x1 > x2 || (x1 === x2 && y1 > y2)) ? [points[1],points[0]] : points
}

function makeParallelLines(line, width) {
  /***
  Given 2 points and width, return 2 parallel lines
  ***/
  const [[x1,y1],[x2,y2]] = line
  // vector representation of the line
  const [u_a, u_b] = [x2-x1, y2-y1]
  
  // vertical
  if (u_a === 0) {
    return {
      right: [[x1-width, y1],[x2-width, y2]],
      left:  [[x1+width, y1],[x2+width, y2]]
    }
  }
  // horizontal
  if (u_b === 0) {
    return {
      right: [[x1, y1+width],[x2, y2+width]],
      left:  [[x1, y1-width],[x2, y2-width]]
    }
  }

  // perpendicular to u
  const [v_a, v_b] = [1, -u_a / u_b]
  const mag = magnitude(v_a, v_b)
  // change the length to width
  const [w_a, w_b] = [v_a*width/mag, v_b*width/mag]
  // parallel lines
  const l1 = [[x1+w_a, y1+w_b], [x2+w_a, y2+w_b]]
  const l2 = [[x1-w_a, y1-w_b], [x2-w_a, y2-w_b]]
  return (y1 > y2) ? {right: l1, left: l2} : {right: l2, left: l1}
}

function intersection(l1, l2) {
  /***
  Return the intersection of the two lines
  ***/
  const [[x1,y1],[x2,y2]] = l1
  const [[x3,y3],[x4,y4]] = l2

  if (x1 === x2) {
    const x = x1
    const m = slope(x3, y3, x4, y4)
    const y = m * x - m * x3 + y3
    return [x, y]
  }
  if (x3 === x4) {
    const x = x3
    const m = slope(x1, y1, x2, y2)
    const y = m * x - m * x1 + y1
    return [x, y]
  }

  const m1 = slope(x1, y1, x2, y2)
  const m2 = slope(x3, y3, x4, y4)

  const x = ((-m2 * x3 + y3) - (-m1 * x1 + y1)) / (m1 - m2)
  const y = m1 * x - m1 * x1 + y1
  return [x, y]  
}

function length(line) {
  return Math.round(((line[1][0] - line[0][0])**2 + (line[1][1] - line[0][1])**2)*100)
}

function pickIntersection(current, done, intersection, index) {
  const newLine = current.slice(0)
  newLine[index] = intersection
  return (!done || length(newLine) <= length(current)) ? newLine : current
}

function constructWallOutline(walls, width=WIDTH) {
  const newWalls = walls.map(w => {
    const location = sortPoints(w)
    const {right, left} = makeParallelLines(location, width)
    return {
      location,
      right,
      left,
      rightDefault: right,
      leftDefault: left,
      done: [false, false]
    }
  })

  let inter1, inter2;

  for (const wall1 of newWalls) {
    for (const [i, _] of wall1.location.entries()) {

      for (const wall2 of newWalls) {
        for (const [j, _] of wall2.location.entries()) {

          // Skip if wall1 and wall2 don't have a commont point or they are the same walls
          if (JSON.stringify(wall1.location[i]) !== JSON.stringify(wall2.location[j]) ||
              JSON.stringify(wall1.location) === JSON.stringify(wall2.location)) {
            continue
          }

          if (isParallel(wall1.location, wall2.location)) {
            inter1 = wall1.rightDefault[i]
            inter2 = wall1.leftDefault[i]
            wall1.right = pickIntersection(wall1.right, wall1.done[i], inter1, i)
            wall2.right = pickIntersection(wall2.right, wall2.done[j], inter1, j)
            wall1.left  = pickIntersection(wall1.left,  wall1.done[i], inter2, i)
            wall2.left  = pickIntersection(wall2.left,  wall2.done[j], inter2, j)
          }
          else if (i !== j) {
            inter1 = intersection(wall1.right, wall2.right)
            inter2 = intersection(wall1.left,  wall2.left)
            wall1.right = pickIntersection(wall1.right, wall1.done[i], inter1, i)
            wall2.right = pickIntersection(wall2.right, wall2.done[j], inter1, j)
            wall1.left  = pickIntersection(wall1.left,  wall1.done[i], inter2, i)
            wall2.left  = pickIntersection(wall2.left,  wall2.done[j], inter2, j)
          }
          else {
            inter1 = intersection(wall1.right, wall2.left)
            inter2 = intersection(wall1.left,  wall2.right)
            wall1.right = pickIntersection(wall1.right, wall1.done[i], inter1, i)
            wall2.left  = pickIntersection(wall2.left,  wall2.done[j], inter1, j)
            wall1.left  = pickIntersection(wall1.left,  wall1.done[i], inter2, i)
            wall2.right = pickIntersection(wall2.right, wall2.done[j], inter2, j)
          }
          wall1.done[i] = true
          wall2.done[j] = true
        }
      }
    }
  }

  return newWalls.map(w => {
    const {done, rightDefault, leftDefault, ...rest} = w
    return rest
  })
}

function constructOutline(assets, width=WIDTH) {
  return assets.map(o => {
    const location = sortPoints(o.location)
    return {
      location,
      type: o.type,
      ...makeParallelLines(location, width)
    }
  })
}

export {constructWallOutline, constructOutline}