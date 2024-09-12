import { CategoryService } from '../../../platform/categories/category-service.ts';
import { classNames } from '../../../platform/elements/class-names.ts';
import { IntentsService } from '../../../platform/intents/intents-service.ts';
import { useInject } from '../../contexts/app.tsx';
import './sidebar.scss'
import { h } from "preact";
import { useRouter } from "preact-router";
import { Link } from "preact-router/match";

export function Sidebar() {
  const [router, route] = useRouter()
  const categoriesService = useInject(CategoryService)
  const intentsService = useInject(IntentsService)

  const selectedCategory = router.matches?.selectedCategory


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

    <div className="heading">Custom Categories <button>+</button></div>
    {categoriesService.entries().map(([name]) => (
      <Link 
        class='item' 
        href={`/category/${name}`}
        activeClassName="active"
        >{name} <span>[{categoriesService.getIntents(name)?.size}]</span>
      </Link>
    ))}
    <div className="heading">Automatic Categories</div>
  </nav>
}
