// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../../../routes/paths'
// components
import Label from '../../../components/Label'
import Iconify from '../../../components/Iconify'
import SvgIconStyle from '../../../components/SvgIconStyle'

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item')
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: '',
    items: [

      {
        title: 'Proyectos',
        path: PATH_DASHBOARD.proyectos.root,
        icon: ICONS.kanban,
      },
      {
        title: 'Tareas',
        path: PATH_DASHBOARD.tareas.root,
        icon: ICONS.banking,
      },
      {
        title: 'Notificaciones',
        path: PATH_DASHBOARD.notificaciones.root,
        icon: ICONS.blog,
      }
    ]
  }

]

export default navConfig
