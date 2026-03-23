import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'avs8mde7',
    dataset: 'production'
  },
  deployment: {
    appId: 'bv77nc4aydvohas81pu9e2mq',
    autoUpdates: true,
  }
})
