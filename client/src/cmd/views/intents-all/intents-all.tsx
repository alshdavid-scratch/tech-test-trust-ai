import './intents-all.scss'
import { h } from "preact";
import { useInject } from '../../contexts/app.tsx';
import { IntentsService } from '../../../platform/intents/intents-service.ts';
import { PanelHeader, PanelList, PanelListItem } from '../../components/panel/panel.tsx';

export function IntentsAllView() {
  const intentsService = useInject(IntentsService)

  const intents = intentsService.getIntents()
  
  return <div class="view-intents-id">
    <PanelHeader>
      <div>All Intents</div>
    </PanelHeader>

    <PanelList>
      {Array.from(intents.entries()).map(([intent, count]) => (
        <PanelListItem>
          {intent}
          <span>{count}</span>
        </PanelListItem>))}
    </PanelList>
  </div>
}
