import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const BarChart = () => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Create root element
    let root = am5.Root.new(containerRef.current);

    let myTheme = am5.Theme.new(root);

    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1
    });

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);

    // Create chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0
      })
    );

    // Create axes
    let yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true
    });
    yRenderer.grid.template.set("location", 1);

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "country",
        renderer: yRenderer
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          visible: true,
          strokeOpacity: 0.1,
          minGridDistance: 80
        })
      })
    );

    // Create series
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "value",
        sequencedInterpolation: true,
        categoryYField: "country"
      })
    );

    let columnTemplate = series.columns.template;

    columnTemplate.setAll({
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      strokeOpacity: 0
    });
    columnTemplate.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    columnTemplate.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    // Удаление события dragstop
    // columnTemplate.events.on("dragstop", () => {
    //   sortCategoryAxis();
    // });

    // Удаление функции сортировки
    // function sortCategoryAxis() {
    //   // ...
    // }

    // Set data
    const data = [{
      country: "Test 1",
      value: 2025
    }, {
      country: "Test 2",
      value: 1882
    }, {
      country: "Test 3",
      value: 1809
    }, {
      country: "Test 4",
      value: 1322
    }, {
      country: "Test 5",
      value: 1122
    }];

    yAxis.data.setAll(data);
    series.data.setAll(data);

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
    <div ref={containerRef} style={{ width: "100%", height: "400px" }}></div>
  );
};

export default BarChart;
