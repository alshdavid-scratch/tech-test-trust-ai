import './bar-chart.scss'
import { h } from "preact";

// @ts-expect-error
import {GoogleCharts} from 'google-charts';


export type BarChartProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
  title: string,
  xLabel: string,
  yLabel: string,
  rawData: Record<string, number>
}

export function BarChart({title, xLabel, yLabel, rawData, ...props}: BarChartProps) {


  function onElement(el: HTMLDivElement | null) {
    if (!el) return

    function drawChart() {
      const d: Array<[string, number]> = []
      
      for (const [key, value] of Object.entries(rawData)) {
        d.push([key, value])
      }

      var data = GoogleCharts.api.visualization.arrayToDataTable([
        [yLabel, xLabel],
        ...d
      ]);

      var options = {
        title,
        chartArea: {width: '50%'},
        hAxis: {
          title: xLabel,
          minValue: 0
        },
        vAxis: {
          title: yLabel
        }
      };

      var chart = new GoogleCharts.api.visualization.BarChart(el);
      chart.draw(data, options);
    }

    GoogleCharts.load(drawChart);
  }

  return <div {...props} ref={onElement} class="component-bar-chart"></div>
}
