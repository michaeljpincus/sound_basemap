import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.12.0/dist/maplibre-gl.mjs';

const map = new maplibregl.Map({
  container: 'map',
  minZoom: 2.5,
  style: 'basemap.json' 
});

window.map = map;

map.on('click', e => {
  map.queryRenderedFeatures(e.point).forEach(f =>
    console.log(f.layer.id, JSON.stringify(f.properties['name:en']), JSON.stringify(f.properties.name))
  );
});

map.on('click', e => {
  const r = 6;
  map.queryRenderedFeatures(
    [[e.point.x - r, e.point.y - r], [e.point.x + r, e.point.y + r]],
    { layers: ['adm1-borders'] }
  ).forEach(f => console.log(f.properties.adm0_l, f.properties.adm0_r));
});

map.on('click', e => {
  map.queryRenderedFeatures(e.point, { layers: ['neighborhoods'] })
    .forEach(f => console.log(f.properties.class, f.properties['name:en'] || f.properties.name, map.getZoom().toFixed(1)));
});

const RADAR_BASE =
  'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity/MapServer/export' +
  '?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256' +
  '&format=png32&transparent=true&f=image';

map.on('load', () => {
  map.addSource('radar', {
    type: 'raster',
    tiles: [RADAR_BASE],   // now the proxy URL
    tileSize: 256,
    attribution: 'NOAA/NWS MRMS'
  });
  map.addSource('coastline', {
    type: 'geojson',
    data: 'coastline.geojson'
  });

  map.addLayer({
    id: 'radar',
    type: 'raster',
    source: 'radar',
    paint: { 'raster-opacity': 0.75 }
  }, 'country-borders2');

  map.addLayer({
    id: 'coastline',
    type: 'line',
    source: 'coastline',
    paint: {
      'line-width': 1,
      'line-color': '#FFFFFF'
    }
  }, 'country-borders2');
});