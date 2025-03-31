import React, { useLayoutEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import kazakhstanGeoJSON from './kz.json';

const KazakhstanMap = ({ visitorData }) => {
  useLayoutEffect(() => {
    const root = am5.Root.new('chartdiv');
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator()
      })
    );

    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: kazakhstanGeoJSON
    }));

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {visitors} посетителей",
      toggleKey: "active",
      interactive: true
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    const mapData = kazakhstanGeoJSON.features.map(feature => {
      const regionName = feature.properties.NAME_1 || "Неизвестный регион";
      const visitors = visitorData[regionName] || 0;
      return {
        geometry: feature.geometry,
        id: regionName,
        name: regionName,
        visitors: visitors
      };
    });

    polygonSeries.data.setAll(mapData);

    chart.appear(1000, 100);
    console.log(mapData)

    return () => {
      root.dispose();
    };
  }, [visitorData]);

  return <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>;
};

export default KazakhstanMap;
