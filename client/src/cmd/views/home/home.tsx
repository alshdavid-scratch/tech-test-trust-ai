import './home.scss'
import { h } from "preact";
import { useInject } from '../../contexts/app.tsx';
import { CategoryService } from '../../../platform/categories/category-service.ts';
import { IntentsService } from '../../../platform/intents/intents-service.ts';
import { useState } from 'preact/hooks';
import { PieChart } from '../../components/pie-chart/pie-chart.tsx';
import { classNames } from '../../../platform/elements/class-names.ts';
import { Panel, PanelHeader, PanelList, PanelListItem, PanelSection } from '../../components/panel/panel.tsx';
import { BarChart } from '../../components/bar-chart/bar-chart.tsx';

export function HomeView() {
  const categoriesService = useInject(CategoryService)
  const intentsService = useInject(IntentsService)
  const [selectedCategory, setSelectedCategory] = useState<string>('foo')

  const categoryIntents = categoriesService.getCategorySummary()

  return <div class="view-home">
    <BarChart 
      title="Number of hits per category" 
      xLabel="Hits" 
      yLabel="Category" 
      rawData={Object.fromEntries(categoryIntents)} />
  </div>
}
