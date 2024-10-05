import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  region: icon('ic-map'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        permission: 'view:dashboard',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
      },
      {
        title: 'My Unions',
        permission: 'view:myUnions',
        path: paths.dashboard.general.coopUnions,
        icon: ICONS.course,
      },
      {
        title: 'My Cooperatives',
        permission: 'view:myCoops',
        path: paths.dashboard.general.myCoops,
        icon: ICONS.course,
      },
      // { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
      // { title: 'Banking', path: paths.dashboard.general.banking, icon: ICONS.banking },
      // { title: 'Booking', path: paths.dashboard.general.booking, icon: ICONS.booking },
      // { title: 'File', path: paths.dashboard.general.file, icon: ICONS.file },
      // { title: 'Course', path: paths.dashboard.general.course, icon: ICONS.course },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'User',
        permission: 'view:user',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          // { title: 'Profile', path: paths.dashboard.user.root },
          // { title: 'Cards', path: paths.dashboard.user.cards },
          { title: 'Users', path: paths.dashboard.user.list },
          { title: 'Create', path: paths.dashboard.user.new },
          // { title: 'Edit', path: paths.dashboard.user.demo.edit },
          { title: 'Farmers', path: paths.dashboard.user.farmer },
          { title: 'Stakeholders', path: paths.dashboard.user.stakeholder },
        ],
      },

      {
        title: 'Users',
        permission: 'view:users',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Assign Admin', path: paths.dashboard.cooperative.assignAdmin },
          { title: 'Admins', path: paths.dashboard.cooperative.admin },
        ],
      },

      {
        title: 'Farmers',
        permission: 'view:farmer',
        path: paths.dashboard.farner.root,
        icon: ICONS.banking,
        children: [
          { title: 'New farmer', path: paths.dashboard.farner.newCoopFarmer },
          { title: 'Farmers', path: paths.dashboard.farner.coopFarmers },
          { title: 'Harvest', path: paths.dashboard.farner.harvest },
          { title: 'GRN', path: paths.dashboard.farner.grn },
          { title: 'Invoice', path: paths.dashboard.invoice.root },
          { title: 'Warehouse Receipt', path: paths.dashboard.farner.warehouse },
          { title: 'Tasks', path: paths.dashboard.farner.tasks, icon: ICONS.analytics },
        ],
      },
      {
        title: 'Cooperative Mgt',
        permission: 'view:cooperative',
        path: paths.dashboard.cooperative.root,
        icon: ICONS.banking,
        children: [
          { title: 'Cooperatives', path: paths.dashboard.cooperative.root },
          { title: 'Create', path: paths.dashboard.cooperative.new },
          { title: 'Assign Admin', path: paths.dashboard.cooperative.assignAdmin },
          { title: 'Admins', path: paths.dashboard.cooperative.admin },
          { title: 'Unions', path: paths.dashboard.cooperative.union },
        ],
      },

      {
        title: 'County',
        permission: 'view:county',
        path: paths.dashboard.county.root,
        icon: ICONS.job,
        children: [
          { title: 'Counties', path: paths.dashboard.county.list },
          { title: 'Create', path: paths.dashboard.county.new },
        ],
      },

      {
        title: 'Value Chain',
        permission: 'view:valuechain',
        path: paths.dashboard.valuechain.root,
        icon: ICONS.kanban,
        children: [
          { title: 'Value chain list', path: paths.dashboard.valuechain.root },
          { title: 'Create', path: paths.dashboard.valuechain.new },
        ],
      },
      // {
      //   title: 'Product',
      //   path: paths.dashboard.product.root,
      //   permission: 'view:product',
      //   icon: ICONS.product,
      //   children: [
      //     { title: 'List', path: paths.dashboard.product.root },
      //     // { title: 'Details', path: paths.dashboard.product.demo.details },
      //     { title: 'Create', path: paths.dashboard.product.new },
      //     // { title: 'Edit', path: paths.dashboard.product.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Order',
      //   path: paths.dashboard.order.root,
      //   icon: ICONS.order,
      //   children: [
      //     { title: 'List', path: paths.dashboard.order.root },
      //     { title: 'Details', path: paths.dashboard.order.demo.details },
      //   ],
      // },

      // {
      //   title: 'Blog',
      //   path: paths.dashboard.post.root,
      //   icon: ICONS.blog,
      //   permission: 'view:cooperative',

      //   children: [
      //     { title: 'List', path: paths.dashboard.post.root },
      //     { title: 'Details', path: paths.dashboard.post.demo.details },
      //     { title: 'Create', path: paths.dashboard.post.new },
      //     { title: 'Edit', path: paths.dashboard.post.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Job',
      //   path: paths.dashboard.job.root,
      //   icon: ICONS.job,
      //   children: [
      //     { title: 'List', path: paths.dashboard.job.root },
      //     { title: 'Details', path: paths.dashboard.job.demo.details },
      //     { title: 'Create', path: paths.dashboard.job.new },
      //     { title: 'Edit', path: paths.dashboard.job.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Tour',
      //   path: paths.dashboard.tour.root,
      //   icon: ICONS.tour,
      //   children: [
      //     { title: 'List', path: paths.dashboard.tour.root },
      //     { title: 'Details', path: paths.dashboard.tour.demo.details },
      //     { title: 'Create', path: paths.dashboard.tour.new },
      //     { title: 'Edit', path: paths.dashboard.tour.demo.edit },
      //   ],
      // },
      // { title: 'File manager', path: paths.dashboard.fileManager, icon: ICONS.folder },
      // {
      //   title: 'Mail',
      //   path: paths.dashboard.mail,
      //   icon: ICONS.mail,
      //   info: (
      //     <Label color="error" variant="inverted">
      //       +32
      //     </Label>
      //   ),
      // },
      // { title: 'Chat', path: paths.dashboard.chat, icon: ICONS.chat },
      // { title: 'Calendar', path: paths.dashboard.calendar, icon: ICONS.calendar },
      // { title: 'Kanban', path: paths.dashboard.kanban, icon: ICONS.kanban },
    ],
  },
  {
    subheader: 'Bank Payment',
    items: [
      {
        title: 'Payment Narratives',
        path: paths.dashboard.payments.root,
        icon: ICONS.invoice,
        permission: 'view:invoice',
        children: [{ title: 'Bank files', path: paths.dashboard.payments.root }],
      },
    ],
  },
  {
    subheader: 'Marketplace Mgt',
    items: [
      {
        title: 'Product',
        path: paths.dashboard.product.root,
        permission: 'view:product',
        icon: ICONS.product,
        children: [
          { title: 'List', path: paths.dashboard.product.root },
          // { title: 'Details', path: paths.dashboard.product.demo.details },
          { title: 'Create', path: paths.dashboard.product.new },
          // { title: 'Edit', path: paths.dashboard.product.demo.edit },
        ],
      },
      {
        title: 'Categories',
        permission: 'view:category',
        path: paths.dashboard.category.root,
        icon: ICONS.job,
        children: [
          { title: 'Categories', path: paths.dashboard.category.root },
          { title: 'New Category', path: paths.dashboard.category.new },
        ],
      },
      {
        title: 'Purchase Orders',
        path: paths.dashboard.order.root,
        icon: ICONS.order,
        permission: 'view:order',
        children: [{ title: 'Orders', path: paths.dashboard.order.root }],
      },
      // {
      //   title: 'Invoice',
      //   path: paths.dashboard.invoice.root,
      //   icon: ICONS.invoice,
      //   permission: 'view:invoice',
      //   children: [
      //     { title: 'List', path: paths.dashboard.invoice.root },
      //     { title: 'Details', path: paths.dashboard.invoice.demo.details },
      //     { title: 'Create', path: paths.dashboard.invoice.new },
      //     { title: 'Edit', path: paths.dashboard.invoice.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Catalog',
      //   permission: 'view:category',
      //   path: paths.dashboard.category.root,
      //   icon: ICONS.job,
      //   children: [
      //     { title: 'List', path: paths.dashboard.category.root },
      //     { title: 'New', path: paths.dashboard.category.new },
      //   ],
      // },
      // {
      //   title: 'Payment Channels',
      //   permission: 'view:category',
      //   path: paths.dashboard.category.root,
      //   icon: ICONS.job,
      //   children: [
      //     { title: 'Channels', path: paths.dashboard.category.root },
      //     { title: 'New Payment Channel', path: paths.dashboard.category.new },
      //   ],
      // },
    ],
  },
  {
    subheader: 'Communication',
    items: [
      {
        title: 'Notification',
        path: paths.dashboard.notification.root,
        icon: ICONS.invoice,
        permission: 'view:invoice',
        children: [{ title: 'Notifications', path: paths.dashboard.notification.root }],
      },
    ],
  },
  /**
   * Item State
   */
  {
    subheader: 'Misc',
    items: [
      {
        // default roles : All roles can see this entry.
        // roles: ['user'] Only users can see this item.
        // roles: ['admin'] Only admin can see this item.
        // roles: ['admin', 'manager'] Only admin/manager can see this item.
        // Reference from 'src/guards/RoleBasedGuard'.
        title: 'Permission',
        permission: 'view:permission',
        path: paths.dashboard.permission,
        icon: ICONS.lock,
        roles: ['admin', 'manager'],
        caption: 'Only admin can see this item',
        children: [],
      },
      // {
      //   title: 'Level',
      //   path: '#/dashboard/menu_level',
      //   icon: ICONS.menuItem,
      //   children: [
      //     {
      //       title: 'Level 1a',
      //       path: '#/dashboard/menu_level/menu_level_1a',
      //       children: [
      //         {
      //           title: 'Level 2a',
      //           path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a',
      //         },
      //         {
      //           title: 'Level 2b',
      //           path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b',
      //           children: [
      //             {
      //               title: 'Level 3a',
      //               path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3a',
      //             },
      //             {
      //               title: 'Level 3b',
      //               path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3b',
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     { title: 'Level 1b', path: '#/dashboard/menu_level/menu_level_1b' },
      //   ],
      // },
      // {
      //   title: 'Disabled',
      //   path: '#disabled',
      //   icon: ICONS.disabled,
      //   disabled: true,
      // },
      // {
      //   title: 'Label',
      //   path: '#label',
      //   icon: ICONS.label,
      //   info: (
      //     <Label
      //       color="info"
      //       variant="inverted"
      //       startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
      //     >
      //       NEW
      //     </Label>
      //   ),
      // },
      // {
      //   title: 'Caption',
      //   path: '#caption',
      //   icon: ICONS.menuItem,
      //   caption:
      //     'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
      // },
      // {
      //   title: 'Params',
      //   path: '/dashboard/params?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      //   icon: ICONS.parameter,
      // },
      // {
      //   title: 'External link',
      //   path: 'https://www.google.com/',
      //   icon: ICONS.external,
      //   info: <Iconify width={18} icon="prime:external-link" />,
      // },
      // { title: 'Blank', path: paths.dashboard.blank, icon: ICONS.blank },
    ],
  },
];
