// A stable viewBox keeps the tiles, track and stop numbers in the same coordinate system.
function renderCourseMap(figure, course, stops) {
  figure.replaceChildren();
  figure.hidden = true;
  const track = courseTracks[course.id];
  if (!track || stops.length < 2) return;

  const width = 360, height = 216;
  const ns = 'http://www.w3.org/2000/svg';
  function element(tag, attrs, parent) {
    const node = document.createElementNS(ns, tag);
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
    parent.append(node);
    return node;
  }
  const svg = element('svg', {viewBox: '0 0 360 216', role: 'img',
    'aria-label': course.course + ' 경로 지도'}, figure);
  const routeColor = '#195c9b';
  const project = ([lat, lon]) => [
    (lon + 180) / 360, (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2
  ];
  const points = track.points.map(project);
  const locations = Object.entries(track.markers).map(([i, n]) => [Number(i), points[n]]);
  for (const [i, position] of Object.entries(track.places || {})) {
    locations.push([Number(i), project(position)]);
  }
  locations.sort((a, b) => a[0] - b[0]);
  const extent = points.concat(locations.map(([, position]) => position));
  const xs = extent.map(p => p[0]), ys = extent.map(p => p[1]);
  const left = Math.min(...xs), right = Math.max(...xs);
  const top = Math.min(...ys), bottom = Math.max(...ys);
  const scale = Math.min((width - 82) / (right - left), (height - 66) / (bottom - top));
  const originX = (left + right) / 2 - width / (2 * scale);
  const originY = (top + bottom) / 2 - height / (2 * scale);
  const zoom = Math.min(18, Math.ceil(Math.log2(scale / 256)));
  const tiles = 2 ** zoom, tileSize = scale / tiles;
  let pendingTiles = 0;
  for (let x = Math.floor(originX * tiles); x <= Math.floor((originX + width / scale) * tiles); x++) {
    for (let y = Math.floor(originY * tiles); y <= Math.floor((originY + height / scale) * tiles); y++) {
      const tile = element('image', {x: (x / tiles - originX) * scale, y: (y / tiles - originY) * scale,
        width: tileSize + 0.1, height: tileSize + 0.1}, svg);
      pendingTiles++;
      tile.addEventListener('load', () => {
        pendingTiles--;
        if (pendingTiles === 0 && figure.contains(svg)) figure.hidden = false;
      }, {once: true});
      tile.setAttribute('href', 'https://tile.openstreetmap.org/' + zoom + '/' + x + '/' + y + '.png');
    }
  }
  const pixels = points.map(([x, y]) => [(x-originX)*scale, (y-originY)*scale]);
  const path = 'M' + pixels.map(([x,y]) => x.toFixed(1) + ',' + y.toFixed(1)).join(' L');

  for (const [stroke, thickness] of [['white', 7], [routeColor, 4]]) {
    element('path', {d: path, fill: 'none', stroke, 'stroke-width': thickness,
      'stroke-linejoin': 'round', 'stroke-linecap': 'round'}, svg);
  }
  const badges = locations.map(([index, [mx, my]]) => ({
    index, x: (mx - originX) * scale, y: (my - originY) * scale
  }));
  const occupied = [];
  for (const pin of badges) {
    const {index, x, y} = pin;
    const point = element('g', {}, svg);
    element('title', {}, point).textContent = stops[index];
    // Keep the anchor at the POI when nearby stops need separate number badges.
    const offsets = [[0,0], [26,0], [-26,0], [0,-26], [0,26], [26,-22], [-26,-22]];
    const [dx, dy] = offsets.find(([ox, oy]) => {
      const bx = x + ox, by = y + oy;
      return bx >= 11 && bx <= width - 11 && by >= 11 && by <= height - 11 &&
        occupied.every(([u,v]) => Math.hypot(u-bx, v-by) >= 23);
    }) || [0,0];
    const bx = x+dx, by = y+dy;
    occupied.push([bx, by]);
    if (dx || dy) {
      element('line', {x1:x, y1:y, x2:bx, y2:by, stroke:routeColor, 'stroke-width':1.5}, point);
      element('circle', {cx:x, cy:y, r:2, fill:routeColor}, point);
    }
    element('circle', {cx:bx, cy:by, r:10, fill:routeColor, stroke:'white', 'stroke-width':2}, point);
    element('text', {x:bx, y:by+4, class:'map-stop-number'}, point).textContent = index+1;
    // The numbered list contains every name, even where map labels would overlap.
    const crowded = badges.some(p => p !== pin && Math.abs(p.x-x) < 76 && Math.abs(p.y-y) < 32);
    if (!crowded) {
      const tx = Math.max(65, Math.min(width-65,bx));
      element('text', {x:tx, y:by+24, class:'map-stop-name'}, point).textContent = stops[index];
    }
  }
  const caption = document.createElement('figcaption');
  const source = document.createElement('a');
  source.href = track.source || course.source;
  source.target = '_blank';
  source.rel = 'noopener';
  source.textContent = '경로 · ' + (track.credit || '두루누비 GPX');
  if (track.format === 'gpx') source.append(' (trkpt/@lat, trkpt/@lon)');
  caption.append(source);
  const credit = document.createElement('a');
  credit.href = 'https://www.openstreetmap.org/copyright';
  credit.target = '_blank';
  credit.rel = 'noopener';
  credit.textContent = '© OpenStreetMap';
  caption.append(credit);
  figure.append(caption);
}
