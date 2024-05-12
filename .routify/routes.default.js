

export default {
  "meta": {},
  "id": "_default",
  "name": "",
  "file": {
    "path": "src/routes",
    "dir": "src",
    "base": "routes",
    "ext": "",
    "name": "routes"
  },
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {},
      "id": "_default__layout_svelte",
      "name": "+layout",
      "file": {
        "path": "src/routes/+layout.svelte",
        "dir": "src/routes",
        "base": "+layout.svelte",
        "ext": ".svelte",
        "name": "+layout"
      },
      "asyncModule": () => import('../src/routes/+layout.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default__page_svelte",
      "name": "+page",
      "file": {
        "path": "src/routes/+page.svelte",
        "dir": "src/routes",
        "base": "+page.svelte",
        "ext": ".svelte",
        "name": "+page"
      },
      "asyncModule": () => import('../src/routes/+page.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_admin",
      "name": "admin",
      "module": false,
      "file": {
        "path": "src/routes/admin",
        "dir": "src/routes",
        "base": "admin",
        "ext": "",
        "name": "admin"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_admin__layout_svelte",
          "name": "+layout",
          "file": {
            "path": "src/routes/admin/+layout.svelte",
            "dir": "src/routes/admin",
            "base": "+layout.svelte",
            "ext": ".svelte",
            "name": "+layout"
          },
          "asyncModule": () => import('../src/routes/admin/+layout.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_admin__page_svelte",
          "name": "+page",
          "file": {
            "path": "src/routes/admin/+page.svelte",
            "dir": "src/routes/admin",
            "base": "+page.svelte",
            "ext": ".svelte",
            "name": "+page"
          },
          "asyncModule": () => import('../src/routes/admin/+page.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_admin_inventory",
          "name": "inventory",
          "module": false,
          "file": {
            "path": "src/routes/admin/inventory",
            "dir": "src/routes/admin",
            "base": "inventory",
            "ext": "",
            "name": "inventory"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_admin_inventory__page_svelte",
              "name": "+page",
              "file": {
                "path": "src/routes/admin/inventory/+page.svelte",
                "dir": "src/routes/admin/inventory",
                "base": "+page.svelte",
                "ext": ".svelte",
                "name": "+page"
              },
              "asyncModule": () => import('../src/routes/admin/inventory/+page.svelte'),
              "children": []
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_admin_invoices",
          "name": "invoices",
          "module": false,
          "file": {
            "path": "src/routes/admin/invoices",
            "dir": "src/routes/admin",
            "base": "invoices",
            "ext": "",
            "name": "invoices"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_admin_invoices__page_svelte",
              "name": "+page",
              "file": {
                "path": "src/routes/admin/invoices/+page.svelte",
                "dir": "src/routes/admin/invoices",
                "base": "+page.svelte",
                "ext": ".svelte",
                "name": "+page"
              },
              "asyncModule": () => import('../src/routes/admin/invoices/+page.svelte'),
              "children": []
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_admin_logistics",
          "name": "logistics",
          "module": false,
          "file": {
            "path": "src/routes/admin/logistics",
            "dir": "src/routes/admin",
            "base": "logistics",
            "ext": "",
            "name": "logistics"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_admin_logistics__page_svelte",
              "name": "+page",
              "file": {
                "path": "src/routes/admin/logistics/+page.svelte",
                "dir": "src/routes/admin/logistics",
                "base": "+page.svelte",
                "ext": ".svelte",
                "name": "+page"
              },
              "asyncModule": () => import('../src/routes/admin/logistics/+page.svelte'),
              "children": []
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_admin_products",
          "name": "products",
          "module": false,
          "file": {
            "path": "src/routes/admin/products",
            "dir": "src/routes/admin",
            "base": "products",
            "ext": "",
            "name": "products"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_admin_products__page_svelte",
              "name": "+page",
              "file": {
                "path": "src/routes/admin/products/+page.svelte",
                "dir": "src/routes/admin/products",
                "base": "+page.svelte",
                "ext": ".svelte",
                "name": "+page"
              },
              "asyncModule": () => import('../src/routes/admin/products/+page.svelte'),
              "children": []
            },
            {
              "meta": {},
              "id": "_default_admin_products_new",
              "name": "new",
              "module": false,
              "file": {
                "path": "src/routes/admin/products/new",
                "dir": "src/routes/admin/products",
                "base": "new",
                "ext": "",
                "name": "new"
              },
              "children": [
                {
                  "meta": {},
                  "id": "_default_admin_products_new__page_svelte",
                  "name": "+page",
                  "file": {
                    "path": "src/routes/admin/products/new/+page.svelte",
                    "dir": "src/routes/admin/products/new",
                    "base": "+page.svelte",
                    "ext": ".svelte",
                    "name": "+page"
                  },
                  "asyncModule": () => import('../src/routes/admin/products/new/+page.svelte'),
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_admin_sales",
          "name": "sales",
          "module": false,
          "file": {
            "path": "src/routes/admin/sales",
            "dir": "src/routes/admin",
            "base": "sales",
            "ext": "",
            "name": "sales"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_admin_sales__page_svelte",
              "name": "+page",
              "file": {
                "path": "src/routes/admin/sales/+page.svelte",
                "dir": "src/routes/admin/sales",
                "base": "+page.svelte",
                "ext": ".svelte",
                "name": "+page"
              },
              "asyncModule": () => import('../src/routes/admin/sales/+page.svelte'),
              "children": []
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_admin_settings",
          "name": "settings",
          "module": false,
          "file": {
            "path": "src/routes/admin/settings",
            "dir": "src/routes/admin",
            "base": "settings",
            "ext": "",
            "name": "settings"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_admin_settings__page_svelte",
              "name": "+page",
              "file": {
                "path": "src/routes/admin/settings/+page.svelte",
                "dir": "src/routes/admin/settings",
                "base": "+page.svelte",
                "ext": ".svelte",
                "name": "+page"
              },
              "asyncModule": () => import('../src/routes/admin/settings/+page.svelte'),
              "children": []
            }
          ]
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_api",
      "name": "api",
      "module": false,
      "file": {
        "path": "src/routes/api",
        "dir": "src/routes",
        "base": "api",
        "ext": "",
        "name": "api"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_api_auth",
          "name": "auth",
          "module": false,
          "file": {
            "path": "src/routes/api/auth",
            "dir": "src/routes/api",
            "base": "auth",
            "ext": "",
            "name": "auth"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_api_auth_login",
              "name": "login",
              "module": false,
              "file": {
                "path": "src/routes/api/auth/login",
                "dir": "src/routes/api/auth",
                "base": "login",
                "ext": "",
                "name": "login"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_api_auth_logout",
              "name": "logout",
              "module": false,
              "file": {
                "path": "src/routes/api/auth/logout",
                "dir": "src/routes/api/auth",
                "base": "logout",
                "ext": "",
                "name": "logout"
              },
              "children": []
            }
          ]
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_demo_svelte",
      "name": "demo",
      "file": {
        "path": "src/routes/demo.svelte",
        "dir": "src/routes",
        "base": "demo.svelte",
        "ext": ".svelte",
        "name": "demo"
      },
      "asyncModule": () => import('../src/routes/demo.svelte'),
      "children": []
    },
    {
      "meta": {
        "isDefault": true
      },
      "id": "_default_index_svelte",
      "name": "index",
      "file": {
        "path": "src/routes/index.svelte",
        "dir": "src/routes",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "asyncModule": () => import('../src/routes/index.svelte'),
      "children": []
    },
    {
      "meta": {
        "dynamic": true,
        "dynamicSpread": true,
        "order": false,
        "inline": false
      },
      "name": "[...404]",
      "file": {
        "path": ".routify/components/[...404].svelte",
        "dir": ".routify/components",
        "base": "[...404].svelte",
        "ext": ".svelte",
        "name": "[...404]"
      },
      "asyncModule": () => import('./components/[...404].svelte'),
      "children": []
    }
  ]
}