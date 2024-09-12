import './intents-id.scss'
import { h } from "preact";
import { useInject } from '../../contexts/app.tsx';
import { CategoryService } from '../../../platform/categories/category-service.ts';
import { IntentsService } from '../../../platform/intents/intents-service.ts';
import { PieChart } from '../../components/pie-chart/pie-chart.tsx';
import { Panel, PanelHeader, PanelList, PanelListItem, PanelSection } from '../../components/panel/panel.tsx';
import { useRouter } from 'preact-router';

export function IntentsIdView() {
  const [router, route] = useRouter()
  const categoriesService = useInject(CategoryService)
  const intentsService = useInject(IntentsService)

  const selectedCategory = router.matches?.selectedCategory
  if (!selectedCategory) {
    route('/category/all')
    return null
  }

  const intentsForCategory = categoriesService.getIntents(selectedCategory)
  if (!intentsForCategory) {
    route('/category/all')
    return null
  }

  const intentsListForCategory = Array.from(intentsForCategory.keys())
  const intentsToAdd = Array.from(intentsService.getIntents().keys()).filter(v => !intentsListForCategory.includes(v))

  return <div class="view-intents-id">
    <PanelHeader>
      <div>Category: {selectedCategory}</div>
      <button onClick={() => categoriesService.removeCategory(selectedCategory)}>Delete</button>
    </PanelHeader>

    <PanelSection class="summary">
      <PieChart rawData={Object.fromEntries(intentsForCategory)} style={{ height: '400px'}} />
    </PanelSection>

    <Panel class="panel-included-intents">
      <PanelHeader>
        Included Intents
      </PanelHeader>

      <PanelList>
        {intentsListForCategory.map(intent => (
          <PanelListItem>
            {intent}
            <button onClick={() => categoriesService.removeIntent(selectedCategory, intent)}>X</button>
          </PanelListItem>))}
      </PanelList>
    </Panel>

    {selectedCategory !== 'all' && (
      <Panel class="panel-add-intents">
        <PanelHeader>
          Add Intents
        </PanelHeader>

        <PanelList>
          {intentsToAdd.map(intent => (
            <PanelListItem 
              onClick={() => categoriesService.addIntent(selectedCategory, intent)}>
              {intent}
            </PanelListItem>
          ))}
        </PanelList>
      </Panel>
      )}
  </div>
}
