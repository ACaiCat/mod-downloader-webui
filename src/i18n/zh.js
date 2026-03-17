const zh = {
  app: {
    title: '垃圾 Workshop 下载器',
    subtitle: '这坨东西是我几小时搓出来的，很垃圾所以别骂我 :(',
  },
  nav: {
    home: '首页',
    about: '关于',
  },
  search: {
    placeholder: '输入创意工坊 URL 或模组 ID',
    button: '查看对应 Depot 文件',
    queue: '添加到下载队列',
    hint: '支持 Steam 创意工坊链接或纯数字 ID',
    searching: '查询中...',
    submitted: '已提交下载队列',
    queueFailed: '加入队列失败',
  },
  queueError: {
    alreadyDownloaded: '该模组一天内已下载过',
    tooManyQueued: '队列已满，请稍后再试',
  },
  versions: {
    title: '可用版本',
    empty: '暂无可用版本',
    loading: '加载中...',
    notFound: '未找到该模组',
    version: '版本',
    lastModified: '最后修改',
    selectVersion: '选择版本查看资源',
  },
  files: {
    title: '模组文件',
    name: '文件名',
    size: '大小',
    lastModified: '最后修改',
    download: '下载',
    back: '返回版本列表',
    empty: '该版本暂无文件',
  },
  error: {
    network: '网络连接失败，请检查网络',
    notFound: '请求的资源不存在',
    server: '服务器错误，请稍后重试',
    unknown: '发生未知错误',
    invalidInput: '请输入有效的模组 ID 或链接',
  },
  theme: {
    light: '浅色',
    dark: '深色',
    system: '跟随系统',
  },
  language: {
    zh: '中文',
    en: 'English',
  },
  storage: {
    title: '服务器存储',
    free: '可用',
    total: '总共',
    used: '已用',
    loading: '加载中...',
    loadFailed: '存储信息加载失败',
  },
  usage: {
    title: '用法',
    steps: [
      '打开 Steam 创意工坊，例如 tModLoader 或泰拉瑞亚的创意工坊页面',
      '搜索你想要的模组或材质包',
      '点击进入模组详情页（能看到绿色的“订阅”按钮的那个页面）',
      '复制浏览器地址栏里的链接',
      '回到本页面，把链接粘贴到上方的输入框中',
      '点击“查看对应 Depot 文件”',
      '如果提示 404，点击“添加到下载队列”，等待 10–30 秒让服务器从 Steam 拉取文件',
      '然后再次点击“查看对应 Depot 文件”',
      '大功告成，现在可以下载模组文件了 :)',
    ],
    tips: [
      '建议先点“查看对应 Depot 文件”确认是否已有缓存，避免浪费时间',
      '不要上来就点“添加到下载队列”，仅在模组有更新时使用',
      '不支持合集类型的创意工坊物品，请逐个下载',
    ],
  },
  footer: {
    disclaimer: '本站仅提供 Steam 创意工坊模组镜像下载服务',
  },
}

export default zh
