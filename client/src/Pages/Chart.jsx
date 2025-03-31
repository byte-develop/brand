import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const Chart = () => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const myData = [
    { time: new Date('2024-01-01T02:00:00').getTime(), value: 300 },
    { time: new Date('2024-01-01T03:00:00').getTime(), value: 230 },
    { time: new Date('2024-01-01T04:00:00').getTime(), value: 320 },
    { time: new Date('2024-01-01T05:00:00').getTime(), value: 210 },
    { time: new Date('2024-01-01T06:00:00').getTime(), value: 120 },
    { time: new Date('2024-01-01T07:00:00').getTime(), value: 100 },
    { time: new Date('2024-01-01T08:00:00').getTime(), value: 100 },
    { time: new Date('2024-01-01T09:00:00').getTime(), value: 300 },
    { time: new Date('2024-01-01T10:00:00').getTime(), value: 110 },
    { time: new Date('2024-01-01T11:00:00').getTime(), value: 110 },
    { time: new Date('2024-01-01T12:00:00').getTime(), value: 140 },
  ];

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    let root = am5.Root.new(containerRef.current);

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0
    }));

    // Add cursor
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    // Create axes
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.5,
      baseInterval: {
        timeUnit: "minute",
        count: 60 // Установите интервал в 60 минут для более детального отображения
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 80,
        minorGridEnabled: true,
        pan: "zoom"
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 1,
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom"
      })
    }));

    // Add series
    let series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "time", // Используйте поле "time" для оси X
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 0,
        sprite: am5.Circle.new(root, {
          radius: 4,
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2,
          fill: series.get("fill")
        })
      });
    });

    series.data.setAll(myData);

    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "750px", height: "320px" }}></div>
  );
};

export default Chart;
