import { CategoryService } from '../../../platform/categories/category-service.ts';
import { IntentsService } from '../../../platform/intents/intents-service.ts';
import { useInject } from '../../contexts/app.tsx';
import './sidebar.scss'
import { h } from "preact";
import { Link } from "preact-router/match";

export function Sidebar() {
  const categoriesService = useInject(CategoryService)
  const intentsService = useInject(IntentsService)

  function addCategory() {
    const value = prompt('What is the name of the category')
    if (!value) {
      return
    }
    categoriesService.newCategory(value)
  }

  return <nav class="component-sidebar">
    <Link 
      class='item' 
      href="/"
      activeClassName="active"
      >Overview</Link>

    <Link 
      class='item' 
      href="/category/all"
      activeClassName="active"
      >All Intents<span>[{intentsService.getIntents().size}]</span>
    </Link>

    <div 
      className="heading">
      Custom Categories 
      <button onClick={addCategory}>+</button>
    </div>

    {categoriesService.entries().map(([name]) => (
      <Link 
        class='item' 
        href={`/category/${name}`}
        activeClassName="active"
        >{name} <span>[{categoriesService.getIntentsFor(name)?.size}]</span>
      </Link>
    ))}
    <div className="heading">Automatic Categories</div>
  </nav>
}
